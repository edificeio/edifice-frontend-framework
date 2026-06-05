import { Avatar, useDirectory } from '../../../../..';
import { useTranslation } from 'react-i18next';
import type { UserWebNotification } from './notificationAdapter';
import NotificationItem from './NotificationItem';
import NotificationResource from './NotificationResource';

export type UserNotificationProps = {
  notification: UserWebNotification;
};

/**
 * Renders a user-triggered notification using the sender's avatar as the picture.
 *
 * The avatar and its link are resolved via `useDirectory`. Wraps `NotificationItem`
 * — prefer using `Notification` at the top level rather than this component directly.
 */
const UserNotification = ({ notification }: UserNotificationProps) => {
  const { getAvatarURL, getUserbookURL } = useDirectory();
  const { params, message, date, uri } = notification;
  const { t } = useTranslation();
  const userName = t(
    notification.params.username ?? 'homepage.notifications.avatar.placeholder',
  );
  return (
    <NotificationItem
      uri={uri}
      message={message}
      date={date}
      picture={
        <a
          href={getUserbookURL(params.userId ?? '', 'user')}
          title={userName}
          data-testid="notification-avatar"
        >
          <Avatar
            src={getAvatarURL(params.userId ?? '', 'user')}
            alt={userName}
            variant="circle"
            className="notification-avatar"
          />
        </a>
      }
    >
      {/* TODO: Uncomment this when the notification resource is implemented IMPULS-5666 */}
      {params.appCode && <NotificationResource appCode={params.appCode} />}
    </NotificationItem>
  );
};

UserNotification.displayName = 'UserNotification';

export default UserNotification;
