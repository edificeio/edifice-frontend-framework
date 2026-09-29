import {
  GoogleDriveCopyError,
  GoogleDriveDocument,
  Role,
  WorkspaceElement,
  odeServices,
} from '@edifice.io/client';
import { useTranslation } from 'react-i18next';

import { useToast } from '../../../../hooks/useToast';
import { useUser } from '../../../../hooks/useUser';
import { GoogleDrive as Component } from '../../GoogleDrive';
import { useMediaLibraryContext } from '../MediaLibraryContext';

export const GoogleDrive = () => {
  const {
    appCode,
    visibility,
    type,
    setResultCounter,
    setResult,
    setPreSuccess,
    multiple,
  } = useMediaLibraryContext();
  const { user } = useUser();
  const { t } = useTranslation();
  const toast = useToast();

  function getDocumentRoleFilter(): Role | Role[] | null {
    switch (type) {
      case 'image':
        return 'img';
      case 'audio':
        return 'audio';
      case 'video':
        return 'video';
      default:
        return null; // = all document roles
    }
  }

  async function copyToWorkspace(
    userId: string,
    ids: string[],
  ): Promise<WorkspaceElement[]> {
    try {
      return await odeServices.googledrive().copyDocumentToWorkspace(
        userId,
        ids,
        undefined,
        // Copy the documents straight to their final place, the way an upload
        // does, instead of leaving a copy in the user's own documents for the
        // modal to transfer afterwards.
        { application: appCode, visibility },
      );
    } catch (error) {
      // Google Drive reports a status per document, so a copy can partially
      // fail. Keep the documents that made it and warn about the others;
      // a total failure is left to the modal's generic error handling.
      if (error instanceof GoogleDriveCopyError && error.copied.length > 0) {
        toast.warning(t('google-drive.transfer.error'));
        return error.copied;
      }
      throw error;
    }
  }

  function handleSelect(result: GoogleDriveDocument[]) {
    setResultCounter(result.length);
    if (result.length) {
      // Placeholder to enable the Add button; the actual copy to workspace
      // happens in the preSuccess action below, whose result is used instead.
      setResult(result);
      setPreSuccess(
        () => (): Promise<WorkspaceElement[]> =>
          user?.userId
            ? copyToWorkspace(
                user.userId,
                result.map((doc) => doc.id),
              )
            : Promise.resolve([]),
      );
    } else {
      setResult();
      setPreSuccess(undefined);
    }
  }

  return (
    <Component
      roles={getDocumentRoleFilter()}
      onSelect={handleSelect}
      multiple={multiple}
      className="border rounded overflow-y-auto"
    />
  );
};
