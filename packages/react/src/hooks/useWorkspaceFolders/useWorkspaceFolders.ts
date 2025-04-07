import { odeServices } from '@edifice.io/client';
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
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

  const myFolderId = '';
  const userfolders = useMemo(() => {
    const buildWorkspaceTree = (data: FolderTreeNode[]) => {
      return [
        {
          id: myFolderId,
          name: t('workspace.myDocuments'),
          children: data,
        },
      ];
    };

    if (!folderData) return buildWorkspaceTree([]);

    const nodes = new Map();
    const tree: FolderTreeNode[] = [];

    // 1 - list all folders with empty children
    folderData.forEach((item) => {
      nodes.set(item._id, { id: item._id, name: item.name, children: [] });
    });

    // 2 - assign children to their parents
    folderData.forEach((item) => {
      if (item.eParent && nodes.has(item.eParent)) {
        nodes.get(item.eParent).children.push(nodes.get(item._id));
      } else {
        tree.push(nodes.get(item._id));
      }
    });
    return buildWorkspaceTree(tree);
  }, [folderData]);

  return { folderTree: userfolders };
}

export default useWorkspaceFolders;
