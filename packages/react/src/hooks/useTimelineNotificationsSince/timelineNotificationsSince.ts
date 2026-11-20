import { NotificationSummary, odeServices } from '@edifice.io/client';
import { queryOptions, skipToken } from '@tanstack/react-query';

/**
 * Maximum number of notifications returned by `GET /timeline/notifications/since`.
 * Mirrors `MAX_RECEIVED_SINCE` in entcore's `DefaultTimelineEventStore`.
 */
export const MAX_NOTIFICATIONS_SINCE = 1000;

export const timelineQueryKeys = {
  all: () => ['timeline'] as const,
  notificationsSince: () =>
    [...timelineQueryKeys.all(), 'notifications', 'since'] as const,
  notificationsSinceAnchor: (anchor: string | null) =>
    [...timelineQueryKeys.notificationsSince(), anchor] as const,
};

/**
 * Start of the (local) day of a date.
 * Every query is anchored on it, so that all callers asking for the same day
 * share a single backend call, whatever the exact time they ask for.
 */
export function getDayAnchor(date: Date): Date {
  const anchor = new Date(date);
  anchor.setHours(0, 0, 0, 0);
  return anchor;
}

export function getNotificationTime(notification: NotificationSummary) {
  return new Date(notification.date.$date).getTime();
}

export interface NotificationsSinceResult {
  /** Notifications received since the requested date, newest first. */
  notifications: NotificationSummary[];
  /** True when the backend cap was reached before covering the requested date. */
  isTruncated: boolean;
}

/**
 * Narrow the notifications fetched since a day anchor to those received
 * since an exact date.
 * @param results - notifications returned by the backend, newest first.
 * @param since - exact lower bound (inclusive), later than or equal to the anchor.
 */
export function selectNotificationsSince(
  results: NotificationSummary[],
  since: Date,
): NotificationsSinceResult {
  const sinceTime = since.getTime();
  const notifications = results.filter(
    (notification) => getNotificationTime(notification) >= sinceTime,
  );
  // The backend sorts newest first, then caps: when the cap is reached, only
  // notifications older than the oldest returned one may be missing.
  const oldest = results[results.length - 1];
  const isTruncated =
    results.length >= MAX_NOTIFICATIONS_SINCE &&
    (!oldest || getNotificationTime(oldest) >= sinceTime);
  return { notifications, isTruncated };
}

export const timelineQueryOptions = {
  /**
   * Notifications received since a day anchor (see `getDayAnchor`).
   * Skipped when no anchor is given.
   */
  notificationsSince(anchor: Date | undefined) {
    return queryOptions({
      queryKey: timelineQueryKeys.notificationsSinceAnchor(
        anchor?.toISOString() ?? null,
      ),
      queryFn: anchor
        ? () =>
            odeServices
              .timeline()
              .getNotificationsSince(anchor, { disableNotifications: true })
        : skipToken,
      staleTime: 5 * 60 * 1000, // 5 minutes
      // A failure means no counter, not another try.
      retry: false,
    });
  },
};
