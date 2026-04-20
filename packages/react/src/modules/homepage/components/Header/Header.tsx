import clsx from 'clsx';
import { useTranslation } from 'react-i18next';

import {
  Avatar,
  Badge,
  LogoBeta,
  Popover,
  PopoverBody,
  VisuallyHidden,
} from '../../../../components';
import {
  useConversation,
  useHasWorkflow,
  useHover,
  useUser,
} from '../../../../hooks';

import { useId } from 'react';
import { Navbar } from '../../../../components/Layout/components/Navbar';
import { NavItem } from '../../../../components/Layout/components/NavItem';
import { NavLink } from '../../../../components/Layout/components/NavLink';
import useHeader from '../../../../components/Layout/hooks/useHeader';
import { useEdificeTheme } from '../../../../providers/';
import {
  IconCommunitiesBeta,
  IconDisconnect,
  IconHomeBeta,
  IconMessagesBeta,
  IconMyAppsBeta,
} from '../../../icons/components/nav';

export interface HeaderProps {
  src: string | undefined;
}

const Header = ({ src = '' }: HeaderProps): JSX.Element => {
  const { t } = useTranslation();
  const { messages } = useConversation();
  const { user, avatar } = useUser();

  const hasCarbonioPreauthWorkflow =
    useHasWorkflow(
      'org.entcore.auth.controllers.CarbonioPreauthController|preauth',
    ) || false;

  const classes = clsx('header d-print-none no-2d no-1d');

  const { userAvatar, userName, communityWorkflow, conversationWorflow } =
    useHeader({ user, avatar });
  const { theme } = useEdificeTheme();

  const hasMessages = messages > 0;

  /**
   * useHover hook
   */
  const [userRef, isUserHovered] = useHover<HTMLLIElement>();

  /**
   * IDs for Popover Component
   */
  const popoverUserId = useId();

  return (
    <header className={classes}>
      <Navbar className="px-24 py-8">
        <LogoBeta src={`${src}/img/illustrations/logo.png`} />
        <ul className="navbar-nav">
          <NavItem>
            <NavLink link="/timeline/timeline" translate={t('navbar.home')}>
              <IconHomeBeta />
            </NavLink>
          </NavItem>
          {communityWorkflow && (
            <NavItem>
              <NavLink link="/community" translate={t('navbar.community')}>
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
              >
                <IconMessagesBeta />
                {hasMessages && (
                  <Badge
                    variant={{ type: 'notification', level: 'warning' }}
                    className="position-absolute"
                  >
                    {messages}
                  </Badge>
                )}
              </NavLink>
            </NavItem>
          )}
          {hasCarbonioPreauthWorkflow && (
            <NavItem>
              <a
                className="nav-link position-relative"
                href="/auth/carbonio/preauth"
                target="_blank"
              >
                <IconMessagesBeta />
                <VisuallyHidden>{t('conversation')}</VisuallyHidden>
              </a>
            </NavItem>
          )}
          <NavItem>
            <NavLink link="/welcome" translate={t('navbar.applications')}>
              <IconMyAppsBeta />
            </NavLink>
          </NavItem>
          <NavItem
            className="position-relative"
            ref={userRef}
            id={popoverUserId}
            aria-haspopup="true"
            aria-expanded={isUserHovered}
          >
            <NavLink
              link="/userbook/mon-compte"
              translate={t('navbar.myaccount')}
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
            <Popover
              className="top-100 widget"
              id={popoverUserId}
              isVisible={isUserHovered}
            >
              <PopoverBody>
                <a
                  href={
                    '/auth/logout?callback=' + (theme?.logoutCallback ?? '')
                  }
                  className="nav-link"
                >
                  <IconDisconnect className="icon logout" />
                  <span id="logout-label" className="nav-text">
                    {t('navbar.disconnect')}
                  </span>
                </a>
              </PopoverBody>
            </Popover>
          </NavItem>
        </ul>
      </Navbar>
    </header>
  );
};

Header.displayName = 'Header';

export default Header;
