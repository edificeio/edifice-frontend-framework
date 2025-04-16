import { useTranslation } from 'react-i18next';
import { Button, FormControl, Modal } from '../../../../components';
import { useEffect, useRef } from 'react';
import { IconTextPage } from '../../../icons/components';
import { useWorkspaceFolders } from '../../../../hooks';

type Props = {
  /**
   * Function called when the modal is closed
   */
  onClose: () => void;
  /**
   * Function called when the modal is opened
   */
  isOpen: boolean;
  /**
   * Parent folder ID where the new folder will be created
   */
  folderParentId?: string;
};

export default function NewFolderModal({
  onClose,
  isOpen,
  folderParentId,
}: Props) {
  const { t } = useTranslation();
  const refInputName = useRef<HTMLInputElement>(null);
  const { createFolder } = useWorkspaceFolders();

  useEffect(() => {
    if (refInputName.current) {
      refInputName.current.focus();
    }
  }, []);

  const handleCreateFolder = async () => {
    const folderName = refInputName.current?.value; // Récupérer la valeur de l'input
    if (!folderName) return;
    console.log('folderName:', folderName);

    await createFolder(folderName, folderParentId);
    onClose();
  };
  return (
    <Modal
      id="new-folder-modal"
      isOpen={isOpen}
      onModalClose={onClose}
      scrollable
      size="lg"
    >
      <Modal.Header onModalClose={onClose}>{t('new.folder')}</Modal.Header>
      <Modal.Body>
        <FormControl
          id="modalWorkspaceNewFolderForm"
          isRequired={true}
          onSubmit={handleCreateFolder}
        >
          <FormControl.Label>
            <IconTextPage width={18} />
            {t('folder.new.name.label')}
          </FormControl.Label>
          <FormControl.Input ref={refInputName} size="md" type="text" />
        </FormControl>
      </Modal.Body>
      <Modal.Footer>
        <Button
          color="tertiary"
          onClick={onClose}
          type="button"
          variant="ghost"
        >
          {t('cancel')}
        </Button>
        <Button type="button" color="secondary" onClick={handleCreateFolder}>
          {t('workspace.folder.create')}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
