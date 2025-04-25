import { odeServices, WorkspaceElement } from '@edifice.io/client';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback, useMemo } from 'react';
import { useEdificeClient } from '../../providers/EdificeClientProvider/EdificeClientProvider.hook';
import { useToast } from '../useToast';
import { useTranslation } from 'react-i18next';

function useWorkspaceFolders() {
  const queryClient = useQueryClient();
  const { user } = useEdificeClient();
  const toast = useToast();
  const { t } = useTranslation();

  const { data: ownerWorkspaceData = [], isLoading: isLoadingOwner } = useQuery(
    {
      queryKey: ['workspace', 'folders', 'owner'],
      queryFn: () => odeServices.workspace().listOwnerFolders(true),
    },
  );
  const { data: sharedWorkspaceData = [], isLoading: isLoadingShared } =
    useQuery({
      queryKey: ['workspace', 'folders', 'shared'],
      queryFn: () => odeServices.workspace().listSharedFolders(true),
    });

  interface CreateFolderParams {
    folderName: string;
    folderParentId?: string;
  }
  const createFolderMutation = useMutation({
    mutationFn: ({ folderName, folderParentId }: CreateFolderParams) =>
      odeServices.workspace().createFolder(folderName, folderParentId),

    onSuccess: (newFolder) => {
      const queryKey = [
        'workspace',
        'folders',
        newFolder.isShared ? 'shared' : 'owner',
      ];
      queryClient.setQueryData(queryKey, (oldFolders: WorkspaceElement[]) => [
        ...oldFolders,
        newFolder,
      ]);
    },
    onError: () => {
      toast.error(t('e400'));
    },
  });

  const folders = useMemo(() => {
    return [...ownerWorkspaceData, ...sharedWorkspaceData];
  }, [ownerWorkspaceData, sharedWorkspaceData]);

  const canCopyFileIntoFolder = useCallback(
    (folderId: string) => {
      const folder = folders.find((folder) => folder._id === folderId);
      if (!folder || !user) return false;
      const userId = user.userId;

      if (folder.owner === userId) return true;

      const userRights = folder.inheritedShares?.filter(
        (right) =>
          right.userId === userId || user.groupsIds.includes(right.groupId),
      );
      const contrib =
        'org-entcore-workspace-controllers-WorkspaceController|updateDocument';
      return !!userRights?.find((right) => right[contrib]);
    },
    [folders, user],
  );

  return {
    folders,
    createFolderMutation,
    canCopyFileIntoFolder,
    isLoading: isLoadingOwner || isLoadingShared,
  };
}

export default useWorkspaceFolders;
