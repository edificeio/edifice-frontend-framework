import { useTranslation } from 'react-i18next';
import { AppIcon } from '../../../../..';

export type NotificationItemResourceProps = {
  appCode: string;
};

/**
 * Displays the originating application of a notification as a small icon + label.
 *
 * Resolves the human-readable app name via i18n key `<appCode>` present in entcore/portal/backend/src/main/resources/i18n/fr.json,
 * falling back to the raw `appCode` if no translation exists.
 *
 */
const NotificationItemResource = ({
  appCode,
}: NotificationItemResourceProps) => {
  const { t } = useTranslation();

  const appLabel = t(`${appCode}`, {
    defaultValue: appCode,
  });

  const appCssClass = `app-${appCode}`;
  return (
    <div className={`notification-item-resource ${appCssClass} bg-app-light`}>
      <span className="notification-item-resource-icon">
        <AppIcon app={appCode} size="20" iconFit="contain" />
      </span>
      <span className="notification-item-resource-name color-app">
        {appLabel}
      </span>
    </div>
  );
};

NotificationItemResource.displayName = 'NotificationItemResource';

export default NotificationItemResource;
