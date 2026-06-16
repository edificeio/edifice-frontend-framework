import { useTranslation } from 'react-i18next';
import { AppIcon } from '../../../../..';
import type { SystemWebNotification } from './notificationAdapter';
import NotificationItem from './NotificationItem';

export type SystemNotificationProps = {
  notification: SystemWebNotification;
};

/**
 * Renders a system notification (no sender) using an app icon as the picture.
 *
 * Wraps `NotificationItem` — prefer using `Notification` at the top level
 * rather than this component directly.
 */
const SystemNotification = ({ notification }: SystemNotificationProps) => {
  const { params, message, date, uri } = notification;
  const { t } = useTranslation();
  const appName = t(params.appCode);

  return (
    <NotificationItem
      uri={uri}
      message={message}
      date={date}
      picture={
        <a
          href={uri}
          title={appName}
          data-testid="notification-app-icon"
          aria-label={t('homepage.notifications.app-icon.placeholder')}
        >
          <AppIcon
            app={params.appCode}
            size="24"
            variant="square"
            className="notification-app-icon"
          />
        </a>
      }
    />
  );
};

SystemNotification.displayName = 'SystemNotification';

export default SystemNotification;
