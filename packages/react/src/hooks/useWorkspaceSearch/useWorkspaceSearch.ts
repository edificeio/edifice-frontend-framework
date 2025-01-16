import { useCallback, useReducer } from 'react';

import {
  DocumentHelper,
  ID,
  Role,
  WorkspaceElement,
  WorkspaceSearchFilter,
  odeServices,
} from '@edifice.io/client';

import { findNodeById } from '../../components/TreeView/utilities/treeview';
import { TreeData } from '../../types';
import { useHasWorkflow } from '../useHasWorkflow';

export type FolderNode = TreeData & { files?: WorkspaceElement[] };

export default function useWorkspaceSearch(
  rootId: string,
  rootName: string,
  filter: WorkspaceSearchFilter,
  format: Role | Role[] | null,
) {
  const canListDocs = useHasWorkflow(
    'org.entcore.workspace.controllers.WorkspaceController|listDocuments',
  );
  const canListFolders = useHasWorkflow(
    'org.entcore.workspace.controllers.WorkspaceController|listFolders',
  );

  /**
   * A workspace search maintains a tree of TreeNodes (which can be rendered in a TreeView),
   * starting at its `root`. Each node is a folder, with its sub-folders as children (also Treenodes)
   * and an array of contained `files` (WorkspaceElement[])
   */
  function treeReducer(
    state: FolderNode,
    action: {
      type: 'update';
      folderId?: ID; // Can be undefined to target the root node
      subfolders: WorkspaceElement[];
      files: WorkspaceElement[];
    },
  ) {
    switch (action.type) {
      case 'update': {
        const node = findNodeById(state, action.folderId as string);
        if (node) {
          node.children = action.subfolders.map((f) => ({
            id: f._id || '',
            name: f.name,
          }));
          node.files = action.files;
        }
        return {
          ...state,
        };
      }
      default:
        throw Error('[useWorkspaceSearch] Unknown action type: ' + action.type);
    }
  }

  const [root, dispatch] = useReducer(treeReducer, {
    id: rootId,
    name: rootName,
    section: true,
  });

  const loadContent = useCallback(
    async (folderId?: ID) => {
      if (canListDocs && canListFolders) {
        const realWorkspaceId = folderId === rootId ? '' : folderId;
        // If mocked data is available, use it. Otherwise load from server.
        const payload = await odeServices
          .workspace()
          .listDocuments(filter, realWorkspaceId);

        const subfolders: WorkspaceElement[] = [];
        const files: WorkspaceElement[] = [];

        // Filter out elements of undesired role.
        payload
          .filter((f) => {
            if (!format || f.eType === 'folder') return true;
            const role = DocumentHelper.getRole(f);
            if (typeof format === 'string') return format === role;
            if (Array.isArray(format))
              return format.findIndex((format) => format === role) >= 0;
            return false; // should not happen
          })
          .forEach((doc) => {
            if (doc.eType === 'folder') {
              subfolders.push(doc);
            } else {
              files.push(doc);
            }
          });
        dispatch({ folderId, subfolders, files, type: 'update' });
      }
    },
    [canListDocs, canListFolders, rootId, filter, format],
  );

  return { root, loadContent } as {
    root: FolderNode;
    loadContent: (folderId?: ID) => void;
  };
}
