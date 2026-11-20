import { NotificationSummary } from '@edifice.io/client';

/** Notification field the resource ids are matched against. */
export type NotificationGroupBy = 'resource' | 'sub-resource';

export interface CountNotificationsParams {
  /** Notification type, e.g. 'MESSAGERIE', 'BLOG'. */
  type: string;
  /** Ids to count notifications for. */
  resourceIds: string[];
  /** Field the ids are matched against. Defaults to 'resource'. */
  groupBy?: NotificationGroupBy;
  /** Only count these event types (e.g. 'SEND-MESSAGE'). All when omitted or empty. */
  eventTypes?: string[];
}

/**
 * Count notifications per resource id.
 * @returns a count for every requested id, 0 when it has no notification.
 */
export function countNotifications(
  notifications: NotificationSummary[],
  {
    type,
    resourceIds,
    groupBy = 'resource',
    eventTypes,
  }: CountNotificationsParams,
): Record<string, number> {
  const counts = new Map<string, number>(resourceIds.map((id) => [id, 0]));
  const acceptedEventTypes = eventTypes?.length ? new Set(eventTypes) : null;

  for (const notification of notifications) {
    if (notification.type !== type) continue;
    if (
      acceptedEventTypes &&
      !acceptedEventTypes.has(notification['event-type'] ?? '')
    ) {
      continue;
    }
    const id = notification[groupBy];
    const count = id === undefined ? undefined : counts.get(id);
    if (id !== undefined && count !== undefined) counts.set(id, count + 1);
  }

  return Object.fromEntries(counts);
}
