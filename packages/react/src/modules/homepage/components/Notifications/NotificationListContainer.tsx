import NotificationList from './NotificationList';
import { useNotificationListContainer } from './hooks/useNotificationList';

export type NotificationListContainerProps = {
  /** Callback when the notifications list is closed */
  onCloseNotifications?: () => void;
};
export const NotificationListContainer = ({
  onCloseNotifications,
}: NotificationListContainerProps) => {
  const { notifications, error, hasNextPage, loadNextPage, isLoading } =
    useNotificationListContainer();
  console.log('isLoading:', isLoading);

  const handleLoadNextPage = () => {
    if (hasNextPage && !isLoading) {
      loadNextPage();
    }
  };

  return (
    <NotificationList
      notifications={notifications}
      onCloseNotifications={onCloseNotifications}
      onLoadNextPage={handleLoadNextPage}
      hasNextPage={hasNextPage}
      isLoading={isLoading}
    />
  );
};

NotificationListContainer.displayName = 'NotificationListContainer';

export default NotificationListContainer;
