import { NotificationModel } from '@edifice.io/client';

type NotificationType = 'system' | 'user';

type WebNotificationBase = {
  id: string;
  uri?: string;
  message: string;
  date: Date;
};

export type UserWebNotification = WebNotificationBase & {
  type: 'user';
  params: {
    username?: string;
    userId?: string;
    appCode?: string;
  };
};

export type SystemWebNotification = WebNotificationBase & {
  type: 'system';
  params: {
    appCode?: string;
  };
};

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
  return '/';
};

const parseNotificationMessage = (message: string): string => {
  return message
    .replace(/<\/a>/gi, '</strong>')
    .replace(/<a\b[^>]*>/gi, '<strong>');
};

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
