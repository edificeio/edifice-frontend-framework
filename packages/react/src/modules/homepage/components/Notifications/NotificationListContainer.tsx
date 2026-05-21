import { useNotificationListContainer } from './hooks/useNotificationList';
import NotificationList from './NotificationList';

export type NotificationListContainerProps = {
  /** Callback when the notifications list is closed */
  onCloseNotifications?: () => void;
};
export const NotificationListContainer = ({
  onCloseNotifications,
}: NotificationListContainerProps) => {
  const { notifications, error } = useNotificationListContainer();

  // No notifications or loading state
  if (!notifications || notifications.length === 0 || error) {
    return null;
  }

  return (
    <NotificationList
      notifications={notifications}
      onCloseNotifications={onCloseNotifications}
    />
  );
};

NotificationListContainer.displayName = 'NotificationListContainer';

export default NotificationListContainer;
