import { useNotificationListContainer } from './hooks/useNotificationList';
import NotificationList from './NotificationList';

export type NotificationListContainerProps = {
  /** Callback when the notifications list is closed */
  onCloseNotifications?: () => void;
};
export const NotificationListContainer = ({
  onCloseNotifications,
}: NotificationListContainerProps) => {
  const { notifications, error, hasNextPage, loadNextPage, isLoading } =
    useNotificationListContainer();

  const handleLoadNextPage = () => {
    if (hasNextPage && !isLoading) {
      loadNextPage();
    }
  };

  // Hide the widget while loading or when the request failed.
  // Render NotificationList for an empty array so it can show its empty state.
  if (!notifications || error) {
    return null;
  }

  return (
    <NotificationList
      notifications={notifications}
      onCloseNotifications={onCloseNotifications}
      onLoadNextPage={handleLoadNextPage}
    />
  );
};

NotificationListContainer.displayName = 'NotificationListContainer';

export default NotificationListContainer;
