import { useTranslation } from 'react-i18next';
import { AppIcon } from '../../../../..';
import CommonNotificationItem from './CommonNotificationItem';
import type { SystemWebNotification } from './notificationAdapter';

export type SystemNotificationItemProps = {
  notification: SystemWebNotification;
};

/**
 * Renders a system notification (no sender) using an app icon as the picture.
 *
 * Wraps `NotificationItem` — prefer using `Notification` at the top level
 * rather than this component directly.
 */
const SystemNotificationItem = ({
  notification,
}: SystemNotificationItemProps) => {
  const { params, message, date, uri } = notification;
  const { t } = useTranslation();
  const appName = t(params.appCode);

  return (
    <CommonNotificationItem
      uri={uri}
      message={message}
      date={date}
      picture={
        <a
          href={uri}
          title={appName}
          data-testid="notification-item-app-icon"
          aria-label={t('homepage.notifications.app-icon.placeholder')}
        >
          <AppIcon
            app={params.appCode}
            size="24"
            variant="square"
            className="notification-item-app-icon"
          />
        </a>
      }
    />
  );
};

SystemNotificationItem.displayName = 'SystemNotificationItem';

export default SystemNotificationItem;
