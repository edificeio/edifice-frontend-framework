import { useTranslation } from 'react-i18next';
import { Button, Modal } from '../../../components';

interface DeleteModalProps {
  isOpen: boolean;
  onCancel: () => void;
  onSuccess: () => void;
}

export const DeleteModal = ({
  isOpen,
  onCancel,
  onSuccess,
}: DeleteModalProps) => {
  const { t } = useTranslation();
  return (
    <Modal
      size="sm"
      isOpen={isOpen}
      onModalClose={onCancel}
      id="delete-comment-modal"
    >
      <Modal.Header onModalClose={onCancel}>
        {t('comment.delete.modal.title')}
      </Modal.Header>
      <Modal.Body>
        <p>{t('comment.delete.modal.body')}</p>
      </Modal.Body>
      <Modal.Footer>
        <Button
          color="tertiary"
          onClick={onCancel}
          type="button"
          variant="ghost"
        >
          {t('cancel')}
        </Button>
        <Button
          color="danger"
          onClick={onSuccess}
          type="button"
          variant="filled"
        >
          {t('comment.delete.modal.delete')}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DeleteModal;
