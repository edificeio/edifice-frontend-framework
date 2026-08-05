import { WorkspaceElement } from '@edifice.io/client';
import { render, screen, waitFor } from '~/setup';
import UploadFiles from './UploadFiles';

const { useUploadFiles, revokeObjectURL, createObjectURL } = vi.hoisted(() => ({
  useUploadFiles: vi.fn(),
  revokeObjectURL: vi.fn(),
  createObjectURL: vi.fn((file: File) => `blob:${file.name}`),
}));

vi.mock('../../../hooks', () => ({ useUploadFiles }));

// The card and the editor have their own specs.
vi.mock('../UploadCard', () => ({
  UploadCard: ({
    item,
    status,
    onEdit,
    onRetry,
    onDelete,
  }: {
    item: { name: string; src: string; info: { type: string; weight: string } };
    status: string;
    onEdit: () => void;
    onRetry: () => void;
    onDelete: () => void;
  }) => (
    <div
      data-testid={`card-${item.name}`}
      data-status={status}
      data-src={item.src}
    >
      <span data-testid={`weight-${item.name}`}>{item.info.weight}</span>
      <button onClick={onEdit}>edit-{item.name}</button>
      <button onClick={onRetry}>retry-{item.name}</button>
      <button onClick={onDelete}>delete-{item.name}</button>
    </div>
  ),
}));

vi.mock('../ImageEditor/components/ImageEditor', () => ({
  default: ({
    image,
    altText,
    legend,
    onCancel,
    onSave,
  }: {
    image: string;
    altText: string;
    legend: string;
    onCancel: () => void;
    onSave: (arg: unknown) => void;
  }) => (
    <div
      data-testid="image-editor"
      data-image={image}
      data-alt={altText}
      data-legend={legend}
    >
      <button onClick={onCancel}>cancel-edit</button>
      <button onClick={() => onSave({ blob: new Blob(), legend, altText })}>
        save-edit
      </button>
    </div>
  ),
}));

function file(name: string, type = 'image/png') {
  return new File(['x'], name, { type });
}

function resource(name: string): WorkspaceElement {
  return {
    _id: `res-${name}`,
    name,
    alt: 'Un texte alternatif',
    title: 'Une légende',
  } as unknown as WorkspaceElement;
}

function setup({
  files = [file('photo.png')],
  uploadedFiles = [] as WorkspaceElement[],
  editingImage = undefined as WorkspaceElement | undefined,
  status = 'success',
} = {}) {
  const uploadFile = vi.fn();
  const removeFile = vi.fn();
  const updateImage = vi.fn();
  const setEditingImage = vi.fn();
  const getUrl = vi.fn(() => '/workspace/document/edited');
  const onFilesChange = vi.fn();

  useUploadFiles.mockReturnValue({
    files,
    uploadedFiles,
    getUploadStatus: () => status,
    uploadFile,
    removeFile,
    updateImage,
    editingImage,
    setEditingImage,
    getUrl,
  });

  return {
    ...render(<UploadFiles onFilesChange={onFilesChange} />),
    uploadFile,
    removeFile,
    updateImage,
    setEditingImage,
    getUrl,
    onFilesChange,
  };
}

describe('UploadFiles', () => {
  // Defined on the real URL object for the whole file rather than stubbed per
  // test: the component revokes its blobs in a cleanup effect, which React runs
  // during Testing Library's own teardown — after a per-test unstub would have
  // removed the methods again.
  beforeAll(() => {
    Object.defineProperty(URL, 'createObjectURL', {
      value: createObjectURL,
      configurable: true,
      writable: true,
    });
    Object.defineProperty(URL, 'revokeObjectURL', {
      value: revokeObjectURL,
      configurable: true,
      writable: true,
    });
  });

  it('wires the upload hook to the caller callback', () => {
    const { onFilesChange } = setup();

    expect(useUploadFiles).toHaveBeenCalledWith(
      expect.objectContaining({
        handleOnChange: onFilesChange,
        application: 'media-library',
        visibility: 'protected',
      }),
    );
  });

  it('renders one card per file, with its status', () => {
    setup({ files: [file('a.png'), file('b.pdf', 'application/pdf')] });

    expect(screen.getByTestId('card-a.png')).toHaveAttribute(
      'data-status',
      'success',
    );
    expect(screen.getByTestId('card-b.pdf')).toBeInTheDocument();
  });

  it('creates a preview blob for an image', () => {
    setup({ files: [file('photo.png')] });

    expect(createObjectURL).toHaveBeenCalled();
  });

  it('creates no preview for a document', () => {
    setup({ files: [file('rapport.pdf', 'application/pdf')] });

    expect(screen.getByTestId('card-rapport.pdf')).toHaveAttribute(
      'data-src',
      '',
    );
  });

  it('displays a human readable file weight', () => {
    setup({ files: [file('photo.png')] });

    expect(screen.getByTestId('weight-photo.png').textContent).not.toBe('');
  });

  it('retries the upload of a file', async () => {
    const { user, uploadFile } = setup();

    await user.click(screen.getByRole('button', { name: 'retry-photo.png' }));

    expect(uploadFile).toHaveBeenCalledWith(
      expect.objectContaining({ name: 'photo.png' }),
    );
  });

  it('releases the preview blob when a file is removed', async () => {
    const { user, removeFile } = setup();

    await user.click(screen.getByRole('button', { name: 'delete-photo.png' }));

    expect(revokeObjectURL).toHaveBeenCalled();
    expect(removeFile).toHaveBeenCalledWith(
      expect.objectContaining({ name: 'photo.png' }),
    );
  });

  it('releases every remaining blob on unmount', () => {
    const { unmount } = setup({ files: [file('a.png'), file('b.png')] });
    revokeObjectURL.mockClear();

    unmount();

    expect(revokeObjectURL).toHaveBeenCalledTimes(2);
  });

  it('asks to edit the resource matching the file', async () => {
    const { user, setEditingImage } = setup({
      files: [file('photo.png')],
      uploadedFiles: [resource('photo.png')],
    });

    await user.click(screen.getByRole('button', { name: 'edit-photo.png' }));

    expect(setEditingImage).toHaveBeenCalledWith(
      expect.objectContaining({ name: 'photo.png' }),
    );
  });

  it('asks to edit nothing when no resource matches yet', async () => {
    const { user, setEditingImage } = setup({ uploadedFiles: [] });

    await user.click(screen.getByRole('button', { name: 'edit-photo.png' }));

    expect(setEditingImage).toHaveBeenCalledWith(undefined);
  });

  describe('image editor', () => {
    it('stays closed while nothing is being edited', () => {
      setup();

      expect(screen.queryByTestId('image-editor')).not.toBeInTheDocument();
    });

    it('opens on the resource being edited, with its texts', async () => {
      setup({ editingImage: resource('photo.png') });

      const editor = await screen.findByTestId('image-editor');
      expect(editor).toHaveAttribute(
        'data-image',
        '/workspace/document/edited',
      );
      expect(editor).toHaveAttribute('data-alt', 'Un texte alternatif');
      expect(editor).toHaveAttribute('data-legend', 'Une légende');
    });

    it('closes on cancel', async () => {
      const { user, setEditingImage } = setup({
        editingImage: resource('photo.png'),
      });

      await user.click(
        await screen.findByRole('button', { name: 'cancel-edit' }),
      );

      expect(setEditingImage).toHaveBeenCalledWith(undefined);
    });

    it('hands the edited image over to the hook', async () => {
      const { user, updateImage } = setup({
        editingImage: resource('photo.png'),
      });

      await user.click(
        await screen.findByRole('button', { name: 'save-edit' }),
      );

      await waitFor(() => expect(updateImage).toHaveBeenCalled());
    });
  });
});
