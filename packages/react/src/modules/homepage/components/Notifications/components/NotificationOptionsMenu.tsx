import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Dropdown, IconButton } from '../../../../..';
import {
  IconAlertTriangle,
  IconDelete,
  IconOptions,
} from '../../../../icons/components';
import {
  useDeleteNotification,
  useReportNotification,
} from '../services/queries/notification';
import ReportNotificationModal from './ReportNotificationModal';

export type NotificationOptionsMenuProps = {
  notificationId: string;
};

/**
 * Options menu for a single notification row, allowing the user to report
 * or delete it.
 */
const NotificationOptionsMenu = ({
  notificationId,
}: NotificationOptionsMenuProps) => {
  const { t } = useTranslation();
  const { mutate: reportNotification } = useReportNotification();
  const { mutate: deleteNotification } = useDeleteNotification();
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  const handleConfirmReport = () => {
    reportNotification(notificationId);
    setIsReportModalOpen(false);
  };

  return (
    <>
      <Dropdown overflow={false}>
        {(triggerProps) => (
          <>
            <IconButton
              {...triggerProps}
              type="button"
              aria-label={t('homepage.notifications.options.label')}
              color="tertiary"
              variant="ghost"
              icon={<IconOptions />}
              data-testid="notification-item-options-button"
            />
            <Dropdown.Menu>
              <Dropdown.Item
                icon={<IconAlertTriangle />}
                onClick={() => setIsReportModalOpen(true)}
              >
                {t('homepage.notifications.options.report')}
              </Dropdown.Item>
              <Dropdown.Item
                icon={<IconDelete />}
                onClick={() => deleteNotification(notificationId)}
              >
                {t('homepage.notifications.options.delete')}
              </Dropdown.Item>
            </Dropdown.Menu>
          </>
        )}
      </Dropdown>
      {isReportModalOpen && (
        <ReportNotificationModal
          isOpen={isReportModalOpen}
          onCancel={() => setIsReportModalOpen(false)}
          onConfirm={handleConfirmReport}
        />
      )}
    </>
  );
};

NotificationOptionsMenu.displayName = 'NotificationOptionsMenu';

export default NotificationOptionsMenu;
