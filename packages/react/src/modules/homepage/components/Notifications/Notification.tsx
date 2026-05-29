import { NotificationModel } from '@edifice.io/client';

export type NotificationProps = { notification: NotificationModel };

const Notification = ({ notification }: NotificationProps) => {
  return <div>{notification.message}</div>;
};

Notification.displayName = 'Notification';

export default Notification;
