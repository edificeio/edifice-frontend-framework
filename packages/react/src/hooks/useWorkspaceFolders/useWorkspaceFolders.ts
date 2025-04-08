import { odeServices, WorkspaceElement } from '@edifice.io/client';
import { useQuery } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

interface FolderTreeNode {
  id: string;
  name: string;
  children?: FolderTreeNode[];
}

const WORKSPACE_OWNER_FOLDER_ID = 'workspace-owner-folder-id';
export const WORKSPACE_SHARED_FOLDER_ID = 'workspace-shared-folder-id';

function useWorkspaceFolders() {
  const { t } = useTranslation();

  const { data: ownerWorkspaceData = [] } = useQuery({
    queryKey: ['workspace-owner-folders'],
    queryFn: () => odeServices.workspace().listOwnerFolders(true),
  });
  const { data: sharedWorkspaceData = [] } = useQuery({
    queryKey: ['workspace-shared-folders'],
    queryFn: () => odeServices.workspace().listSharedFolders(true),
  });

  const [searchQuery, setSearchQuery] = useState('');

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
        },
        {
          id: WORKSPACE_SHARED_FOLDER_ID,
          name: t('workspace.sharedDocuments'),
          children: sharedTree,
        },
      ];
    };

    const ownerFolders = buildTree(ownerWorkspaceData);
    const sharedFolders = buildTree(sharedWorkspaceData);

    return buildWorkspaceTree(
      searchQuery ? filterTree(ownerFolders, searchQuery) : ownerFolders,
      searchQuery ? filterTree(sharedFolders, searchQuery) : sharedFolders,
    );
  }, [ownerWorkspaceData, sharedWorkspaceData, searchQuery]);

  return { folderTree: userfolders, setSearchQuery };
}

const buildTree = (workspaceData: WorkspaceElement[]) => {
  const nodes = new Map();
  const fullTree: FolderTreeNode[] = [];

  // 1 - list all folders with empty children
  workspaceData.forEach((item) => {
    nodes.set(item._id, { id: item._id, name: item.name, children: [] });
  });

  // 2 - assign children to their parents
  workspaceData.forEach((item) => {
    if (item.eParent && nodes.has(item.eParent)) {
      nodes.get(item.eParent).children.push(nodes.get(item._id));
    } else {
      fullTree.push(nodes.get(item._id));
    }
  });
  return fullTree;
};

export default useWorkspaceFolders;
