import { Avatar, useDirectory } from '../../../../..';
import type { UserWebNotification } from './notificationAdapter';
import NotificationItem from './NotificationItem';

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

  return (
    <NotificationItem
      uri={uri}
      message={message}
      date={date}
      picture={
        <a
          href={getUserbookURL(params.userId ?? '', 'user')}
          data-testid="notification-picture-avatar"
        >
          <Avatar
            src={getAvatarURL(params.userId ?? '', 'user')}
            alt={params.username ?? ''}
            variant="circle"
            className="notification-avatar"
          />
        </a>
      }
    >
      {/* TODO: Uncomment this when the notification resource is implemented IMPULS-5666 */}
      {/* {params.appCode && <NotificationResource appCode={params.appCode} />} */}
    </NotificationItem>
  );
};

UserNotification.displayName = 'UserNotification';

export default UserNotification;
