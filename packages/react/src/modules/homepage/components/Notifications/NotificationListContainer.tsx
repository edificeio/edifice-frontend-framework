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

  // Hide the widget while loading or when the request failed.
  // Render NotificationList for an empty array so it can show its empty state.
  if (!notifications || error) {
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
