import { useMemo } from 'react';
import { useTimelineNotificationsSince } from '../useTimelineNotificationsSince';
import {
  countNotifications,
  CountNotificationsParams,
} from './countNotifications';

export interface UseTimelineNotificationCountParams extends CountNotificationsParams {
  /** Count notifications received since this date (inclusive); skipped when undefined. */
  since: Date | undefined;
}

/**
 * Number of timeline notifications received since a date, per resource id.
 *
 * All calls on the same day share a single backend call (see
 * `useTimelineNotificationsSince`), whatever their ids, type or `groupBy`.
 */
const useTimelineNotificationCount = ({
  since,
  type,
  resourceIds,
  groupBy = 'resource',
  eventTypes,
}: UseTimelineNotificationCountParams) => {
  const { data, isLoading, isError } = useTimelineNotificationsSince(since);

  // Depend on the array contents, not on their identity, so that callers can
  // pass inline arrays without recomputing (and re-rendering) on each render.
  const resourceIdsKey = JSON.stringify(resourceIds);
  const eventTypesKey = JSON.stringify(eventTypes ?? []);

  const counts = useMemo(
    () =>
      countNotifications(data?.notifications ?? [], {
        type,
        resourceIds: JSON.parse(resourceIdsKey),
        groupBy,
        eventTypes: JSON.parse(eventTypesKey),
      }),
    [data?.notifications, type, resourceIdsKey, groupBy, eventTypesKey],
  );

  return {
    /** Count for every requested id, 0 when it has no notification. */
    counts,
    /** True when the counts are partial (backend cap reached). */
    isTruncated: data?.isTruncated ?? false,
    isLoading,
    isError,
  } as const;
};

export default useTimelineNotificationCount;
