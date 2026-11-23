import { NotificationSummary } from '@edifice.io/client';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { useCallback, useMemo } from 'react';
import {
  getDayAnchor,
  selectNotificationsSince,
  timelineQueryOptions,
} from './timelineNotificationsSince';

/**
 * Notifications received by the current user since a given date.
 *
 * The backend is queried from the start of the day of `since`, then results
 * are narrowed to `since` client-side: every call on the same day, wherever it
 * is made on the page, shares a single backend call.
 * The refresh policy (5 minutes of freshness, no polling) is deliberately not
 * configurable, to keep the number of backend calls to a minimum.
 *
 * @param since - exact lower bound (inclusive); the query is skipped when undefined.
 */
const useTimelineNotificationsSince = (since: Date | undefined) => {
  // Work on timestamps, so that a new Date instance with the same value
  // does not change anything.
  const sinceTime = since?.getTime();
  const anchorTime =
    sinceTime === undefined
      ? undefined
      : getDayAnchor(new Date(sinceTime)).getTime();

  const baseOptions = useMemo(
    () =>
      timelineQueryOptions.notificationsSince(
        anchorTime === undefined ? undefined : new Date(anchorTime),
      ),
    [anchorTime],
  );

  const select = useCallback(
    (results: NotificationSummary[]) =>
      selectNotificationsSince(results, new Date(sinceTime ?? 0)),
    [sinceTime],
  );

  return useQuery({
    ...baseOptions,
    select,
    // Keep the previous counters displayed while another day is loading,
    // but not once the date is removed: there is nothing to count then.
    placeholderData: sinceTime === undefined ? undefined : keepPreviousData,
  });
};

export default useTimelineNotificationsSince;
