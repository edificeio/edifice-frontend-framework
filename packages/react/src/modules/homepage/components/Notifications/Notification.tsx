import { NotificationModel } from '@edifice.io/client';
import SystemNotification from './components/SystemNotification';
import UserNotification from './components/UserNotification';
import { notificationAdapter } from './components/notificationAdapter';

export type {
  SystemWebNotification,
  UserWebNotification,
  WebNotification,
} from './components/notificationAdapter';

export type NotificationProps = {
  notification: NotificationModel;
};

/**
 * Renders a single notification from a raw `NotificationModel`.
 *
 * Internally adapts the model into one of two display variants:
 * - **user** — triggered by another user (e.g. shared a resource); shows their avatar.
 * - **system** — triggered by an application event; shows the app icon.
 *
 * @example
 * <Notification notification={notificationModel} />
 */
const Notification = ({ notification }: NotificationProps) => {
  const notif = notificationAdapter(notification);
  return (
    <>
      {notif.type === 'user' && <UserNotification notification={notif} />}
      {notif.type === 'system' && <SystemNotification notification={notif} />}
    </>
  );
};

Notification.displayName = 'Notification';

export default Notification;
