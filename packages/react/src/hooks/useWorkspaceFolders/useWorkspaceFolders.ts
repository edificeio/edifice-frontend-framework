import { odeServices } from '@edifice.io/client';
import { useQuery } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

interface FolderTreeNode {
  id: string;
  name: string;
  children?: FolderTreeNode[];
}

function useWorkspaceFolders() {
  const { t } = useTranslation();
  const { data: folderData } = useQuery({
    queryKey: ['workspace-folders'],
    queryFn: () => odeServices.workspace().listFolder('owner', true),
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
    const buildWorkspaceTree = (data: FolderTreeNode[]) => {
      return [
        {
          id: '',
          name: t('workspace.myDocuments'),
          children: data,
        },
      ];
    };

    if (!folderData) return buildWorkspaceTree([]);

    const nodes = new Map();
    const fullTree: FolderTreeNode[] = [];

    // 1 - list all folders with empty children
    folderData.forEach((item) => {
      nodes.set(item._id, { id: item._id, name: item.name, children: [] });
    });

    // 2 - assign children to their parents
    folderData.forEach((item) => {
      if (item.eParent && nodes.has(item.eParent)) {
        nodes.get(item.eParent).children.push(nodes.get(item._id));
      } else {
        fullTree.push(nodes.get(item._id));
      }
    });
    return buildWorkspaceTree(
      searchQuery ? filterTree(fullTree, searchQuery) : fullTree,
    );
  }, [folderData, searchQuery]);

  return { folderTree: userfolders, setSearchQuery };
}

export default useWorkspaceFolders;
