import { IUserInfo, odeServices, WorkspaceElement } from '@edifice.io/client';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useEdificeClient } from '../../providers/EdificeClientProvider/EdificeClientProvider.hook';

interface FolderTreeNode {
  id: string;
  name: string;
  children?: FolderTreeNode[];
  canCopyFileInto: boolean;
  disabled?: boolean;
}

export const WORKSPACE_OWNER_FOLDER_ID = 'workspace-owner-folder-id';
export const WORKSPACE_SHARED_FOLDER_ID = 'workspace-shared-folder-id';

function useWorkspaceFolders() {
  const { t } = useTranslation();
  const { user } = useEdificeClient();
  const queryClient = useQueryClient();

  const { data: ownerWorkspaceData = [], isLoading: isLoadingOwner } = useQuery(
    {
      queryKey: ['workspace-folders', 'owner'],
      queryFn: () => odeServices.workspace().listOwnerFolders(true),
    },
  );
  const { data: sharedWorkspaceData = [], isLoading: isLoadingShared } =
    useQuery({
      queryKey: ['workspace-folders', 'shared'],
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
        queryKey: ['workspace-folders'],
      });
      console.log('Folder created successfully');
    },
    onError: (error) => {
      console.error('Error creating folder:', error);
    },
  });

  const [searchQuery, setSearchQuery] = useState('');

  const userfolders = useMemo(() => {
    const buildWorkspaceTree = (
      ownerTree: FolderTreeNode[],
      sharedTree: FolderTreeNode[],
    ) => {
      return [
        {
          id: WORKSPACE_OWNER_FOLDER_ID,
          name: t('workspace.myDocuments'),
          children: ownerTree,
          canCopyFileInto: true,
        },
        {
          id: WORKSPACE_SHARED_FOLDER_ID,
          name: t('workspace.sharedDocuments'),
          children: sharedTree,
          canCopyFileInto: false,
          disabled: true,
        },
      ];
    };

    const ownerFolders = buildTree(ownerWorkspaceData, user);
    const sharedFolders = buildTree(sharedWorkspaceData, user);

    return buildWorkspaceTree(
      searchQuery ? filterTree(ownerFolders, searchQuery) : ownerFolders,
      searchQuery ? filterTree(sharedFolders, searchQuery) : sharedFolders,
    );
  }, [ownerWorkspaceData, sharedWorkspaceData, searchQuery, user]);

  return {
    folderTree: userfolders,
    setSearchQuery,
    user,
    createFolderMutation,
    isLoading: isLoadingOwner && isLoadingShared,
  };
}

const buildTree = (workspaceData: WorkspaceElement[], user?: IUserInfo) => {
  const nodes = new Map();
  const fullTree: FolderTreeNode[] = [];

  // 1 - list all folders with empty children
  workspaceData.forEach((item) => {
    const canCopyFileInto =
      user && canWriteOnFolder(item, user.userId, user.groupsIds);
    nodes.set(item._id, {
      id: item._id,
      name: item.name,
      children: [],
      canCopyFileInto,
    });
  });

  // 2 - assign children to their parents
  workspaceData.forEach((item) => {
    const nodeItem = nodes.get(item._id);
    if (!nodeItem.canCopyFileInto) return;

    if (item.eParent && nodes.has(item.eParent)) {
      nodes.get(item.eParent)?.children.push(nodeItem);
    } else {
      fullTree.push(nodeItem);
    }
  });
  return fullTree;
};

const filterTree = (
  nodes: FolderTreeNode[],
  search: string,
): FolderTreeNode[] => {
  return nodes
    .map((node) => {
      const filteredChildren = node.children
        ? filterTree(node.children, search)
        : [];
      if (
        node.name.toLowerCase().includes(search.toLowerCase()) ||
        filteredChildren.length > 0
      ) {
        return { ...node, children: filteredChildren };
      }
      return null;
    })
    .filter((node) => node !== null);
};

const canWriteOnFolder = (
  folderData: WorkspaceElement,
  userId: string,
  userGroupsIds: string[],
) => {
  if (folderData.owner === userId) return true;

  const userRights = folderData.inheritedShares?.filter(
    (right) => right.userId === userId || userGroupsIds.includes(right.groupId),
  );
  const contrib =
    'org-entcore-workspace-controllers-WorkspaceController|updateDocument';
  const hasContribRights = !!userRights?.find((right) => right[contrib]);
  return hasContribRights;
};
export default useWorkspaceFolders;
