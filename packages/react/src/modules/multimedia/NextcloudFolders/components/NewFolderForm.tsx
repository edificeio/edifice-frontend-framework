import { FormEvent, useEffect, useRef } from 'react';

import { odeServices } from '@edifice.io/client';
import { useMutation } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import { FormControl, IconButton } from '../../../../components';
import { useToast, useUser } from '../../../../hooks';
import { IconSave } from '../../../icons/components';

type Props = {
  /**
   * Path of the folder in which the new folder is created
   */
  parentPath: string;
  /**
   * Function called when the form is closed
   */
  onClose: () => void;
  /**
   * Function called with the path of the created folder
   */
  onFolderCreated: (path: string) => void;
};

export default function NewFolderForm({
  parentPath,
  onClose,
  onFolderCreated,
}: Props) {
  const { t } = useTranslation();
  const { user } = useUser();
  const toast = useToast();
  const refInputName = useRef<HTMLInputElement>(null);
  const createFolderMutation = useMutation({
    mutationFn: ({ userId, path }: { userId: string; path: string }) =>
      odeServices.nextcloud().createFolder(userId, path),
  });

  useEffect(() => {
    refInputName.current?.focus();
  }, []);

  const handleCreateFolder = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // The name is a segment of a Nextcloud path: no separator, nor a relative segment.
    const folderName = refInputName.current?.value
      .trim()
      .replace(/[/\\]/g, '-');
    if (!folderName || folderName === '.' || folderName === '..' || !user) {
      return;
    }

    const path = `${parentPath.replace(/\/?$/, '/')}${folderName}/`;
    createFolderMutation.mutate(
      { userId: user.userId, path },
      {
        onSuccess: () => {
          onFolderCreated(path);
          onClose();
        },
        onError: () => toast.error(t('e400')),
      },
    );
  };

  return (
    <form id="modalNextcloudNewFolderForm" onSubmit={handleCreateFolder}>
      <div className="d-flex gap-4 flex-row">
        <FormControl id="modalNextcloudNewFolderForm" isRequired={true}>
          <FormControl.Input
            ref={refInputName}
            size="md"
            type="text"
            placeholder={t('workspace.folder.new.placeholder')}
            aria-label={t('workspace.folder.new.placeholder')}
          />
        </FormControl>
        <IconButton
          type="submit"
          color="primary"
          variant="ghost"
          title={t('workspace.folder.new.create')}
          disabled={createFolderMutation.isPending}
          isLoading={createFolderMutation.isPending}
          icon={<IconSave />}
        />
      </div>
    </form>
  );
}
