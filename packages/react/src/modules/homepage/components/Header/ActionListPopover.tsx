import { forwardRef } from 'react';

import clsx from 'clsx';
import { useTranslation } from 'react-i18next';

import { Popover, PopoverBody, PopoverProps } from '../../../../components';
import {
  IconLogout,
  IconSetBackground,
  IconUser,
} from '../../../icons/components';
import { ActionItem } from './ActionItem';

export interface ActionListPopoverProps extends Omit<PopoverProps, 'children'> {
  /**
   * Callback appended to the logout URL (from the theme configuration)
   */
  logoutCallback?: string;
}

/**
 * "Mon compte" popover of the Header v2: a white box listing the account
 * actions (my account, customize, logout).
 */
export const ActionListPopover = forwardRef<
  HTMLDivElement,
  ActionListPopoverProps
>(({ className, logoutCallback, ...restProps }, ref) => {
  const { t } = useTranslation();

  return (
    <Popover
      ref={ref}
      className={clsx('action-list-popover', className)}
      {...restProps}
    >
      <PopoverBody>
        <ul className="action-list-popover-list">
          <li>
            <ActionItem
              href="/userbook/mon-compte"
              icon={<IconUser />}
              data-testid="header-my-account-button"
            >
              {t('navbar.myaccount')}
            </ActionItem>
          </li>
          <li>
            <ActionItem
              href={
                '/timeline/customize?callback=' +
                encodeURIComponent(
                  `${window.location.pathname}${window.location.search}`,
                )
              }
              icon={<IconSetBackground />}
              data-testid="header-customize-button"
            >
              {t('navbar.customize')}
            </ActionItem>
          </li>
          <li>
            <ActionItem
              href={'/auth/logout?callback=' + (logoutCallback ?? '')}
              icon={<IconLogout />}
              variant="danger"
              data-testid="header-logout-button"
            >
              {t('navbar.disconnect')}
            </ActionItem>
          </li>
        </ul>
      </PopoverBody>
    </Popover>
  );
});

ActionListPopover.displayName = 'ActionListPopover';

export default ActionListPopover;
