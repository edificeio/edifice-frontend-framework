import { Button, Modal } from '../../..';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { toast } from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { WorkspaceFolders } from '../../../modules/multimedia';
import { Attachment } from '../models/attachment';

interface AddAttachmentToWorkspaceModalProps {
  attachments: Attachment[];
  onModalClose: () => void;
  isOpen?: boolean;
  onCopyToWorkspace: (
    attachments: Attachment[],
    folderId: string,
  ) => Promise<boolean>;
}
export function AddAttachmentToWorkspaceModal({
  attachments,
  isOpen = false,
  onModalClose,
  onCopyToWorkspace,
}: AddAttachmentToWorkspaceModalProps) {
  const { t } = useTranslation();
  const [selectedFolderIdToCopyFile, setSelectedFolderIdToCopyFile] = useState<
    string | undefined
  >(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [disabled, setDisabled] = useState(false);

  const handleFolderSelected = (folderId: string, canCopyFileInto: boolean) => {
    setSelectedFolderIdToCopyFile(canCopyFileInto ? folderId : undefined);
  };

  const handleAddAttachmentToWorkspace = async () => {
    if (selectedFolderIdToCopyFile === undefined) return;
    setIsLoading(true);

    const isSuccess = await onCopyToWorkspace(
      attachments,
      selectedFolderIdToCopyFile,
    );

    if (isSuccess) {
      onModalClose();
    } else {
      toast.error(t('attachments.add.to.folder.modal.error'));
    }

    setIsLoading(false);
  };

  useEffect(() => {
    setDisabled(selectedFolderIdToCopyFile === undefined);
  }, [selectedFolderIdToCopyFile]);

  return createPortal(
    <Modal
      isOpen={isOpen}
      onModalClose={onModalClose}
      id={'add-attachment-to-workspace-modal'}
      size="md"
    >
      <Modal.Header onModalClose={onModalClose}>
        {t('attachments.add.to.folder.modal.title')}
      </Modal.Header>
      <Modal.Body>
        <div className="d-flex flex-column gap-12">
          <p>
            {t('attachments.add.to.folder.modal.description', {
              count: attachments.length,
            })}
          </p>

          <WorkspaceFolders onFolderSelected={handleFolderSelected} />
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button
          type="button"
          color="tertiary"
          variant="ghost"
          onClick={onModalClose}
        >
          {t('attachments.add.to.folder.modal.cancel')}
        </Button>
        <Button
          color="primary"
          variant="filled"
          onClick={handleAddAttachmentToWorkspace}
          disabled={isLoading || disabled}
          isLoading={isLoading}
        >
          {t('attachments.add.to.folder.modal.add')}
        </Button>
      </Modal.Footer>
    </Modal>,
    document.getElementById('portal') as HTMLElement,
  );
}
