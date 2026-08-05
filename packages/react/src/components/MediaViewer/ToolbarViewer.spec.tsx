import { render, screen } from '~/setup';
import ToolbarViewer from './ToolbarViewer';

function setup({
  nbMedia,
  mediaUrl,
  currentIndex = 0,
}: { nbMedia?: number; mediaUrl?: string; currentIndex?: number } = {}) {
  const onClose = vi.fn();

  return {
    ...render(
      <ToolbarViewer
        onClose={onClose}
        mediaName="photo-de-classe.jpg"
        nbMedia={nbMedia}
        mediaUrl={mediaUrl}
        currentIndex={currentIndex}
      />,
    ),
    onClose,
  };
}

describe('ToolbarViewer', () => {
  it('shows the media name', () => {
    setup();

    expect(screen.getByText('photo-de-classe.jpg')).toBeInTheDocument();
  });

  it('counts the current media within the whole set', () => {
    setup({ nbMedia: 4, currentIndex: 1 });

    expect(screen.getByText('2/4')).toBeInTheDocument();
  });

  it('shows the position alone for a single media', () => {
    setup({ currentIndex: 0 });

    expect(screen.getByText('1')).toBeInTheDocument();
  });

  it('offers no media action without a URL', () => {
    setup();

    expect(screen.getAllByRole('button')).toHaveLength(1);
  });

  it('offers the media actions once a URL is known', () => {
    setup({ mediaUrl: '/media/file' });

    expect(screen.getAllByRole('button').length).toBeGreaterThan(1);
  });

  it('closes on the close button', async () => {
    const { user, onClose } = setup();

    await user.click(screen.getAllByRole('button')[0]);

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('closes on the Escape key', async () => {
    const { user, onClose } = setup();

    await user.keyboard('{Escape}');

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('stops listening to the keyboard once unmounted', async () => {
    const { user, onClose, unmount } = setup();

    unmount();
    await user.keyboard('{Escape}');

    expect(onClose).not.toHaveBeenCalled();
  });
});
