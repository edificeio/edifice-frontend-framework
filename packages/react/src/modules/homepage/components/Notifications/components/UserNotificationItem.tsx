import { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Avatar, useDirectory } from '../../../../..';
import CommonNotificationItem from './CommonNotificationItem';
import type { UserWebNotification } from './notificationAdapter';
import NotificationItemResource from './NotificationItemResource';

export type UserNotificationItemProps = {
  notification: UserWebNotification;
  menu?: ReactNode;
};

/**
 * Renders a user-triggered notification using the sender's avatar as the picture.
 *
 * The avatar and its link are resolved via `useDirectory`. Wraps `NotificationItem`
 * — prefer using `Notification` at the top level rather than this component directly.
 */
const UserNotificationItem = ({
  notification,
  menu,
}: UserNotificationItemProps) => {
  const { getAvatarURL, getUserbookURL } = useDirectory();
  const { params, message, date, uri } = notification;
  const { t } = useTranslation();
  const userName = t(params.username);
  return (
    <CommonNotificationItem
      uri={uri}
      message={message}
      date={date}
      menu={menu}
      picture={
        <a
          href={getUserbookURL(params.userId, 'user')}
          title={userName}
          data-testid="notification-item-avatar"
        >
          <Avatar
            aria-label={t('homepage.notifications.avatar.placeholder')}
            src={getAvatarURL(params.userId, 'user')}
            alt={userName}
            variant="circle"
            className="notification-item-avatar"
          />
        </a>
      }
    >
      <NotificationItemResource
        appCode={params.appCode}
        appI18nKey={params.appI18nKey}
      />
    </CommonNotificationItem>
  );
};

UserNotificationItem.displayName = 'UserNotificationItem';

export default UserNotificationItem;
