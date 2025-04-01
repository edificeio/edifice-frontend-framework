import { useTranslation } from 'react-i18next';
import { Button, Modal } from '../../../components';
import WorkspaceFoldersTree from './components/WorkspaceFoldersTree';
import { useState } from 'react';

interface AddAttachmentToWorkspaceModalProps {
  /**
   * Modal id (useful when multiple modal on the same page)
   */
  id?: string;
  /**
   * Is Modal Open
   */
  isOpen?: boolean;
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
  id = 'add-attachment-to-workspace-modal',
  isOpen = false,
  onSuccess = () => ({}),
  onCancel = () => ({}),
}: AddAttachmentToWorkspaceModalProps) {
  const { t } = useTranslation();
  const [selectedFolderId, setSelectedFolderId] = useState<string>('');

  const handleFolderSelected = (folderId: string) => {
    setSelectedFolderId(folderId);
  };

  return (
    <Modal isOpen={isOpen} onModalClose={onCancel} id={id} size="md">
      <Modal.Header onModalClose={onCancel}>
        {t('attachments.add.to.folder')}
      </Modal.Header>
      <Modal.Body>
        <WorkspaceFoldersTree onFolderSelected={handleFolderSelected} />
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
          disabled={!selectedFolderId} // TODO accessibility not working
        >
          {t('add')}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
