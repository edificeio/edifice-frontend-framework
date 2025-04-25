import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, FormControl } from '../../../../components';
import { useWorkspaceFolders } from '../../../../hooks';
import { IconSave } from '../../../icons/components';
import { WorkspaceElement } from '@edifice.io/client';

type Props = {
  /**
   * Function called when the modal is closed
   */
  onClose: () => void;
  /**
   * Parent folder ID where the new folder will be created
   */
  folderParentId: string;
  /**
   * Function called when the new folder is created
   */
  onFolderCreated: (folderId: string) => void;
};

export default function NewFolderForm({
  onClose,
  folderParentId,
  onFolderCreated,
}: Props) {
  const { t } = useTranslation();
  const refInputName = useRef<HTMLInputElement>(null);
  const { createFolderMutation } = useWorkspaceFolders();

  useEffect(() => {
    if (refInputName.current) {
      refInputName.current.focus();
    }
  }, []);

  const handleCreateFolder = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();
    const folderName = refInputName.current?.value;
    if (!folderName) return;

    createFolderMutation.mutate(
      { folderName, folderParentId },
      {
        onSuccess: (newFolder: WorkspaceElement) => {
          if (newFolder._id) {
            onFolderCreated(newFolder._id);
          }
          onClose();
        },
      },
    );
  };

  return (
    <form id="modalWorkspaceNewFolderForm" onSubmit={handleCreateFolder}>
      <div className="d-flex gap-4 flex-row">
        <FormControl id="modalWorkspaceNewFolderForm" isRequired={true}>
          <FormControl.Input
            ref={refInputName}
            size="md"
            type="text"
            placeholder={t('folder.new.name.label')}
          />
        </FormControl>
        <Button
          type="submit"
          color="primary"
          variant="ghost"
          disabled={createFolderMutation.isPending}
          isLoading={createFolderMutation.isPending}
          leftIcon={<IconSave />}
        />
      </div>
    </form>
  );
}
