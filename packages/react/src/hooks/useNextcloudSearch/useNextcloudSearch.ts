import { useCallback, useReducer } from 'react';

import { ID, NextcloudDocument, odeServices } from '@edifice.io/client';
import { useQueryClient } from '@tanstack/react-query';

import { findNodeById } from '../../components/TreeView/utilities/treeview';
import { TreeData } from '../../types';

export type NextcloudFolderNode = TreeData & { files?: NextcloudDocument[] };

export default function useNextcloudSearch(
  rootId: string,
  rootName: string,
  userId?: string,
) {
  /**
   * A nextcloud search maintains a tree of TreeNodes (which can be rendered in a TreeView),
   * starting at its `root`. Each node is a folder, keyed by its Nextcloud `path`,
   * with its sub-folders as children (also TreeNodes) and an array of contained `files`.
   */
  function treeReducer(
    state: NextcloudFolderNode,
    action: {
      type: 'update';
      folderId?: ID; // Can be undefined to target the root node
      subfolders: NextcloudDocument[];
      files: NextcloudDocument[];
    },
  ) {
    switch (action.type) {
      case 'update': {
        const node = findNodeById(state, action.folderId as string);
        if (node) {
          node.children = action.subfolders.map((f) => ({
            id: f.path,
            name: f.name,
          }));
          node.files = action.files;
        }
        return {
          ...state,
        };
      }
      default:
        throw Error('[useNextcloudSearch] Unknown action type: ' + action.type);
    }
  }

  const [root, dispatch] = useReducer(treeReducer, {
    id: rootId,
    name: rootName,
    section: true,
  });

  const queryClient = useQueryClient();

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
      dispatch({ folderId, subfolders, files, type: 'update' });
    },
    [rootId, userId, queryClient],
  );

  return { root, loadContent } as {
    root: NextcloudFolderNode;
    loadContent: (folderId?: ID) => void;
  };
}
