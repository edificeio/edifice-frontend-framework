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

  const appLabel = t(`timeline.apptype.${appCode}`, {
    defaultValue: appCode,
  });

  return (
    <div className="notification-resource">
      <span className="notification-resource-icon">
        <AppIcon app={appCode} size="24" iconFit="contain" />
      </span>
      <span className="notification-resource-name">{appLabel}</span>
    </div>
  );
};

NotificationResource.displayName = 'NotificationResource';

export default NotificationResource;
