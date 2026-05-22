import { NotificationModel } from '@edifice.io/client';
import {
  useNotifications,
  useNotificationTypes,
} from '../services/queries/notification';

export interface UseNotificationListContainerReturn {
  /** Array of notifications */
  notifications: NotificationModel[] | undefined;
  /** Array of notification types */
  notificationTypes: string[] | undefined;
  /** Indicates if there are more notifications to load */
  hasNextPage: boolean | undefined;
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
    const {
      data: notificationTypes,
      isLoading: isLoadingTypes,
      isFetched: isFetchedTypes,
      error: errorTypes,
    } = useNotificationTypes();

    const {
      data: notifications,
      hasNextPage,

      isLoading: isLoadingNotifications,
      error: errorNotifications,
    } = useNotifications(
      notificationTypes ?? [],
      isFetchedTypes && !!notificationTypes,
    );

    return {
      notifications,
      notificationTypes,
      hasNextPage,
      isLoading: isLoadingTypes || isLoadingNotifications,
      error: errorTypes || errorNotifications,
    };
  };
