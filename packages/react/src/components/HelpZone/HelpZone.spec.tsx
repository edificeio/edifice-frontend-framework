import { render, screen } from '~/setup';
import HelpZone, { HelpZoneProps } from './HelpZone';

function renderHelpZone(props: Partial<HelpZoneProps> = {}) {
  return render(
    <HelpZone
      isReady={true}
      isOpen={false}
      onOpen={vi.fn()}
      onClose={vi.fn()}
      {...props}
    />,
  );
}

describe('HelpZone', () => {
  beforeEach(() => {
    document.body.innerHTML = '<div id="portal"></div>';
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('renders nothing while the widget is not ready', () => {
    renderHelpZone({ isReady: false });

    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('renders a button once ready', () => {
    renderHelpZone();

    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('calls onOpen when closed and clicked', async () => {
    const onOpen = vi.fn();
    const { user } = renderHelpZone({ onOpen });

    await user.click(screen.getByRole('button'));

    expect(onOpen).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when open and clicked', async () => {
    const onClose = vi.fn();
    const { user } = renderHelpZone({ isOpen: true, onClose });

    await user.click(screen.getByRole('button'));

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('marks the page as having an active help zone while mounted', () => {
    const { unmount } = renderHelpZone();

    expect(document.body.classList.contains('help-zone-active')).toBe(true);

    unmount();

    expect(document.body.classList.contains('help-zone-active')).toBe(false);
  });
});
