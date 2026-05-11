import { useNotificationListContainer } from './hooks/useNotificationList';
import NotificationList from './NotificationList';

export const NotificationListContainer = () => {
  const { notifications, error } = useNotificationListContainer();

  // No notifications or loading state
  if (!notifications || notifications.length === 0 || error) {
    return null;
  }

  return <NotificationList notifications={notifications} />;
};

NotificationListContainer.displayName = 'NotificationListContainer';

export default NotificationListContainer;
