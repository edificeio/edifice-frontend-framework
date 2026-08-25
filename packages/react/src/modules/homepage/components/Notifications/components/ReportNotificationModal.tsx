import { useTranslation } from 'react-i18next';
import { ButtonBeta, Modal } from '../../../../..';
import { IconAlertTriangle } from '../../../../icons/components';

export type ReportNotificationModalProps = {
  isOpen: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

/**
 * Confirmation modal shown before reporting a notification as inappropriate.
 */
const ReportNotificationModal = ({
  isOpen,
  onCancel,
  onConfirm,
}: ReportNotificationModalProps) => {
  const { t } = useTranslation();

  return (
    <Modal
      id="report-notification-modal"
      size="lg"
      isOpen={isOpen}
      onModalClose={onCancel}
    >
      <Modal.Header onModalClose={onCancel}>
        {t('homepage.notifications.report-modal.title', {
          defaultValue: 'Signaler une notification',
        })}
      </Modal.Header>
      <Modal.Body>
        <p>
          {t('homepage.notifications.report-modal.body', {
            defaultValue:
              "Attention ! Vous souhaitez signaler une notification inappropriée ou qui ne respecte pas les conditions d'utilisation de ONE. L'heure et l'origine de ce signalement seront enregistrées et transmises à un administrateur pour traitement.",
          })}
        </p>
      </Modal.Body>
      <Modal.Footer>
        <ButtonBeta
          color="tertiary"
          onClick={onCancel}
          type="button"
          variant="ghost"
        >
          {t('cancel')}
        </ButtonBeta>
        <ButtonBeta
          color="default"
          onClick={onConfirm}
          type="button"
          variant="filled"
          leftIcon={<IconAlertTriangle />}
        >
          {t('homepage.notifications.report-modal.confirm', {
            defaultValue: 'Signaler la notification',
          })}
        </ButtonBeta>
      </Modal.Footer>
    </Modal>
  );
};

ReportNotificationModal.displayName = 'ReportNotificationModal';

export default ReportNotificationModal;
