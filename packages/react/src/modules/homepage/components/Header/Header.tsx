import clsx from 'clsx';
import { useTranslation } from 'react-i18next';

import {
  Avatar,
  Badge,
  ButtonBeta,
  LogoBeta,
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
import { ActionListPopover } from './ActionListPopover';
import { MyAppsPopoverBody, MyAppsPopoverFooter } from './MyAppsPopover';
import { useSafeHoverPopover } from './useSafeHoverPopover';
import { Navbar } from '../../../../components/Layout/components/Navbar';
import { NavItem } from '../../../../components/Layout/components/NavItem';
import { NavLink } from '../../../../components/Layout/components/NavLink';
import useHeader from '../../../../components/Layout/hooks/useHeader';
import { useEdificeTheme } from '../../../../providers/';
import {
  IconCommunitiesBeta,
  IconHomeBeta,
  IconMessagesBeta,
  IconMyAppsBeta,
  IconNotificationBeta,
} from '../../../icons/components/nav';
import { useHasNotificationToday } from '../Notifications/hooks/useNotificationList';

export interface HeaderProps {
  src: string | undefined;
  onNotificationsClick?: () => void;
  /** Scope this header's CSS theme (`data-product`) to its own subtree, independently of the page's ambient theme. */
  dataProduct?: string;
}

const Header = ({
  src = '',
  onNotificationsClick,
  dataProduct,
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
  const { lg: isDesktop } = useBreakpoint();
  const myApps = useSafeHoverPopover({
    hoverEnabled: isDesktop,
    clickEnabled: !isDesktop,
  });
  const userMenu = useSafeHoverPopover();

  // On mobile/tablet, the trigger only opens the popover — it must not also
  // navigate to /welcome (desktop keeps navigating on click, as before).
  const handleMyAppsClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (!isDesktop) {
      event.preventDefault();
    }
  };

  const handleNotificationsClick = () => {
    onNotificationsClick?.();
  };

  return (
    <header className={classes} data-product={dataProduct}>
      <Navbar className="px-24">
        <LogoBeta src={`${src}/img/illustrations/logo.png`} />
        <ul className="navbar-nav">
          <NavItem>
            <NavLink
              link="/timeline/timeline"
              translate={t('navbar.home')}
              data-testid="header-home-button"
            >
              <IconHomeBeta />
            </NavLink>
          </NavItem>
          {communitiesWorkflow && (
            <NavItem>
              <NavLink
                link="/communities"
                translate={t('navbar.community')}
                data-testid="header-community-button"
              >
                <IconCommunitiesBeta className="icon community" />
              </NavLink>
            </NavItem>
          )}
          {conversationWorflow && (
            <NavItem>
              <NavLink
                className="position-relative"
                link="/conversation/conversation"
                translate={t('conversation')}
                data-testid="header-messagerie-button"
              >
                <IconMessagesBeta />
                {hasMessages && (
                  <Badge
                    variant={{ type: 'notification', level: 'danger' }}
                    className="position-absolute"
                  >
                    {messages}
                  </Badge>
                )}
              </NavLink>
            </NavItem>
          )}
          {hasCarbonioWorkflow && (
            <NavItem>
              <a
                className="nav-link position-relative"
                href="/auth/carbonio/preauth"
                target="_blank"
                data-testid="header-messagerie-button"
              >
                <IconMessagesBeta />
                {carbonioUnreadCount > 0 && (
                  <Badge
                    variant={{ type: 'notification', level: 'danger' }}
                    className="position-absolute"
                  >
                    {carbonioUnreadCount}
                  </Badge>
                )}
                <VisuallyHidden>{t('conversation')}</VisuallyHidden>
              </a>
            </NavItem>
          )}
          <NavItem className="position-relative">
            <NavLink
              ref={myApps.setReference}
              link="/welcome"
              translate={t('navbar.applications')}
              id={popoverAppsId}
              aria-haspopup="true"
              aria-expanded={myApps.open}
              data-testid="header-my-apps-button"
              {...myApps.getReferenceProps({ onClick: handleMyAppsClick })}
            >
              <IconMyAppsBeta />
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
          <NavItem className="position-relative">
            <ButtonBeta
              leftIcon={<IconNotificationBeta />}
              variant="ghost"
              onClick={handleNotificationsClick}
            />
            {hasNotificationToday && (
              <span
                style={{
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  width: 15,
                  height: 15,
                  background: 'red',
                  borderRadius: '50%',
                  border: '2px solid white',
                  pointerEvents: 'none',
                  zIndex: 1,
                  display: 'block',
                }}
                aria-label={t('homepage.notifications.new-badge')}
              />
            )}
          </NavItem>
          <NavItem className="position-relative">
            <NavLink
              ref={userMenu.setReference}
              link="/userbook/mon-compte"
              translate={t('navbar.myaccount')}
              id={popoverUserId}
              aria-haspopup="true"
              aria-expanded={userMenu.open}
              data-testid="header-user-profile-button"
              {...userMenu.getReferenceProps()}
            >
              <Avatar
                alt={userName}
                size="sm"
                src={userAvatar}
                variant="circle"
                className="bg-white"
                width="32"
                height="32"
              />
            </NavLink>
            <ActionListPopover
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
