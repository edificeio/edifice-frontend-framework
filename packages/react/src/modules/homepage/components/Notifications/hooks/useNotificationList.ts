import { NotificationModel } from '@edifice.io/client';
import { useNotifications } from '../services/queries/notification';

export interface UseNotificationListContainerReturn {
  /** Array of notifications */
  notifications: NotificationModel[] | undefined;
  /** Loading state for fetching notifications */
  isLoading: boolean;
  /** Error state from fetching notifications */
  error: Error | null;
}

/**
 * Custom hook that provides notifications data and handlers with exposed loading states
 * @returns Object containing notifications, loading state, and error state
 */
export const useNotificationListContainer =
  (): UseNotificationListContainerReturn => {
    const { data: notifications, isLoading, error } = useNotifications();

    return {
      notifications,
      isLoading,
      error,
    };
  };
