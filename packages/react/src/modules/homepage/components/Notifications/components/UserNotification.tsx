import { Avatar, useDirectory } from '../../../../..';
import type { UserWebNotification } from './notificationAdapter';
import NotificationItem from './NotificationItem';

export type UserNotificationProps = {
  notification: UserWebNotification;
};

const UserNotification = ({ notification }: UserNotificationProps) => {
  const { getAvatarURL, getUserbookURL } = useDirectory();
  const { params, message, date, uri } = notification;

  return (
    <NotificationItem
      uri={uri}
      message={message}
      date={date}
      picture={
        <a href={getUserbookURL(params.userId ?? '', 'user')}>
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
