import { useCallback, useState } from 'react';

import { ID, NextcloudDocument, odeServices } from '@edifice.io/client';
import { useQuery, useQueryClient } from '@tanstack/react-query';

import { findNodeById, modifyNode } from '../../components/Tree/utilities/tree';
import { TreeItem } from '../../components/Tree/types';

export type NextcloudFolderNode = TreeItem & { files?: NextcloudDocument[] };

export default function useNextcloudSearch(
  rootId: string,
  rootName: string,
  userId?: string,
) {
  /**
   * A nextcloud search maintains a tree of TreeNodes (rendered by `Tree`),
   * starting at its `root`. Each node is a folder, keyed by its Nextcloud `path`,
   * with its sub-folders as children (also TreeNodes) and an array of contained `files`.
   */
  const [root, setRoot] = useState<NextcloudFolderNode>({
    id: rootId,
    name: rootName,
    section: true,
  });

  const updateFolder = useCallback(
    (
      folderId: ID | undefined,
      subfolders: NextcloudDocument[],
      files: NextcloudDocument[],
    ) => {
      setRoot((prev) => {
        const node = findNodeById(prev, folderId as string) as
          | NextcloudFolderNode
          | undefined;
        if (!node) return prev;

        const children = subfolders.map((f) => {
          const existing = node.children?.find((c) => c.id === f.path);
          return existing
            ? { ...existing, name: f.name }
            : { id: f.path, name: f.name };
        });

        return modifyNode(prev, (n) =>
          n.id === node.id ? { ...n, children, files } : n,
        ) as NextcloudFolderNode;
      });
    },
    [],
  );

  const queryClient = useQueryClient();

  const oauth2StatusQuery = useQuery({
    queryKey: ['nextcloud', 'oauth2-status', userId],
    queryFn: () => odeServices.nextcloud().getOauth2Status(userId as string),
    enabled: !!userId,
  });

  const needsAuth = !oauth2StatusQuery.data?.connected;

  const loadContent = useCallback(
    async (folderId?: ID) => {
      if (!userId) return;
      const path = folderId === rootId ? undefined : (folderId as string);
      // Dedupe concurrent requests for the same folder (TreeView can fire
      // onTreeItemClick and onTreeItemUnfold for the same node on one click)
      // and cache results so revisiting a folder doesn't reload/flicker.
      const payload = await queryClient.fetchQuery({
        queryKey: ['nextcloud', 'documents', userId, path ?? '/'],
        queryFn: () => odeServices.nextcloud().listDocuments(userId, path),
        staleTime: 60_000,
      });

      const subfolders: NextcloudDocument[] = [];
      const files: NextcloudDocument[] = [];

      // The backend includes the queried folder itself in the payload; skip it.
      const currentPath = path ?? '/';
      payload
        .filter((doc) => doc.path !== currentPath)
        .forEach((doc) => {
          if (doc.isFolder) {
            subfolders.push(doc);
          } else {
            files.push(doc);
          }
        });
      updateFolder(folderId, subfolders, files);
    },
    [rootId, userId, queryClient, updateFolder],
  );

  return {
    root,
    needsAuth,
    isCheckingAuth: oauth2StatusQuery.isLoading,
    refetchAuthStatus: oauth2StatusQuery.refetch,
    loadContent,
  } as {
    root: NextcloudFolderNode;
    needsAuth: boolean;
    isCheckingAuth: boolean;
    refetchAuthStatus: () => void;
    loadContent: (folderId?: ID) => void;
  };
}
