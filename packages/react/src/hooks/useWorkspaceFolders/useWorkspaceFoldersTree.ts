import { WorkspaceElement } from '@edifice.io/client';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useEdificeClient } from '../../providers/EdificeClientProvider/EdificeClientProvider.hook';

interface FolderTreeNode {
  id: string;
  name: string;
  children?: FolderTreeNode[];
}

export const WORKSPACE_USER_FOLDER_ID = 'workspace-user-folder-id';
export const WORKSPACE_SHARED_FOLDER_ID = 'workspace-shared-folder-id';

function useWorkspaceFoldersTree(folders?: WorkspaceElement[]) {
  const { t } = useTranslation();
  const { user } = useEdificeClient();

  const [searchQuery, setSearchQuery] = useState('');

  const filtredFoldersTree = useMemo(() => {
    const userTreeLabel = t('workspace.myDocuments');
    const sharedTreeLabel = t('workspace.sharedDocuments');
    const foldersTree = buildTree(
      folders || [],
      userTreeLabel,
      sharedTreeLabel,
    );

    return searchQuery ? filterTree(foldersTree, searchQuery) : foldersTree;
  }, [folders, searchQuery, user]);

  return {
    foldersTree: filtredFoldersTree,
    filterTree: setSearchQuery,
  };
}

export default useWorkspaceFoldersTree;

const buildTree = (
  workspaceData: WorkspaceElement[],
  userTreeLabel: string,
  sharedTreeLabel: string,
) => {
  const nodes = new Map();
  const userTree: FolderTreeNode[] = [];
  const sharedTree: FolderTreeNode[] = [];

  // 1 - list all folders with empty children
  workspaceData.forEach((item) => {
    nodes.set(item._id, {
      id: item._id,
      name: item.name,
      children: [],
    });
  });

  // 2 - assign children to their parents
  workspaceData.forEach((item) => {
    const nodeItem = nodes.get(item._id);

    if (item.eParent && nodes.has(item.eParent)) {
      nodes.get(item.eParent)?.children.push(nodeItem);
    } else if (item.isShared) {
      sharedTree.push(nodeItem);
    } else {
      userTree.push(nodeItem);
    }
  });
  return [
    {
      id: WORKSPACE_USER_FOLDER_ID,
      name: userTreeLabel,
      children: userTree,
    },
    {
      id: WORKSPACE_SHARED_FOLDER_ID,
      name: sharedTreeLabel,
      children: sharedTree,
    },
  ];
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
