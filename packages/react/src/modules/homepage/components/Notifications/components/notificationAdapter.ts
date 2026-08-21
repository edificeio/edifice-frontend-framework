import { NotificationModel } from '@edifice.io/client';

type NotificationType = 'system' | 'user';

interface WebNotificationParamsBase {
  appCode: string;
  appI18nKey: string;
}

interface WebNotificationBase {
  type: NotificationType;
  id: string;
  uri?: string;
  message: string;
  date: Date;
  params: WebNotificationParamsBase;
}

/** Notification triggered by another user (e.g. shared a resource). */
export type UserWebNotification = WebNotificationBase & {
  type: 'user';
  params: WebNotificationParamsBase & {
    username: string;
    userId: string;
  };
};

/** Notification triggered by an application event (no sender). */
export type SystemWebNotification = WebNotificationBase & {
  type: 'system';
};

/** Discriminated union — narrow on `type` to get the specific variant. */
export type WebNotification = UserWebNotification | SystemWebNotification;

const resolveNotificationResourceUri = (
  params: NotificationModel['params'],
  type: NotificationType,
  appCode: string,
  eventType?: NotificationModel['event-type'],
): string | undefined => {
  // When the notification is a report, open the admin console.
  if (appCode === 'timeline' && eventType === 'NOTIFY-REPORT') {
    return '/admin';
  }

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

export const getAppCodeAndI18nKey = (appCode: string): [string, string] => {
  appCode = appCode.toLowerCase();
  let appI18nKey: string = appCode;

  // Some notification return the wrong appcode for historical reasons, we need to match the real application type to apply the correct color in the timeline.
  switch (appCode) {
    case 'collaborativewall':
      appCode = 'collaborative-wall';
      break;
    case 'formulaire':
      appI18nKey = appCode = 'forms';
      break;
    case 'messagerie':
      appI18nKey = appCode = 'conversation';
      break;
    case 'news':
      appI18nKey = appCode = 'actualites';
      break;
    case 'homeworks':
      appCode = 'cahier-de-texte';
      break;
    case 'userbook_motto':
    case 'userbook_mood':
    case 'userbook_discovervisiblegroups':
      appCode = 'userbook';
      break;
    default:
      appI18nKey = appCode = appCode.replace(/_/g, '-');
  }

  return [appCode, appI18nKey];
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
  const [appCode, appI18nKey] = getAppCodeAndI18nKey(notification.type);
  const uri = resolveNotificationResourceUri(
    notification.params,
    type,
    appCode,
    notification['event-type'] || notification['eventType'],
  );
  const date = new Date(notification.date.$date);
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
        username: notification.params.username!, // cannot be undefined if sender is present (user type)
        userId: notification.sender!, // cannot be undefined if sender is present (user type)
        appCode,
        appI18nKey,
      },
    };
  }

  return {
    ...base,
    type: 'system',
    params: { appCode, appI18nKey },
  };
};
