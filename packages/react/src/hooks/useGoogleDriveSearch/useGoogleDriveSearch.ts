import { useCallback, useState } from 'react';

import { GoogleDriveDocument, ID, odeServices } from '@edifice.io/client';
import { useQueryClient } from '@tanstack/react-query';

import { TreeItem } from '../../components/Tree/types';
import { findNodeById, modifyNode } from '../../components/Tree/utilities/tree';

export type GoogleDriveFolderNode = TreeItem & {
  files?: GoogleDriveDocument[];
};

export default function useGoogleDriveSearch(
  rootId: string,
  rootName: string,
  userId?: string,
) {
  /**
   * A Google Drive search maintains a tree of TreeNodes (rendered by `Tree`),
   * starting at its `root`. Each node is a folder, keyed by its Drive `id`
   * (Drive addresses entries by opaque id, not by path, unlike Nextcloud),
   * with its sub-folders as children (also TreeNodes) and an array of
   * contained `files`.
   */
  const [root, setRoot] = useState<GoogleDriveFolderNode>({
    id: rootId,
    name: rootName,
    section: true,
  });

  const updateFolder = useCallback(
    (
      folderId: ID | undefined,
      subfolders: GoogleDriveDocument[],
      files: GoogleDriveDocument[],
    ) => {
      setRoot((prev) => {
        const node = findNodeById(prev, folderId as string) as
          | GoogleDriveFolderNode
          | undefined;
        if (!node) return prev;

        const children = subfolders.map((f) => {
          const existing = node.children?.find((c) => c.id === f.id);
          return existing
            ? { ...existing, name: f.name }
            : { id: f.id, name: f.name };
        });

        return modifyNode(prev, (n) =>
          n.id === node.id ? { ...n, children, files } : n,
        ) as GoogleDriveFolderNode;
      });
    },
    [],
  );

  const queryClient = useQueryClient();

  const [loadError, setLoadError] = useState<unknown>(null);

  const loadContent = useCallback(
    async (folderId?: ID) => {
      if (!userId) return;
      const parentId = folderId === rootId ? undefined : (folderId as string);
      try {
        // Dedupe concurrent requests for the same folder (Tree can fire
        // onTreeItemClick and onTreeItemUnfold for the same node on one click)
        // and cache results so revisiting a folder doesn't reload/flicker.
        const payload = await queryClient.fetchQuery({
          queryKey: ['googledrive', 'documents', userId, parentId ?? 'root'],
          queryFn: () =>
            odeServices.googledrive().listDocuments(userId, parentId),
          staleTime: 60_000,
        });

        const subfolders: GoogleDriveDocument[] = [];
        const files: GoogleDriveDocument[] = [];

        // Skip the queried folder itself, should the backend include it.
        payload
          .filter((doc) => doc.id !== parentId)
          .forEach((doc) => {
            if (doc.isFolder) {
              subfolders.push(doc);
            } else {
              files.push(doc);
            }
          });
        setLoadError(null);
        updateFolder(folderId, subfolders, files);
      } catch (error) {
        setLoadError(error);
      }
    },
    [rootId, userId, queryClient, updateFolder],
  );

  /**
   * Google Drive has no per-user connection handshake today: the backend
   * resolves the user's Drive credentials on its own, so the browser never
   * needs a login step. The auth flags are kept — always resolved, never
   * required — so that adding an OAuth2 flow later only means filling them in
   * here, without touching the component that renders them.
   */
  return {
    root,
    needsAuth: false,
    isCheckingAuth: false,
    isAuthError: false,
    refetchAuthStatus: () => {},
    loadContent,
    loadError,
  } as {
    root: GoogleDriveFolderNode;
    needsAuth: boolean;
    isCheckingAuth: boolean;
    isAuthError: boolean;
    refetchAuthStatus: () => void;
    loadContent: (folderId?: ID) => void;
    loadError: unknown;
  };
}
