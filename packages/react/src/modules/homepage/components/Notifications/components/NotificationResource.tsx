import { useTranslation } from 'react-i18next';
import { AppIcon } from '../../../../..';

export type NotificationResourceProps = {
  appCode: string;
};

/**
 * Displays the originating application of a notification as a small icon + label.
 *
 * Resolves the human-readable app name via i18n key `timeline.apptype.<appCode>`,
 * falling back to the raw `appCode` if no translation exists.
 *
 */
const NotificationResource = ({ appCode }: NotificationResourceProps) => {
  const { t } = useTranslation();

  const appLabel = t(`${appCode}`, {
    defaultValue: appCode,
  });

  const appCssClass = `app-${appCode}`;
  return (
    <div className={`notification-resource ${appCssClass} bg-app-light`}>
      <span className="notification-resource-icon">
        <AppIcon app={appCode} size="24" iconFit="contain" />
      </span>
      <span className="notification-resource-name color-app">{appLabel}</span>
    </div>
  );
};

NotificationResource.displayName = 'NotificationResource';

export default NotificationResource;
