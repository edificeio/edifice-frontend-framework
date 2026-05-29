import { AppIcon } from '../../../../..';
import type { SystemWebNotification } from './notificationAdapter';
import NotificationItem from './NotificationItem';

export type SystemNotificationProps = {
  notification: SystemWebNotification;
};

/**
 * Renders a system notification (no sender) using an app icon as the picture.
 *
 * Wraps `NotificationItem` — prefer using `Notification` at the top level
 * rather than this component directly.
 */
const SystemNotification = ({ notification }: SystemNotificationProps) => {
  const { params, message, date, uri } = notification;

  return (
    <NotificationItem
      uri={uri}
      message={message}
      date={date}
      picture={
        <a href={uri} title={params.appCode}>
          <AppIcon
            app={params.appCode}
            size="32"
            variant="square"
            className="notification-app-icon"
          />
        </a>
      }
    />
  );
};

SystemNotification.displayName = 'SystemNotification';

export default SystemNotification;
