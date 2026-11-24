import clsx from 'clsx';
import { useTranslation } from 'react-i18next';

import {
  Avatar,
  LogoBeta as Logo,
  Popover,
  PopoverBody,
  PopoverFooter,
  VisuallyHidden,
} from '../../../../components';
import {
  useBreakpoint,
  useCarbonioUnread,
  useConversation,
  useUser,
} from '../../../../hooks';

import { useId, type MouseEvent } from 'react';
import { AccountActionListPopover } from './AccountActionListPopover';
import { HeaderBadge } from './HeaderBadge';
import { MyAppsPopoverBody, MyAppsPopoverFooter } from './MyAppsPopover';
import { useSafeHoverPopover } from './useSafeHoverPopover';
import { Navbar } from '../../../../components/Layout/components/Navbar';
import { NavItem } from '../../../../components/Layout/components/NavItem';
import { NavLink } from '../../../../components/Layout/components/NavLink';
import useHeader from '../../../../components/Layout/hooks/useHeader';
import { useEdificeTheme } from '../../../../providers/';
import {
  IconCommunitiesBeta as IconCommunities,
  IconHomeBeta as IconHome,
  IconMessagesBeta as IconMessages,
  IconMyAppsBeta as IconMyApps,
  IconNotificationBeta as IconNotification,
} from '../../../icons/components/nav';
import { useHasNotificationToday } from '../Notifications/hooks/useNotificationList';

export interface HeaderProps {
  src: string | undefined;
  onNotificationsClick?: () => void;
  /**
   * CSS theme (`data-product`) scoped to the header's own subtree,
   * independently of the page's ambient theme. Defaults to `edifice2d`, the
   * only theme the Header v2 is designed for, so it keeps its look inside
   * legacy-themed apps (e.g. neo). A platform can still impose its own theme
   * (e.g. `crna`) through the theme-conf `layout.header` override.
   */
  dataProduct?: string;
}

const Header = ({
  src = '',
  onNotificationsClick,
  dataProduct = 'edifice2d',
}: HeaderProps): JSX.Element => {
  const { t } = useTranslation();
  const { messages } = useConversation();
  const { user, avatar } = useUser();

  const { hasCarbonioWorkflow, unreadCount: carbonioUnreadCount } =
    useCarbonioUnread();

  const classes = clsx('header-beta d-print-none no-2d no-1d');

  const {
    userAvatar,
    userName,
    communitiesWorkflow,
    conversationWorflow,
    bookmarkedApps,
  } = useHeader({ user, avatar });
  const { theme } = useEdificeTheme();

  const hasMessages = messages > 0;
  const hasNotificationToday = useHasNotificationToday();

  /**
   * IDs for Popover Component
   */
  const popoverUserId = useId();
  const popoverAppsId = useId();

  /**
   * "Mes applis" popover: opens on hover on desktop, on click on mobile/tablet
   * (below the 'desktop-small' breakpoint, so real tablets — up to 1024px —
   * get click like phones instead of being mistaken for desktop), and closes
   * on an outside click/tap in both cases. `safePolygon()` keeps it open
   * while the pointer moves diagonally from the trigger towards the (wider)
   * popover instead of closing as soon as it leaves the trigger.
   */
  const { md: isTablet, lg: isDesktop } = useBreakpoint();
  const myApps = useSafeHoverPopover({
    hoverEnabled: isDesktop,
    clickEnabled: !isDesktop,
  });
  /**
   * "Mon compte" popover: opens on click at every breakpoint (so it works the
   * same on touch devices), plus on hover on desktop. The trigger never
   * navigates — "Mon compte" is the first entry of the popover itself.
   */
  const userMenu = useSafeHoverPopover({
    hoverEnabled: isDesktop,
    clickEnabled: true,
  });

  // On mobile/tablet, the trigger only opens the popover — it must not also
  // navigate to /welcome (desktop keeps navigating on click, as before).
  const handleMyAppsClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (!isDesktop) {
      event.preventDefault();
    }
  };

  const handleUserMenuClick = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
  };

  const handleNotificationsClick = () => {
    onNotificationsClick?.();
  };

  return (
    <header className={classes} data-product={dataProduct}>
      <Navbar>
        <Logo
          src={`${src}/img/illustrations/logo-v2.png`}
          translate={t('navbar.home')}
        />
        <ul className="navbar-nav">
          <NavItem>
            <NavLink
              link="/timeline/timeline"
              translate={t('navbar.home')}
              data-testid="header-home-button"
              title={t('navbar.home')}
            >
              <IconHome />
            </NavLink>
          </NavItem>
          {communitiesWorkflow && (
            <NavItem>
              <NavLink
                link="/communities"
                translate={t('navbar.community')}
                data-testid="header-community-button"
                title={t('navbar.community')}
              >
                <IconCommunities className="icon community" />
              </NavLink>
            </NavItem>
          )}
          {conversationWorflow && (
            <NavItem>
              <NavLink
                className="position-relative"
                link="/conversation/conversation"
                translate={t('conversation')}
                title={t('conversation')}
                data-testid="header-messagerie-button"
              >
                <IconMessages />
                {hasMessages && <HeaderBadge>{messages}</HeaderBadge>}
              </NavLink>
            </NavItem>
          )}
          {hasCarbonioWorkflow && (
            <NavItem>
              <NavLink
                className="position-relative"
                link="/auth/carbonio/preauth"
                target="_blank"
                translate={t('conversation')}
                title={t('conversation')}
                data-testid="header-messagerie-button"
              >
                <IconMessages />
                {carbonioUnreadCount > 0 && (
                  <HeaderBadge>{carbonioUnreadCount}</HeaderBadge>
                )}
              </NavLink>
            </NavItem>
          )}
          <NavItem className="position-relative">
            <NavLink
              ref={myApps.setReference}
              link="/welcome"
              title={t('navbar.applications')}
              translate={t('navbar.applications')}
              id={popoverAppsId}
              aria-haspopup="true"
              aria-expanded={myApps.open}
              data-testid="header-my-apps-button"
              {...myApps.getReferenceProps({ onClick: handleMyAppsClick })}
            >
              <IconMyApps />
            </NavLink>
            <Popover
              ref={myApps.setFloating}
              className="my-apps-popover"
              id={popoverAppsId}
              isVisible={myApps.open}
              {...myApps.getFloatingProps()}
            >
              <PopoverBody>
                <MyAppsPopoverBody bookmarkedApps={bookmarkedApps} />
              </PopoverBody>
              <PopoverFooter className="d-flex justify-content-center">
                <MyAppsPopoverFooter />
              </PopoverFooter>
            </Popover>
          </NavItem>
          <NavItem>
            {/* No `link`: NavLink renders a button that opens the panel. The
                label is a child (not `translate`) so that it comes before the
                "new" marker in the accessible name. */}
            <NavLink
              className="position-relative"
              title={t('navbar.notifications')}
              data-testid="header-notifications-button"
              onClick={handleNotificationsClick}
            >
              <IconNotification />
              <VisuallyHidden>{t('navbar.notifications')}</VisuallyHidden>
              {hasNotificationToday && (
                <HeaderBadge dot>{t('navbar.notifications.new')}</HeaderBadge>
              )}
            </NavLink>
          </NavItem>
          <NavItem className="position-relative">
            <NavLink
              ref={userMenu.setReference}
              className="navbar-nav-avatar"
              link="/userbook/mon-compte"
              translate={t('navbar.myaccount')}
              id={popoverUserId}
              aria-haspopup="true"
              aria-expanded={userMenu.open}
              data-testid="header-user-profile-button"
              {...userMenu.getReferenceProps({ onClick: handleUserMenuClick })}
            >
              {/* 24px below the tablet breakpoint, 36px from it (mock-up) */}
              <Avatar
                alt={userName}
                size={isTablet ? 'sm' : 'xs'}
                src={userAvatar}
                variant="circle"
                className="bg-white"
              />
            </NavLink>
            <AccountActionListPopover
              ref={userMenu.setFloating}
              align="end"
              id={popoverUserId}
              isVisible={userMenu.open}
              logoutCallback={theme?.logoutCallback}
              {...userMenu.getFloatingProps()}
            />
          </NavItem>
        </ul>
      </Navbar>
    </header>
  );
};

Header.displayName = 'Header';

export default Header;
