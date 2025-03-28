import { useTranslation } from 'react-i18next';
import { Button, Modal } from '../../../components';

interface AddAttachmentToWorkspaceModalProps {
  /**
   * Modal id (useful when multiple modal on the same page)
   */
  id: string;
  /**
   * Is Modal Open
   */
  isOpen: boolean;
  /**
   * Function to call when success button proceed
   */
  onSuccess?: () => void;
  /**
   * Function to call when closing modal
   */
  onCancel?: () => void;
}

export default function AddAttachmentToWorkspaceModal({
  isOpen,
  onSuccess = () => ({}),
  onCancel = () => ({}),
}: AddAttachmentToWorkspaceModalProps) {
  const { t } = useTranslation('common');

  return (
    <Modal
      isOpen={isOpen}
      onModalClose={onCancel}
      id="add-attachment-to-workspace-modal"
      size="md"
    >
      <Modal.Header onModalClose={onCancel}>
        {t('attachments.add.to.folder')}
      </Modal.Header>
      <Modal.Body>
        <p>{t('attachments.add.to.folder.description')}</p>
      </Modal.Body>
      <Modal.Footer>
        <Button
          type="button"
          color="tertiary"
          variant="ghost"
          onClick={onCancel}
        >
          {t('cancel')}
        </Button>
        <Button
          type="submit"
          color="primary"
          variant="filled"
          onClick={onSuccess}
        >
          {t('add')}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
