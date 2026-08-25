import { NotificationModel } from '@edifice.io/client';
import { useEffect, useState } from 'react';
import { useDate } from '../../../../..';
import {
  useNotifications,
  useNotificationTypes,
  useSaveTimelinePreference,
  useTimelinePreference,
} from '../services/queries/notification';

export interface UseNotificationListContainerReturn {
  /** Array of notifications */
  notifications: NotificationModel[] | undefined;
  /** Array of all notification types available */
  notificationTypes: string[] | undefined;
  /** Array of notification types currently selected as filter */
  selectedTypes: string[] | undefined;
  /** Callback to change the selected notification types filter */
  setSelectedTypes: (types: string[]) => void;
  /** Indicates if there are more notifications to load */
  hasNextPage: boolean | undefined;
  /** Callback to load the next page of notifications */
  loadNextPage: () => void;
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

    const { data: preference, isFetched: isFetchedPreference } =
      useTimelinePreference();
    const { mutate: saveTimelinePreference } = useSaveTimelinePreference();

    const [selectedTypes, setSelectedTypesState] = useState<string[]>();

    // The user's saved type filter must be read before the first
    // `lastNotifications` call, so it only fetches the preferred types.
    useEffect(() => {
      if (
        selectedTypes === undefined &&
        isFetchedTypes &&
        isFetchedPreference
      ) {
        const preferredTypes = preference?.type;
        setSelectedTypesState(
          preferredTypes && preferredTypes.length > 0
            ? preferredTypes
            : (notificationTypes ?? []),
        );
      }
    }, [
      selectedTypes,
      isFetchedTypes,
      isFetchedPreference,
      preference,
      notificationTypes,
    ]);

    const setSelectedTypes = (types: string[]) => {
      setSelectedTypesState(types);
      saveTimelinePreference({ ...preference, type: types });
    };

    const {
      data: notifications,
      hasNextPage,
      isLoading: isLoadingNotifications,
      error: errorNotifications,
      fetchNextPage,
    } = useNotifications(
      selectedTypes ?? [],
      isFetchedTypes && !!selectedTypes,
    );

    return {
      notifications,
      notificationTypes,
      selectedTypes,
      setSelectedTypes,
      hasNextPage,
      loadNextPage: () => fetchNextPage(),
      isLoading: isLoadingTypes || isLoadingNotifications,
      error: errorTypes || errorNotifications,
    };
  };

/**
 * Indicates whether the user has at least one notification dated today,
 * across all notification types. Used to display a "new notification"
 * badge on the notification bell icon, independently of the list overlay.
 */
export const useHasNotificationToday = (): boolean => {
  const { dateIsToday } = useDate();
  // `lastNotifications` returns no result when no `type` is given, so all
  // known types must be fetched first and passed explicitly.
  const { data: notificationTypes, isFetched: isFetchedTypes } =
    useNotificationTypes();
  const { data: notifications } = useNotifications(
    notificationTypes ?? [],
    isFetchedTypes,
  );

  return (
    notifications?.some((notification) => dateIsToday(notification.date)) ??
    false
  );
};
