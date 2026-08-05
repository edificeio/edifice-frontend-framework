import { render, screen } from '~/setup';

import Header from './Header';

const { useHasNotificationTodayMock } = vi.hoisted(() => ({
  useHasNotificationTodayMock: vi.fn(),
}));

vi.mock('../Notifications/hooks/useNotificationList', () => ({
  useHasNotificationToday: useHasNotificationTodayMock,
}));

const { useConversation, useHasWorkflow, useUser, useHeader, useEdificeTheme } =
  vi.hoisted(() => ({
    useConversation: vi.fn(),
    useHasWorkflow: vi.fn(),
    useUser: vi.fn(),
    useHeader: vi.fn(),
    useEdificeTheme: vi.fn(),
  }));

vi.mock('../../../../hooks', async (importOriginal) => ({
  ...(await importOriginal<typeof import('../../../../hooks')>()),
  useConversation,
  useHasWorkflow,
  useUser,
}));

vi.mock('../../../../components/Layout/hooks/useHeader', () => ({
  default: useHeader,
}));

vi.mock('../../../../providers/', () => ({ useEdificeTheme }));

const CARBONIO =
  'org.entcore.auth.controllers.CarbonioPreauthController|preauth';

function setup({
  messages = 0,
  workflows = {},
  communitiesWorkflow = false,
  conversationWorflow = false,
  theme = { logoutCallback: '/portal' },
  dataProduct,
  onNotificationsClick,
}: {
  messages?: number;
  workflows?: Record<string, boolean>;
  communitiesWorkflow?: boolean;
  conversationWorflow?: boolean;
  theme?: { logoutCallback?: string };
  dataProduct?: string;
  onNotificationsClick?: () => void;
} = {}) {
  useConversation.mockReturnValue({ messages });
  useUser.mockReturnValue({
    user: { userId: 'user-1' },
    avatar: '/avatar.png',
  });
  useHasWorkflow.mockImplementation((workflow: string) => workflows[workflow]);
  useEdificeTheme.mockReturnValue({ theme });
  useHeader.mockReturnValue({
    userAvatar: '/avatar.png',
    userName: 'Pascal',
    communitiesWorkflow,
    conversationWorflow,
  });

  return render(
    <Header
      src="/assets"
      dataProduct={dataProduct}
      onNotificationsClick={onNotificationsClick}
    />,
  );
}

describe('homepage Header', () => {
  it('always offers home, applications, notifications and the user menu', () => {
    setup();

    expect(screen.getByTestId('header-home-button')).toHaveAttribute(
      'href',
      '/timeline/timeline',
    );
    expect(screen.getByTestId('header-my-apps-button')).toHaveAttribute(
      'href',
      '/welcome',
    );
    expect(screen.getByTestId('header-user-profile-button')).toHaveAttribute(
      'href',
      '/userbook/mon-compte',
    );
    expect(screen.getByTestId('header-user-menu-button')).toBeInTheDocument();
  });

  it('points the logo at the theme assets', () => {
    setup();

    expect(document.querySelector('img')).toHaveAttribute(
      'src',
      '/assets/img/illustrations/logo.png',
    );
  });

  it('carries the beta header classes', () => {
    setup();

    expect(document.querySelector('header')).toHaveClass(
      'header-beta',
      'd-print-none',
      'no-2d',
      'no-1d',
    );
  });

  it('scopes its own theme when a product is given', () => {
    setup({ dataProduct: 'one' });

    expect(document.querySelector('header')).toHaveAttribute(
      'data-product',
      'one',
    );
  });

  it('inherits the ambient theme by default', () => {
    setup();

    expect(document.querySelector('header')).not.toHaveAttribute(
      'data-product',
    );
  });

  describe('communities', () => {
    it('is offered when the workflow is granted', () => {
      setup({ communitiesWorkflow: true });

      expect(screen.getByTestId('header-community-button')).toHaveAttribute(
        'href',
        '/communities',
      );
    });

    it('is hidden otherwise', () => {
      setup();

      expect(
        screen.queryByTestId('header-community-button'),
      ).not.toBeInTheDocument();
    });
  });

  describe('conversation', () => {
    it('links to the conversation when the workflow is granted', () => {
      setup({ conversationWorflow: true });

      expect(screen.getByTestId('header-messagerie-button')).toHaveAttribute(
        'href',
        '/conversation/conversation',
      );
    });

    it('badges the unread messages', () => {
      setup({ conversationWorflow: true, messages: 4 });

      expect(screen.getByText('4')).toBeInTheDocument();
    });

    it('shows no badge without any message', () => {
      setup({ conversationWorflow: true });

      expect(screen.queryByText('0')).not.toBeInTheDocument();
    });

    it('falls back to the carbonio preauth link in a new tab', () => {
      setup({ workflows: { [CARBONIO]: true } });

      const link = screen.getByTestId('header-messagerie-button');
      expect(link).toHaveAttribute('href', '/auth/carbonio/preauth');
      expect(link).toHaveAttribute('target', '_blank');
    });

    it('shows no messaging entry without any workflow', () => {
      setup();

      expect(
        screen.queryByTestId('header-messagerie-button'),
      ).not.toBeInTheDocument();
    });
  });

  describe('notifications', () => {
    it('calls back on click', async () => {
      const onNotificationsClick = vi.fn();
      const { user } = setup({ onNotificationsClick });

      await user.click(screen.getAllByRole('button')[0]);

      expect(onNotificationsClick).toHaveBeenCalledTimes(1);
    });

    it('does not fail without a callback', async () => {
      const { user } = setup();

      await user.click(screen.getAllByRole('button')[0]);

      expect(screen.getByTestId('header-home-button')).toBeInTheDocument();
    });
  });

  describe('user popover', () => {
    // The logout link lives inside the popover, which only renders on hover.
    it('appends the theme callback to the logout link', async () => {
      const { user } = setup();

      await user.hover(screen.getByTestId('header-user-menu-button'));

      expect(screen.getByTestId('header-logout-button')).toHaveAttribute(
        'href',
        '/auth/logout?callback=/portal',
      );
    });

    it('logs out without a callback when the theme has none', async () => {
      const { user } = setup({ theme: {} });

      await user.hover(screen.getByTestId('header-user-menu-button'));

      expect(screen.getByTestId('header-logout-button')).toHaveAttribute(
        'href',
        '/auth/logout?callback=',
      );
    });

    it('opens on hover', async () => {
      const { user } = setup();
      const item = screen.getByTestId('header-user-menu-button');

      expect(item).toHaveAttribute('aria-expanded', 'false');

      await user.hover(item);

      expect(item).toHaveAttribute('aria-expanded', 'true');
    });
  });
});

describe('Header notification badge', () => {
  it('shows a badge on the notification bell when a notification is dated today', async () => {
    useHasNotificationTodayMock.mockReturnValue(true);

    setup();

    expect(
      await screen.findByLabelText('Nouvelle notification'),
    ).toBeInTheDocument();
  });

  it('hides the badge when no notification is dated today', async () => {
    useHasNotificationTodayMock.mockReturnValue(false);

    setup();

    expect(
      screen.queryByLabelText('Nouvelle notification'),
    ).not.toBeInTheDocument();
  });
});
