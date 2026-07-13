import { render, screen } from '~/setup';
import { BetaSwitch } from './BetaSwitch';

describe('BetaSwitch', () => {
  beforeAll(() => {
    // useBreakpoint relies on window.matchMedia, absent from jsdom.
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

  it('renders the opt-out call-to-action button', () => {
    render(<BetaSwitch />);

    expect(screen.getByTestId('beta-switch-button')).toBeInTheDocument();
  });

  it('calls onSwitchClick when the button is clicked', async () => {
    const onSwitchClick = vi.fn();
    const { user } = render(<BetaSwitch onSwitchClick={onSwitchClick} />);

    await user.click(screen.getByTestId('beta-switch-button'));

    expect(onSwitchClick).toHaveBeenCalledTimes(1);
  });

  it('disables the button while switching', async () => {
    const onSwitchClick = vi.fn();
    const { user } = render(
      <BetaSwitch isSwitching onSwitchClick={onSwitchClick} />,
    );

    const button = screen.getByTestId('beta-switch-button');
    expect(button).toBeDisabled();

    await user.click(button);
    expect(onSwitchClick).not.toHaveBeenCalled();
  });
});
