import { render, screen } from '~/setup';
import ToolbarZoom from './ToolbarZoom';

describe('ToolbarZoom', () => {
  it('offers a zoom-out and a zoom-in button', () => {
    render(<ToolbarZoom zoomIn={vi.fn()} zoomOut={vi.fn()} />);

    expect(screen.getAllByRole('button')).toHaveLength(2);
  });

  it('zooms out on the first button', async () => {
    const zoomOut = vi.fn();
    const { user } = render(<ToolbarZoom zoomIn={vi.fn()} zoomOut={zoomOut} />);

    await user.click(screen.getAllByRole('button')[0]);

    expect(zoomOut).toHaveBeenCalledTimes(1);
  });

  it('zooms in on the second button', async () => {
    const zoomIn = vi.fn();
    const { user } = render(<ToolbarZoom zoomIn={zoomIn} zoomOut={vi.fn()} />);

    await user.click(screen.getAllByRole('button')[1]);

    expect(zoomIn).toHaveBeenCalledTimes(1);
  });

  it('does not mix the two callbacks up', async () => {
    const zoomIn = vi.fn();
    const zoomOut = vi.fn();
    const { user } = render(<ToolbarZoom zoomIn={zoomIn} zoomOut={zoomOut} />);

    await user.click(screen.getAllByRole('button')[0]);

    expect(zoomIn).not.toHaveBeenCalled();
    expect(zoomOut).toHaveBeenCalledTimes(1);
  });

  it('renders inside the zoom toolbar container', () => {
    render(<ToolbarZoom zoomIn={vi.fn()} zoomOut={vi.fn()} />);

    expect(
      document.querySelector('.media-viewer-toolbar-zoom-container'),
    ).toBeInTheDocument();
    expect(
      document.querySelector('.media-viewer-toolbar-zoom'),
    ).toBeInTheDocument();
  });
});
