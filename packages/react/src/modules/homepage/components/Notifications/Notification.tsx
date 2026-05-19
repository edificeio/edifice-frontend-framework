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

const Notification = ({ notification }: NotificationProps) => {
  const notif = notificationAdapter(notification);

  if (notif.type === 'user') {
    return <UserNotification notification={notif} />;
  }
  return <SystemNotification notification={notif} />;
};

Notification.displayName = 'Notification';

export default Notification;
