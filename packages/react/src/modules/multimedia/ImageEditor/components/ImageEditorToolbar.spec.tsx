import { render, screen } from '~/setup';

import ImageEditorToolbar from './ImageEditorToolbar';

const setup = ({ historyCount = 0 }: { historyCount?: number } = {}) => {
  const handle = vi.fn();
  const view = render(
    <ImageEditorToolbar historyCount={historyCount} handle={handle} />,
  );
  return { ...view, handle };
};

// <Toolbar> applies `aria-label={item.name}` *after* spreading the caller's
// props, so the accessible name is the internal item name, never the
// `aria-label` this component passes. Hence 'undo' and 'reset' below, while the
// visible labels read 'Cancel' and 'rotate'.
const undoButton = () => screen.getByRole('button', { name: 'undo' });
const rotateButton = () => screen.getByRole('button', { name: 'reset' });
const cropButton = () => screen.getByRole('button', { name: 'crop' });
const blurButton = () => screen.getByRole('button', { name: 'blur' });

describe('ImageEditorToolbar', () => {
  beforeAll(() => {
    // <Toolbar> unconditionally calls useBreakpoint, which relies on
    // window.matchMedia, absent from jsdom.
    vi.stubGlobal('matchMedia', (query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));
  });

  it('offers undo, rotate, crop and blur', () => {
    setup();

    expect(undoButton()).toBeInTheDocument();
    expect(rotateButton()).toBeInTheDocument();
    expect(cropButton()).toBeInTheDocument();
    expect(blurButton()).toBeInTheDocument();
  });

  it('shows the translated labels next to each icon', () => {
    setup();

    // The visible label and the accessible name disagree on two buttons: the
    // name comes from the toolbar item, the label from the translation.
    expect(undoButton()).toHaveTextContent('Cancel');
    expect(rotateButton()).toHaveTextContent('rotate');
  });

  it('has no resize button, although the action type declares one', () => {
    setup();

    // `ImageEditorAction` includes 'RESIZE' and <ImageEditor> handles it, but
    // nothing in this toolbar emits it — the resize is unreachable from the UI.
    expect(screen.queryByRole('button', { name: 'resize' })).toBeNull();
  });

  describe('undo', () => {
    it('is disabled while the history is empty', () => {
      setup({ historyCount: 0 });

      expect(undoButton()).toBeDisabled();
    });

    it('becomes available as soon as one action is recorded', () => {
      setup({ historyCount: 1 });

      expect(undoButton()).toBeEnabled();
    });

    it('reports the UNDO action', async () => {
      const { handle, user } = setup({ historyCount: 1 });

      await user.click(undoButton());

      expect(handle).toHaveBeenCalledWith('UNDO');
    });
  });

  describe('actions', () => {
    it('reports the ROTATE action', async () => {
      const { handle, user } = setup();

      await user.click(rotateButton());

      expect(handle).toHaveBeenCalledWith('ROTATE');
    });

    it('reports the CROP action', async () => {
      const { handle, user } = setup();

      await user.click(cropButton());

      expect(handle).toHaveBeenCalledWith('CROP');
    });

    it('reports the BLUR action', async () => {
      const { handle, user } = setup();

      await user.click(blurButton());

      expect(handle).toHaveBeenCalledWith('BLUR');
    });
  });

  describe('selected state', () => {
    it('marks no button as selected initially', () => {
      setup();

      expect(cropButton()).not.toHaveClass('is-selected');
      expect(blurButton()).not.toHaveClass('is-selected');
    });

    it('highlights the crop while it is the current action', async () => {
      const { user } = setup();

      await user.click(cropButton());

      expect(cropButton()).toHaveClass('is-selected');
      expect(blurButton()).not.toHaveClass('is-selected');
    });

    it('moves the highlight from the crop to the blur', async () => {
      const { user } = setup();

      await user.click(cropButton());
      await user.click(blurButton());

      expect(blurButton()).toHaveClass('is-selected');
      expect(cropButton()).not.toHaveClass('is-selected');
    });

    it('drops the highlight on an action that has no selected state', async () => {
      const { user } = setup();

      await user.click(cropButton());
      await user.click(rotateButton());

      expect(cropButton()).not.toHaveClass('is-selected');
    });
  });
});
