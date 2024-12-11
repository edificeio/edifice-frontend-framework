import { FOLDER, IFolder } from '@edifice.io/client';
import { TreeData } from '../../../types';

export function findTreeNode(
  root: TreeData,
  predicate: (node: TreeData) => boolean,
): TreeData | undefined {
  if (predicate(root)) return root;

  if (Array.isArray(root.children)) {
    for (const child of root.children) {
      const found = findTreeNode(child, predicate);
      if (found) return found;
    }
  }
}

export function findNodeById(
  data: TreeData | TreeData[],
  id: string,
): TreeData | undefined {
  if (Array.isArray(data)) {
    for (const node of data) {
      const result = findNodeById(node, id);
      if (result) {
        return result;
      }
    }
  } else {
    if (data.id === id) return data;

    if (data.children) {
      for (const child of data.children) {
        const result = findNodeById(child, id);
        if (result) {
          return result;
        }
      }
    }
  }
  return undefined;
}

export function addNode(
  node: TreeData,
  { parentId, newFolder }: { parentId: string; newFolder: IFolder },
): TreeData {
  return modifyNode(node, (node) => {
    if (node.id === parentId) {
      const parentAncestors = [
        ...((node as TreeNodeFolderWrapper).folder?.ancestors || []),
      ];
      const ancestors = arrayUnique([...parentAncestors, node.id]);
      const newNode: TreeData = {
        ...node,
        children: [
          ...(node.children || []),
          new TreeNodeFolderWrapper({ ...newFolder, ancestors }),
        ],
      };
      return newNode;
    } else {
      return node;
    }
  });
}

export function arrayUnique<T>(array: T[]): T[] {
  return array.filter((item, index) => array.indexOf(item) === index);
}

export function deleteNode(
  node: TreeData,
  { folders }: { folders: string[] },
): TreeData {
  return modifyNode(node, (node) => {
    if (folders.includes(node.id)) {
      return undefined;
    } else {
      return node;
    }
  });
}

export const findParentNode = (
  parentNode: TreeData,
  childId: string,
): TreeData | undefined => {
  if (parentNode.children) {
    for (const child of parentNode.children) {
      if (child.id === childId) {
        return parentNode;
      }
      const foundNode = findParentNode(child, childId);
      if (foundNode) {
        return foundNode;
      }
    }
  }
  return undefined;
};

export function getAncestors(data: TreeData, folderId: string): string[] {
  const findItem = findNodeById(data, folderId);
  if (findItem?.folder?.ancestors) {
    const nodes = findItem?.folder.ancestors || [];
    return [...nodes, folderId];
  } else if (folderId === FOLDER.BIN) {
    return [FOLDER.BIN];
  } else {
    return [FOLDER.DEFAULT];
  }
}

export function hasChildren(folderId: string, data: TreeData): boolean {
  if (data.id === folderId && data.children) {
    return data.children.length > 0;
  }

  if (data.children) {
    return data.children.some((child: TreeData) => hasChildren(data.id, child));
  }
  return false;
}

export function modifyNode(
  data: TreeData,
  callback: (node: TreeData, parent?: TreeData) => TreeData | undefined,
): TreeData {
  // root cannot be undefined
  const root = doModify(data, callback) || data;
  return root;
}

function doModify(
  current: TreeData,
  callback: (node: TreeData, parent?: TreeData) => TreeData | undefined,
  parent?: TreeData,
): TreeData | undefined {
  const result = callback(current, parent);
  if (result?.children?.length) {
    const children: TreeData[] = [];
    for (const child of result?.children || []) {
      const res = doModify(child, callback, result);
      if (res) {
        children.push(res);
      }
    }
    return { ...result!, children };
  }
  return result;
}

export function moveNode(
  node: TreeData,
  { destinationId, folders }: { destinationId: string; folders: string[] },
): TreeData {
  return modifyNode(node, (node, parent) => {
    if (destinationId === node.id) {
      const parentAncestors = [
        ...((node as TreeNodeFolderWrapper).folder?.ancestors || []),
      ];
      const ancestors = arrayUnique([...parentAncestors, node.id]);
      // add to new position
      const newChildren = [...(node.children || [])];
      const childrenIds = node.children?.map((child) => child.id) || [];
      for (const folder of folders) {
        // if not in children yet => move on it
        if (!childrenIds.includes(folder)) {
          const item = findNodeById(node, folder);

          item &&
            newChildren.push({
              ...item,
              folder: {
                ...item?.folder,
                ancestors,
              },
            });
        }
      }
      const newNode: TreeData = {
        ...node,
        children: newChildren,
      };

      return newNode;
    } else if (folders.includes(node.id) && destinationId !== parent?.id) {
      // delete from original position
      return undefined;
    } else {
      return node;
    }
  });
}

export const wrapTreeNode = (
  node: TreeData,
  folders: IFolder[] | undefined,
  parentId: string,
) => {
  // const folderIds = folders.map((e) => e.id);
  return modifyNode(node, (node) => {
    // add missing children if needed
    if (node.id === parentId) {
      node.children = folders?.map((e) => new TreeNodeFolderWrapper(e));
    }
    return node;
  });
};

export function updateNode(
  node: TreeData,
  { folderId, newFolder }: { folderId: string; newFolder: IFolder },
): TreeData {
  return modifyNode(node, (node) => {
    if (node.id === folderId) {
      return new TreeNodeFolderWrapper(newFolder);
    } else {
      return node;
    }
  });
}

export function findPathById(
  tree: TreeData | TreeData[],
  nodeId: string,
): string[] {
  let path: string[] = [];

  function traverse(node: TreeData, currentPath: string[]): boolean {
    if (node.id === nodeId) {
      path = currentPath.concat(node.id);
      return true;
    }
    if (node.children) {
      for (const child of node.children) {
        if (traverse(child, currentPath.concat(node.id))) {
          return true;
        }
      }
    }
    return false;
  }

  function startTraverse(nodes: TreeData | TreeData[]) {
    if (Array.isArray(nodes)) {
      for (const node of nodes) {
        if (traverse(node, [])) {
          break;
        }
      }
    } else {
      traverse(nodes, []);
    }
  }

  startTraverse(tree);
  return path;
}

export class TreeNodeFolderWrapper implements TreeData {
  constructor(public readonly folder: IFolder) {
    this.id = folder.id;
    this.name = folder.name;
    this.childNumber = folder.childNumber;
  }

  public readonly id: string;
  public readonly name: string;
  public readonly childNumber: number;

  public section = false;

  public readonly children: TreeData[] = [];
}
