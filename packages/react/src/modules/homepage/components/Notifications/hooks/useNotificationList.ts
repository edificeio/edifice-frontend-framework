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
        // An empty saved filter means "no type selected" and must be kept:
        // only a missing preference falls back to every type.
        setSelectedTypesState(preference?.type ?? notificationTypes ?? []);
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

    // `lastNotifications` applies no filter when no type is given and returns
    // every notification, so an empty selection must not reach the API.
    const hasNoTypeSelected = selectedTypes?.length === 0;

    const {
      data,
      hasNextPage,
      isLoading: isLoadingNotifications,
      error: errorNotifications,
      fetchNextPage,
    } = useNotifications(
      selectedTypes ?? [],
      isFetchedTypes && !!selectedTypes && !hasNoTypeSelected,
    );

    return {
      notifications: hasNoTypeSelected ? [] : data,
      notificationTypes,
      selectedTypes,
      setSelectedTypes,
      hasNextPage: hasNoTypeSelected ? false : hasNextPage,
      loadNextPage: () => fetchNextPage(),
      // The notification query stays disabled until the saved filter is
      // read, so this wait must count as loading too.
      isLoading:
        isLoadingTypes || selectedTypes === undefined || isLoadingNotifications,
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
  // All known types are fetched first and passed explicitly, so the query
  // key matches the one used by the list when every type is selected.
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
