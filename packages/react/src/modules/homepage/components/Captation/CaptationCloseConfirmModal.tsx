import { useTranslation } from 'react-i18next';

import {
  ButtonBeta as Button,
  ModalBeta as Modal,
} from '../../../../components';

export interface CaptationCloseConfirmModalProps {
  /** Id of the confirmation modal (must be unique on the page). */
  id: string;
  /** Called when the user confirms they want to close the captation modal. */
  onConfirm: () => void;
  /** Called when the user goes back to the captation modal. */
  onCancel: () => void;
}

export function CaptationCloseConfirmModal({
  id,
  onConfirm,
  onCancel,
}: CaptationCloseConfirmModalProps) {
  const { t } = useTranslation();

  return (
    <Modal id={id} isOpen size="s" onModalClose={onCancel}>
      <Modal.Header onModalClose={onCancel}>
        {t('homepage.captation.closeConfirm.title')}
      </Modal.Header>
      <Modal.Body>
        <p>{t('homepage.captation.closeConfirm.body')}</p>
      </Modal.Body>
      <Modal.Footer>
        <Button
          type="button"
          variant="ghost"
          color="tertiary"
          data-testid={`${id}-button-cancel`}
          onClick={onCancel}
        >
          {t('homepage.captation.closeConfirm.cancel')}
        </Button>
        <Button
          type="button"
          color="destructive"
          data-testid={`${id}-button-confirm`}
          onClick={onConfirm}
        >
          {t('homepage.captation.closeConfirm.confirm')}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
