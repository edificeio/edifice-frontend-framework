import { render, screen, waitFor } from '~/setup';
import ImageEditor from './ImageEditor';

const { useImageEditor, applicationInit, applicationDestroy } = vi.hoisted(
  () => ({
    useImageEditor: vi.fn(),
    applicationInit: vi.fn(),
    applicationDestroy: vi.fn(),
  }),
);

vi.mock('../hooks/useImageEditor', () => ({ default: useImageEditor }));

// A real PIXI.Application would need WebGL, absent from jsdom.
vi.mock('pixi.js', () => ({
  Application: class {
    canvas = document.createElement('canvas');
    init = applicationInit;
    destroy = applicationDestroy;
  },
}));

// The toolbar has its own surface; here it only needs to trigger the actions.
vi.mock('./ImageEditorToolbar', () => ({
  default: ({
    handle,
    historyCount,
  }: {
    handle: (operation: string) => void;
    historyCount: number;
  }) => (
    <div>
      <span data-testid="history-count">{historyCount}</span>
      {['ROTATE', 'UNDO', 'CROP', 'RESIZE', 'BLUR'].map((operation) => (
        <button key={operation} onClick={() => handle(operation)}>
          {operation}
        </button>
      ))}
    </div>
  ),
}));

function setup(
  options: {
    loading?: boolean;
    historyCount?: number;
    blob?: Blob | undefined;
    toBlobImpl?: () => Promise<Blob | undefined>;
    legend?: string;
    altText?: string;
    onError?: ((error: string) => void) | undefined;
  } = {},
) {
  const {
    loading = false,
    historyCount = 0,
    toBlobImpl,
    blob: _ignored,
    ...props
  } = options;
  void _ignored;
  // An explicit `blob: undefined` must survive, hence the key check.
  const blob =
    'blob' in options ? options.blob : new Blob(['png'], { type: 'image/png' });

  const editor = {
    toBlob: vi.fn(toBlobImpl ?? (() => Promise.resolve(blob))),
    setApplication: vi.fn(),
    startBlur: vi.fn(),
    stopBlur: vi.fn(),
    restore: vi.fn(),
    rotate: vi.fn(),
    startCrop: vi.fn(),
    stopCrop: vi.fn(),
    startResize: vi.fn(),
    stopResize: vi.fn(),
    historyCount,
    loading,
  };
  useImageEditor.mockReturnValue(editor);

  const onCancel = vi.fn();
  const onSave = vi.fn();
  const onError = vi.fn();

  return {
    ...render(
      <ImageEditor
        image="/workspace/document/image-id"
        isOpen
        onCancel={onCancel}
        onSave={onSave}
        onError={onError}
        {...props}
      />,
    ),
    editor,
    onCancel,
    onSave,
    onError,
  };
}

const saveButton = () =>
  screen.getByRole('button', { name: 'imageeditor.save' });
const altInput = () => screen.getByPlaceholderText('alttext.help');
const legendInput = () => screen.getByPlaceholderText('legend.help');
const overlay = () =>
  document.querySelector('.image-editor .position-absolute');

describe('ImageEditor', () => {
  beforeEach(() => {
    applicationInit.mockResolvedValue(undefined);
  });

  it('renders the editor modal with its toolbar and text fields', () => {
    setup();

    expect(screen.getByText('imageeditor.title')).toBeInTheDocument();
    expect(altInput()).toBeInTheDocument();
    expect(legendInput()).toBeInTheDocument();
    expect(screen.getByTestId('history-count')).toHaveTextContent('0');
  });

  it('loads the editor for the given image', () => {
    setup();

    expect(useImageEditor).toHaveBeenCalledWith({
      imageSrc: '/workspace/document/image-id',
    });
  });

  it('prefills the legend and the alternative text', () => {
    setup({ legend: 'Une légende', altText: 'Un texte alternatif' });

    expect(altInput()).toHaveValue('Un texte alternatif');
    expect(legendInput()).toHaveValue('Une légende');
  });

  it('starts with empty fields when nothing is provided', () => {
    setup();

    expect(altInput()).toHaveValue('');
    expect(legendInput()).toHaveValue('');
  });

  it('shows the loading overlay while the editor works', () => {
    setup({ loading: true });

    expect(overlay()).not.toBeNull();
  });

  it('shows no overlay once loaded', () => {
    setup();

    expect(overlay()).toBeNull();
  });

  describe('PIXI lifecycle', () => {
    it('hands the initialised application over to the editor', async () => {
      const { editor } = setup();

      await waitFor(() => expect(editor.setApplication).toHaveBeenCalled());
      expect(applicationInit).toHaveBeenCalledWith(
        expect.objectContaining({ backgroundAlpha: 0, resolution: 1 }),
      );
    });

    it('keeps the editor application-less when the initialisation fails', async () => {
      applicationInit.mockRejectedValue(new Error('no webgl'));
      const { editor } = setup();

      await waitFor(() => expect(applicationInit).toHaveBeenCalled());
      expect(editor.setApplication).not.toHaveBeenCalled();
    });

    it('destroys the application on unmount', async () => {
      const { editor, unmount } = setup();
      await waitFor(() => expect(editor.setApplication).toHaveBeenCalled());

      unmount();

      expect(applicationDestroy).toHaveBeenCalledWith(true);
    });
  });

  describe('save button', () => {
    it('is disabled until something changes', () => {
      setup();

      expect(saveButton()).toBeDisabled();
    });

    it('is enabled once the alternative text is edited', async () => {
      const { user } = setup();

      await user.type(altInput(), 'a');

      expect(saveButton()).toBeEnabled();
    });

    it('is enabled once the legend is edited', async () => {
      const { user } = setup();

      await user.type(legendInput(), 'a');

      expect(saveButton()).toBeEnabled();
    });

    it('is enabled once an operation is applied', async () => {
      const { user } = setup();

      await user.click(screen.getByRole('button', { name: 'ROTATE' }));

      expect(saveButton()).toBeEnabled();
    });

    it('is disabled again after the props are replaced', async () => {
      const { user, rerender } = setup();
      await user.type(altInput(), 'a');

      rerender(
        <ImageEditor
          image="/workspace/document/other-id"
          isOpen
          altText="Nouveau texte"
          legend="Nouvelle légende"
          onCancel={vi.fn()}
          onSave={vi.fn()}
        />,
      );

      expect(altInput()).toHaveValue('Nouveau texte');
      expect(saveButton()).toBeDisabled();
    });
  });

  describe('saving', () => {
    it('stops the pending operations, then reports the blob and the texts', async () => {
      const blob = new Blob(['png'], { type: 'image/png' });
      const { user, editor, onSave } = setup({ blob });

      await user.type(altInput(), 'alt');
      await user.type(legendInput(), 'legend');
      await user.click(saveButton());

      expect(editor.stopBlur).toHaveBeenCalled();
      await waitFor(() =>
        expect(onSave).toHaveBeenCalledWith({
          blob,
          altText: 'alt',
          legend: 'legend',
        }),
      );
    });

    it('reports nothing when the editor produces no blob', async () => {
      const { user, onSave } = setup({ blob: undefined });

      await user.type(altInput(), 'a');
      await user.click(saveButton());

      await waitFor(() => expect(saveButton()).toBeEnabled());
      expect(onSave).not.toHaveBeenCalled();
    });

    it('surfaces a failure through onError', async () => {
      const { user, onError } = setup({
        toBlobImpl: () => Promise.reject(new Error('extract failed')),
      });

      await user.type(altInput(), 'a');
      await user.click(saveButton());

      await waitFor(() =>
        expect(onError).toHaveBeenCalledWith('Error: extract failed'),
      );
    });

    it('survives a failure without an error handler', async () => {
      const { user } = setup({
        onError: undefined,
        toBlobImpl: () => Promise.reject(new Error('extract failed')),
      });

      await user.type(altInput(), 'a');
      await user.click(saveButton());

      await waitFor(() => expect(saveButton()).toBeEnabled());
    });
  });

  it('cancels from the footer button', async () => {
    const { user, onCancel } = setup();

    await user.click(
      screen.getByRole('button', { name: 'imageeditor.cancel' }),
    );

    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  describe('operations', () => {
    it.each([
      ['ROTATE', 'rotate'],
      ['UNDO', 'restore'],
      ['CROP', 'startCrop'],
      ['RESIZE', 'startResize'],
      ['BLUR', 'startBlur'],
    ] as const)('%s triggers %s on the editor', async (operation, method) => {
      const { user, editor } = setup();

      await user.click(screen.getByRole('button', { name: operation }));

      expect(editor[method]).toHaveBeenCalled();
    });

    it('saves the crop when leaving it for another operation', async () => {
      const { user, editor } = setup();

      await user.click(screen.getByRole('button', { name: 'CROP' }));
      expect(editor.stopCrop).toHaveBeenLastCalledWith(false);

      await user.click(screen.getByRole('button', { name: 'ROTATE' }));

      expect(editor.stopCrop).toHaveBeenLastCalledWith(true);
    });

    it('saves the resize when leaving it for another operation', async () => {
      const { user, editor } = setup();

      await user.click(screen.getByRole('button', { name: 'RESIZE' }));
      await user.click(screen.getByRole('button', { name: 'BLUR' }));

      expect(editor.stopResize).toHaveBeenLastCalledWith(true);
    });
  });
});
