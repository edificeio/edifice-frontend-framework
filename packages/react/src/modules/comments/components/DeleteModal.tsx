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
  return (
    <Modal isOpen={isOpen} onModalClose={onCancel} id="delete-comment-modal">
      <Modal.Header onModalClose={onCancel}>
        Suppression de commentaire
      </Modal.Header>
      <Modal.Body>
        <p>Voulez-vous vraiment supprimer ce commentaire ?</p>
      </Modal.Body>
      <Modal.Footer>
        <Button
          color="tertiary"
          onClick={onCancel}
          type="button"
          variant="ghost"
        >
          Annuler
        </Button>
        <Button
          color="danger"
          onClick={onSuccess}
          type="button"
          variant="filled"
        >
          Supprimer le commentaire
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DeleteModal;
