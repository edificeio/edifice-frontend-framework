import NotificationList from './NotificationList';
import { useNotificationListContainer } from './hooks/useNotificationList';

export type NotificationListContainerProps = {
  /** Callback when the notifications list is closed */
  onCloseNotifications?: () => void;
};
export const NotificationListContainer = ({
  onCloseNotifications,
}: NotificationListContainerProps) => {
  const {
    notifications,
    notificationTypes,
    selectedTypes,
    setSelectedTypes,
    hasNextPage,
    loadNextPage,
    isLoading,
  } = useNotificationListContainer();

  const handleLoadNextPage = () => {
    if (hasNextPage && !isLoading) {
      loadNextPage();
    }
  };

  return (
    <NotificationList
      notifications={notifications}
      notificationTypes={notificationTypes}
      selectedTypes={selectedTypes}
      onFilterChange={setSelectedTypes}
      onCloseNotifications={onCloseNotifications}
      onLoadNextPage={handleLoadNextPage}
      hasNextPage={hasNextPage}
      isLoading={isLoading}
    />
  );
};

NotificationListContainer.displayName = 'NotificationListContainer';

export default NotificationListContainer;
