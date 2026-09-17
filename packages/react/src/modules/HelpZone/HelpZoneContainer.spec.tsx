import { render, screen } from '~/setup';
import { HelpZoneContainer } from './HelpZoneContainer';

const { useZendeskGuide } = vi.hoisted(() => ({
  useZendeskGuide: vi.fn(),
}));

vi.mock('../../hooks', () => ({ useZendeskGuide }));

describe('HelpZoneContainer', () => {
  beforeEach(() => {
    document.body.innerHTML = '<div id="portal"></div>';
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('renders nothing while the widget is not ready', () => {
    useZendeskGuide.mockReturnValue({
      isReady: false,
      isOpen: false,
      open: vi.fn(),
      close: vi.fn(),
    });

    render(<HelpZoneContainer />);

    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('wires the hook open() into the button once ready', async () => {
    const open = vi.fn();
    useZendeskGuide.mockReturnValue({
      isReady: true,
      isOpen: false,
      open,
      close: vi.fn(),
    });

    const { user } = render(<HelpZoneContainer />);
    await user.click(screen.getByRole('button'));

    expect(open).toHaveBeenCalledTimes(1);
  });

  it('wires the hook close() into the button once open', async () => {
    const close = vi.fn();
    useZendeskGuide.mockReturnValue({
      isReady: true,
      isOpen: true,
      open: vi.fn(),
      close,
    });

    const { user } = render(<HelpZoneContainer />);
    await user.click(screen.getByRole('button'));

    expect(close).toHaveBeenCalledTimes(1);
  });
});
