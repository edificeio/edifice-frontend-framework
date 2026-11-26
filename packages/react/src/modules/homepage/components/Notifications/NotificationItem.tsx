import { NotificationModel } from '@edifice.io/client';
import NotificationOptionsMenu from './components/NotificationOptionsMenu';
import SystemNotificationItem from './components/SystemNotificationItem';
import UserNotificationItem from './components/UserNotificationItem';
import { notificationAdapter } from './components/notificationAdapter';

export type {
  SystemWebNotification,
  UserWebNotification,
  WebNotification,
} from './components/notificationAdapter';

export type NotificationProps = {
  notification: NotificationModel;
  /** Shows the options menu to report or delete the notification (default: true) */
  canManage?: boolean;
};

/**
 * Renders a single notification from a raw `NotificationModel`.
 *
 * Internally adapts the model into one of two display variants:
 * - **user** — triggered by another user (e.g. shared a resource); shows their avatar.
 * - **system** — triggered by an application event; shows the app icon.
 *
 * @example
 * <NotificationItem notification={notificationModel} />
 */
const NotificationItem = ({
  notification,
  canManage = true,
}: NotificationProps) => {
  const notif = notificationAdapter(notification);
  const menu = canManage ? (
    <NotificationOptionsMenu notificationId={notification._id} />
  ) : undefined;
  return (
    <>
      {notif.type === 'user' && (
        <UserNotificationItem notification={notif} menu={menu} />
      )}
      {notif.type === 'system' && (
        <SystemNotificationItem notification={notif} menu={menu} />
      )}
    </>
  );
};

NotificationItem.displayName = 'NotificationItem';

export default NotificationItem;
