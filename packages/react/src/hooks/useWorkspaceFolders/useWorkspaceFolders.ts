import { odeServices } from '@edifice.io/client';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback, useMemo } from 'react';
import { useEdificeClient } from '../../providers/EdificeClientProvider/EdificeClientProvider.hook';

function useWorkspaceFolders() {
  const queryClient = useQueryClient();
  const { user } = useEdificeClient();

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

  const createFolderMutation = useMutation({
    mutationFn: ({
      folderName,
      folderParentId,
    }: {
      folderName: string;
      folderParentId?: string;
    }) => odeServices.workspace().createFolder(folderName, folderParentId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['workspace', 'folders'],
      });
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
      const hasContribRights = !!userRights?.find((right) => right[contrib]);
      return hasContribRights;
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
