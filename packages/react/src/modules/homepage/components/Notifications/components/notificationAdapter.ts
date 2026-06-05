import { NotificationModel } from '@edifice.io/client';

type NotificationType = 'system' | 'user';

type WebNotificationBase = {
  id: string;
  uri?: string;
  message: string;
  date: Date;
};

/** Notification triggered by another user (e.g. shared a resource). */
export type UserWebNotification = WebNotificationBase & {
  type: 'user';
  params: {
    username?: string;
    userId?: string;
    appCode?: string;
  };
};

/** Notification triggered by an application event (no sender). */
export type SystemWebNotification = WebNotificationBase & {
  type: 'system';
  params: {
    appCode?: string;
  };
};

/** Discriminated union — narrow on `type` to get the specific variant. */
export type WebNotification = UserWebNotification | SystemWebNotification;

const resolveNotificationResourceUri = (
  params: NotificationModel['params'],
  type: NotificationType,
): string | undefined => {
  if (type === 'user') {
    return params.resourceUri || params.uri;
  }

  for (const [key, value] of Object.entries(params)) {
    if (
      typeof value === 'string' &&
      value.length > 0 &&
      key.endsWith('Uri') &&
      key !== 'profilUri' &&
      key !== 'resourceFolderUri'
    ) {
      return value;
    }
  }
  return undefined;
};

const parseNotificationMessage = (message: string): string => {
  return message
    .replace(/<\/a>/gi, '</strong>')
    .replace(/<a\b[^>]*>/gi, '<strong>');
};

/**
 * Transforms a raw `NotificationModel` (API shape) into a `WebNotification`
 * ready for rendering.
 *
 * Responsibilities:
 * - Determines the variant: **user** when a `sender` is present, **system** otherwise.
 * - Resolves the target URI from the model's `params` (handles both user and system naming conventions).
 * - Converts the MongoDB `$date` timestamp to a JS `Date`.
 * - Normalises the `type` field into a kebab-case `appCode` (e.g. `"BLOG_POST"` → `"blog-post"`).
 * - Strips anchor tags from the message, keeping only the inner text as `<strong>`.
 */
export const notificationAdapter = (
  notification: NotificationModel,
): WebNotification => {
  const type = notification.sender ? 'user' : 'system';
  const uri = resolveNotificationResourceUri(notification.params, type);
  const date = new Date(notification.date.$date);
  const appCode = notification.type.toLowerCase().replace(/_/g, '-');
  const message = parseNotificationMessage(notification.message);
  const base = {
    id: notification._id,
    uri,
    message,
    date,
  };

  if (type === 'user') {
    return {
      ...base,
      type: 'user',
      params: {
        username: notification.params.username,
        userId: notification.sender,
        appCode,
      },
    };
  }

  return {
    ...base,
    type: 'system',
    params: { appCode },
  };
};
