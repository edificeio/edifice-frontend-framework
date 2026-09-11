import { fireEvent, render, screen } from '~/setup';
import HelpButton, { HelpButtonProps } from './HelpButton';

function renderHelpButton(props: Partial<HelpButtonProps> = {}) {
  return render(
    <HelpButton
      isReady={true}
      isOpen={false}
      onOpen={vi.fn()}
      onClose={vi.fn()}
      {...props}
    />,
  );
}

const fullLogo = () => document.querySelector('svg[width="81"]');
const compactLogo = () => document.querySelector('svg[width="18"]');

describe('HelpButton', () => {
  beforeEach(() => {
    document.body.innerHTML = '<div id="portal"></div>';
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('renders nothing while the widget is not ready', () => {
    renderHelpButton({ isReady: false });

    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('renders a button once ready', () => {
    renderHelpButton();

    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('calls onOpen when closed and clicked', async () => {
    const onOpen = vi.fn();
    const { user } = renderHelpButton({ onOpen });

    await user.click(screen.getByRole('button'));

    expect(onOpen).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when open and clicked', async () => {
    const onClose = vi.fn();
    const { user } = renderHelpButton({ isOpen: true, onClose });

    await user.click(screen.getByRole('button'));

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('marks the page as having an active help zone while mounted', () => {
    const { unmount } = renderHelpButton();

    expect(document.body.classList.contains('help-button-active')).toBe(true);

    unmount();

    expect(document.body.classList.contains('help-button-active')).toBe(false);
  });

  describe('full logo / compact logo switch', () => {
    it('shows the full logo by default', () => {
      renderHelpButton();

      expect(fullLogo()).toBeInTheDocument();
      expect(compactLogo()).not.toBeInTheDocument();
    });

    it('switches to the compact logo on any page scroll', () => {
      renderHelpButton();

      fireEvent.scroll(document);

      expect(compactLogo()).toBeInTheDocument();
      expect(fullLogo()).not.toBeInTheDocument();
    });

    it('switches to the compact logo on a scroll inside a nested scrollable container', () => {
      // Regression check: `scroll` doesn't bubble, so a container scrolling
      // (e.g. PageLayout's main area) rather than the page itself must still
      // be caught — this only works via a capture-phase listener.
      renderHelpButton();
      const nestedScrollArea = document.body.appendChild(
        document.createElement('div'),
      );

      fireEvent.scroll(nestedScrollArea);

      expect(compactLogo()).toBeInTheDocument();
      expect(fullLogo()).not.toBeInTheDocument();
    });

    it('switches to the compact logo on a click anywhere on the page', async () => {
      const { user } = renderHelpButton();

      await user.click(document.body);

      expect(compactLogo()).toBeInTheDocument();
      expect(fullLogo()).not.toBeInTheDocument();
    });

    it('stays compact after the initial trigger, regardless of further scrolls or clicks', () => {
      renderHelpButton();

      fireEvent.scroll(document);
      fireEvent.scroll(document);
      fireEvent.click(document.body);

      expect(compactLogo()).toBeInTheDocument();
      expect(fullLogo()).not.toBeInTheDocument();
    });
  });
});
