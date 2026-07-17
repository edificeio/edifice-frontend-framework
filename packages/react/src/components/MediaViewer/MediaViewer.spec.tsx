import { fireEvent, render, screen } from '~/setup';
import MediaViewer, { MediaProps } from './MediaViewer';

const media: MediaProps[] = [
  { name: 'photo.png', url: '/photo.png', type: 'image' },
  { name: 'clip.mp4', url: '/clip.mp4', type: 'video' },
];

describe('MediaViewer', () => {
  beforeAll(() => {
    // antd's Carousel relies on ResizeObserver, absent from jsdom.
    vi.stubGlobal(
      'ResizeObserver',
      class {
        observe() {}
        unobserve() {}
        disconnect() {}
      },
    );
  });

  it('renders the toolbar counter and the first media', () => {
    const { container } = render(
      <MediaViewer onClose={vi.fn()} media={media} />,
    );

    expect(screen.getByText('1/2')).toBeInTheDocument();
    expect(container.querySelector('img[alt="image"]')).toHaveAttribute(
      'src',
      '/photo.png',
    );
  });

  it('renders the media matching indexMedia and updates on prop change', () => {
    const { rerender } = render(
      <MediaViewer onClose={vi.fn()} media={media} indexMedia={1} />,
    );
    expect(screen.getByText('2/2')).toBeInTheDocument();

    rerender(<MediaViewer onClose={vi.fn()} media={media} indexMedia={0} />);
    expect(screen.getByText('1/2')).toBeInTheDocument();
  });

  it('renders the right root element per media type', () => {
    const { container } = render(
      <MediaViewer
        onClose={vi.fn()}
        media={[
          { name: 'song.mp3', url: '/song.mp3', type: 'audio' },
          { name: 'page', url: 'https://example.com', type: 'embedder' },
        ]}
      />,
    );

    expect(container.querySelector('audio')).toHaveAttribute(
      'src',
      '/song.mp3',
    );
    expect(container.querySelector('iframe')).toHaveAttribute(
      'src',
      'https://example.com',
    );
  });

  it('closes when clicking the backdrop overlay', () => {
    const onClose = vi.fn();
    const { container } = render(
      <MediaViewer onClose={onClose} media={media} />,
    );

    fireEvent.click(
      container.querySelector('.media-viewer-inner-overlay') as HTMLElement,
    );

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('does not close when clicking inside the media content', () => {
    const onClose = vi.fn();
    const { container } = render(
      <MediaViewer onClose={onClose} media={media} />,
    );

    fireEvent.click(
      container.querySelector('.media-viewer-inner') as HTMLElement,
    );

    expect(onClose).not.toHaveBeenCalled();
  });

  it('closes when clicking the toolbar close button', async () => {
    const onClose = vi.fn();
    const { user } = render(<MediaViewer onClose={onClose} media={media} />);

    const [closeButton] = screen.getAllByRole('button');
    await user.click(closeButton);

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('closes on Escape', () => {
    const onClose = vi.fn();
    render(<MediaViewer onClose={onClose} media={media} />);

    fireEvent.keyDown(window, { key: 'Escape' });

    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
