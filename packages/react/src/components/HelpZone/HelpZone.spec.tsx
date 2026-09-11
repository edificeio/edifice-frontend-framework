import { fireEvent, render, screen } from '~/setup';
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

const fullLogo = () => document.querySelector('svg[width="81"]');
const compactLogo = () => document.querySelector('svg[width="18"]');

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
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
  });

  it('renders a button once ready', () => {
    renderHelpZone();

    expect(
      screen.getByRole('button', { name: 'homepage.help-zone.open' }),
    ).toBeInTheDocument();
  });

  it('calls onOpen when closed and clicked', async () => {
    const onOpen = vi.fn();
    const { user } = renderHelpZone({ onOpen });

    await user.click(
      screen.getByRole('button', { name: 'homepage.help-zone.open' }),
    );

    expect(onOpen).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when open and clicked', async () => {
    const onClose = vi.fn();
    const { user } = renderHelpZone({ isOpen: true, onClose });

    await user.click(
      screen.getByRole('button', { name: 'homepage.help-zone.close' }),
    );

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  describe('Edifice badge', () => {
    it('is a link to the platform release notes, opened in a new tab', () => {
      renderHelpZone();

      const badge = screen.getByRole('link');

      expect(badge).toHaveAttribute('href', 'https://edifice.io/releases/');
      expect(badge).toHaveAttribute('target', '_blank');
      expect(badge.getAttribute('rel')).toContain('noopener');
    });

    it('does not open or close the support widget when clicked', async () => {
      const onOpen = vi.fn();
      const onClose = vi.fn();
      const { user } = renderHelpZone({ onOpen, onClose });

      await user.click(screen.getByRole('link'));

      expect(onOpen).not.toHaveBeenCalled();
      expect(onClose).not.toHaveBeenCalled();
    });
  });

  it('marks the page as having an active help zone while mounted', () => {
    const { unmount } = renderHelpZone();

    expect(document.body.classList.contains('help-zone-active')).toBe(true);

    unmount();

    expect(document.body.classList.contains('help-zone-active')).toBe(false);
  });

  describe('full logo / compact logo switch', () => {
    it('shows the full logo by default', () => {
      renderHelpZone();

      expect(fullLogo()).toBeInTheDocument();
      expect(compactLogo()).not.toBeInTheDocument();
    });

    it('switches to the compact logo on any page scroll', () => {
      renderHelpZone();

      fireEvent.scroll(document);

      expect(compactLogo()).toBeInTheDocument();
      expect(fullLogo()).not.toBeInTheDocument();
    });

    it('switches to the compact logo on a scroll inside a nested scrollable container', () => {
      // Regression check: `scroll` doesn't bubble, so a container scrolling
      // (e.g. PageLayout's main area) rather than the page itself must still
      // be caught — this only works via a capture-phase listener.
      renderHelpZone();
      const nestedScrollArea = document.body.appendChild(
        document.createElement('div'),
      );

      fireEvent.scroll(nestedScrollArea);

      expect(compactLogo()).toBeInTheDocument();
      expect(fullLogo()).not.toBeInTheDocument();
    });

    it('switches to the compact logo on a click anywhere on the page', async () => {
      const { user } = renderHelpZone();

      await user.click(document.body);

      expect(compactLogo()).toBeInTheDocument();
      expect(fullLogo()).not.toBeInTheDocument();
    });

    it('stays compact after the initial trigger, regardless of further scrolls or clicks', () => {
      renderHelpZone();

      fireEvent.scroll(document);
      fireEvent.scroll(document);
      fireEvent.click(document.body);

      expect(compactLogo()).toBeInTheDocument();
      expect(fullLogo()).not.toBeInTheDocument();
    });
  });
});
