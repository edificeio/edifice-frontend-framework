import { render, screen } from '~/setup';
import Header from './Header';

const {
  useConversation,
  useHasWorkflow,
  useUser,
  useEdificeClient,
  useEdificeTheme,
  useHeader,
  useHelp,
} = vi.hoisted(() => ({
  useConversation: vi.fn(),
  useHasWorkflow: vi.fn(),
  useUser: vi.fn(),
  useEdificeClient: vi.fn(),
  useEdificeTheme: vi.fn(),
  useHeader: vi.fn(),
  useHelp: vi.fn(),
}));

vi.mock('../../../hooks', () => ({
  useConversation,
  useHasWorkflow,
  useUser,
}));

vi.mock(
  '../../../providers/EdificeClientProvider/EdificeClientProvider.hook',
  () => ({ useEdificeClient }),
);

vi.mock(
  '../../../providers/EdificeThemeProvider/EdificeThemeProvider.hook',
  () => ({ useEdificeTheme }),
);

vi.mock('../hooks', () => ({ useHelp }));
vi.mock('../hooks/useHeader', () => ({ default: useHeader }));

// The search engine writes into window.location, which jsdom refuses.
vi.mock('./SearchEngine', () => ({
  default: () => <li data-testid="search-engine" />,
}));

vi.mock('./Help', () => ({
  default: ({ isHelpOpen }: { isHelpOpen: boolean }) =>
    isHelpOpen ? <div data-testid="help-modal" /> : null,
}));

type HeaderState = Partial<{
  title: string;
  bookmarkedApps: unknown[];
  isAppsHovered: boolean;
  userAvatar: string;
  userName: string;
  welcomeUser: string;
  communityWorkflow: boolean;
  communitiesWorkflow: boolean;
  conversationWorflow: boolean;
  searchWorkflow: boolean;
  isCollapsed: boolean;
}>;

function setup({
  is1d = false,
  messages = 0,
  zimbraWorkflow = false,
  workflows = {},
  language = 'fr',
  currentApp,
  helpOpen = false,
  state = {},
  ...rest
}: {
  is1d?: boolean;
  messages?: number;
  zimbraWorkflow?: boolean;
  workflows?: Record<string, boolean>;
  language?: string;
  currentApp?: { address: string };
  helpOpen?: boolean;
  logoutCallback?: string | undefined;
  state?: HeaderState;
} = {}) {
  const toggleCollapsedNav = vi.fn();
  const setIsModalOpen = vi.fn();

  useConversation.mockReturnValue({
    messages,
    msgLink: '/zimbra/zimbra',
    zimbraWorkflow,
  });
  useUser.mockReturnValue({
    user: { userId: 'user-1' },
    avatar: '/avatar.png',
  });
  useEdificeClient.mockReturnValue({
    currentLanguage: language,
    currentApp,
  });
  // An explicit `logoutCallback: undefined` must survive, hence the key check
  // rather than a default parameter.
  useEdificeTheme.mockReturnValue({
    theme: {
      logoutCallback:
        'logoutCallback' in rest ? rest.logoutCallback : '/portal',
    },
  });
  useHasWorkflow.mockImplementation((workflow: string) => workflows[workflow]);
  useHelp.mockReturnValue({
    isModalOpen: helpOpen,
    setIsModalOpen,
    parsedContent: undefined,
    parsedHeadline: undefined,
    error: false,
  });
  useHeader.mockReturnValue({
    title: 'Mon application',
    bookmarkedApps: [],
    appsRef: { current: null },
    isAppsHovered: false,
    popoverAppsId: 'apps-popover',
    userAvatar: '/avatar.png',
    userName: 'Pascal',
    welcomeUser: 'Bonjour Pascal',
    communityWorkflow: false,
    communitiesWorkflow: false,
    conversationWorflow: false,
    searchWorkflow: false,
    isCollapsed: true,
    toggleCollapsedNav,
    ...state,
  });

  return {
    ...render(<Header is1d={is1d} src="/assets" />),
    toggleCollapsedNav,
    setIsModalOpen,
  };
}

const OLD_HELP =
  'org.entcore.portal.controllers.PortalController|oldHelpEnable';
const CARBONIO =
  'org.entcore.auth.controllers.CarbonioPreauthController|preauth';

const header = () => document.querySelector('header');

describe('Layout Header', () => {
  describe('degree variants', () => {
    it('marks a second-degree header', () => {
      setup();

      expect(header()).toHaveClass('header', 'no-1d');
      expect(header()).not.toHaveClass('no-2d');
    });

    it('marks a first-degree header', () => {
      setup({ is1d: true });

      expect(header()).toHaveClass('no-2d');
    });
  });

  describe('conversation', () => {
    it('links to the conversation when the workflow is granted', () => {
      setup({ state: { conversationWorflow: true } });

      expect(
        screen.getByRole('link', { name: 'conversation' }),
      ).toHaveAttribute('href', '/conversation/conversation');
    });

    it('hides the conversation without the workflow', () => {
      setup();

      expect(
        screen.queryByRole('link', { name: 'conversation' }),
      ).not.toBeInTheDocument();
    });

    it('badges the number of unread messages', () => {
      setup({ messages: 3, state: { conversationWorflow: true } });

      expect(screen.getByText('3')).toBeInTheDocument();
    });

    it('shows no badge without any message', () => {
      setup({ messages: 0, state: { conversationWorflow: true } });

      expect(screen.queryByText('0')).not.toBeInTheDocument();
    });

    it('links to zimbra when that workflow is granted instead', () => {
      setup({ zimbraWorkflow: true });

      expect(
        screen.getByRole('link', { name: 'conversation' }),
      ).toHaveAttribute('href', '/zimbra/zimbra');
    });

    it('opens the carbonio preauth link in a new tab', () => {
      setup({ workflows: { [CARBONIO]: true } });

      const link = screen.getByRole('link', { name: 'conversation' });
      expect(link).toHaveAttribute('href', '/auth/carbonio/preauth');
      expect(link).toHaveAttribute('target', '_blank');
    });
  });

  describe('help', () => {
    it('offers the help button for a French session with the legacy workflow', async () => {
      const { user, setIsModalOpen } = setup({
        language: 'fr',
        workflows: { [OLD_HELP]: true },
      });

      await user.click(screen.getByRole('button', { name: 'Support' }));

      expect(setIsModalOpen).toHaveBeenCalledWith(true);
    });

    it('hides the help button in another language', () => {
      setup({ language: 'en', workflows: { [OLD_HELP]: true } });

      expect(
        screen.queryByRole('button', { name: 'Support' }),
      ).not.toBeInTheDocument();
    });

    it('hides the help button without the legacy workflow', () => {
      setup({ language: 'fr' });

      expect(
        screen.queryByRole('button', { name: 'Support' }),
      ).not.toBeInTheDocument();
    });

    it('renders the help modal once opened', () => {
      setup({
        language: 'fr',
        workflows: { [OLD_HELP]: true },
        helpOpen: true,
      });

      expect(screen.getByTestId('help-modal')).toBeInTheDocument();
    });
  });

  describe('secondary navigation', () => {
    it('links to the applications and the user account', () => {
      setup();

      expect(
        screen.getByRole('link', { name: 'navbar.applications' }),
      ).toHaveAttribute('href', '/welcome');
      expect(
        screen.getByRole('link', { name: /navbar.myaccount/ }),
      ).toHaveAttribute('href', '/userbook/mon-compte');
    });

    it('appends the theme callback to the logout link', () => {
      setup();

      expect(
        screen.getByRole('link', { name: /navbar.disconnect/ }),
      ).toHaveAttribute('href', '/auth/logout?callback=/portal');
    });

    it('logs out without a callback when the theme has none', () => {
      setup({ logoutCallback: undefined });

      expect(
        screen.getByRole('link', { name: /navbar.disconnect/ }),
      ).toHaveAttribute('href', '/auth/logout?callback=');
    });

    it('shows the communities entry when its workflow is granted', () => {
      setup({ state: { communitiesWorkflow: true } });

      expect(
        screen.getByRole('link', { name: 'navbar.community' }),
      ).toHaveAttribute('href', '/communities');
    });

    it('shows the search engine when its workflow is granted', () => {
      setup({ state: { searchWorkflow: true } });

      expect(screen.getByTestId('search-engine')).toBeInTheDocument();
    });

    it('hides the search engine otherwise', () => {
      setup();

      expect(screen.queryByTestId('search-engine')).not.toBeInTheDocument();
    });
  });

  describe('collapsed menu', () => {
    it('is closed by default and toggles on click', async () => {
      const { user, toggleCollapsedNav } = setup();

      const toggle = screen.getByRole('button', { name: 'navbar.open.menu' });
      expect(toggle).toHaveAttribute('aria-expanded', 'false');
      expect(document.querySelector('.dropdown-menu')).not.toHaveClass('show');

      await user.click(toggle);

      expect(toggleCollapsedNav).toHaveBeenCalledTimes(1);
    });

    it('is shown when the navigation is expanded', () => {
      setup({ state: { isCollapsed: false } });

      expect(
        screen.getByRole('button', { name: 'navbar.open.menu' }),
      ).toHaveAttribute('aria-expanded', 'true');
      expect(document.querySelector('.dropdown-menu')).toHaveClass('show');
    });
  });

  describe('first-degree navigation', () => {
    it('falls back to the timeline when no application is current', () => {
      setup({ is1d: true });

      expect(
        screen.getByRole('link', { name: 'Mon application' }),
      ).toHaveAttribute('href', '/timeline/timeline');
    });

    it('links the title to the current application', () => {
      setup({ is1d: true, currentApp: { address: '/blog' } });

      expect(
        screen.getByRole('link', { name: 'Mon application' }),
      ).toHaveAttribute('href', '/blog');
    });

    it('welcomes the user next to their avatar', () => {
      setup({ is1d: true });

      expect(screen.getByText('Bonjour Pascal')).toBeInTheDocument();
    });

    it('badges the messages with the first-degree styling', () => {
      setup({ is1d: true, messages: 5, state: { conversationWorflow: true } });

      expect(screen.getByText('5')).toBeInTheDocument();
    });
  });
});
