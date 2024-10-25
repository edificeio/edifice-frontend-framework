import { FOLDER, IFolder } from "edifice-ts-client";
import { TreeNode } from "../components/TreeView/TreeNode";

export function findNodeById(data: TreeNode, id: string): TreeNode | undefined {
  let res: TreeNode | undefined;
  if (data?.id === id) {
    return data;
  }
  if (data?.children?.length) {
    data?.children?.every((childNode: TreeNode) => {
      res = findNodeById(childNode, id);
      return res === undefined; // break loop if res is found
    });
  }
  return res;
}

export function addNode(
  node: TreeNode,
  { parentId, newFolder }: { parentId: string; newFolder: IFolder },
): TreeNode {
  return modifyNode(node, (node) => {
    if (node.id === parentId) {
      const parentAncestors = [
        ...((node as TreeNodeFolderWrapper).folder?.ancestors || []),
      ];
      const ancestors = arrayUnique([...parentAncestors, node.id]);
      const newNode: TreeNode = {
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
  node: TreeNode,
  { folders }: { folders: string[] },
): TreeNode {
  return modifyNode(node, (node) => {
    if (folders.includes(node.id)) {
      return undefined;
    } else {
      return node;
    }
  });
}

export const findParentNode = (
  parentNode: TreeNode,
  childId: string,
): TreeNode | undefined => {
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

export function getAncestors(data: TreeNode, folderId: string): string[] {
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

export function hasChildren(folderId: string, data: TreeNode): boolean {
  if (data.id === folderId && data.children) {
    return data.children.length > 0;
  }

  if (data.children) {
    return data.children.some((child: TreeNode) => hasChildren(data.id, child));
  }
  return false;
}

export function modifyNode(
  data: TreeNode,
  callback: (node: TreeNode, parent?: TreeNode) => TreeNode | undefined,
): TreeNode {
  // root cannot be undefined
  const root = doModify(data, callback) || data;
  return root;
}

function doModify(
  current: TreeNode,
  callback: (node: TreeNode, parent?: TreeNode) => TreeNode | undefined,
  parent?: TreeNode,
): TreeNode | undefined {
  const result = callback(current, parent);
  if (result?.children?.length) {
    const children: TreeNode[] = [];
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
  node: TreeNode,
  { destinationId, folders }: { destinationId: string; folders: string[] },
): TreeNode {
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
      const newNode: TreeNode = {
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
  treeNode: TreeNode,
  folders: IFolder[] | undefined,
  parentId: string,
) => {
  // const folderIds = folders.map((e) => e.id);
  return modifyNode(treeNode, (node) => {
    // add missing children if needed
    if (node.id === parentId) {
      node.children = folders?.map((e) => new TreeNodeFolderWrapper(e));
    }
    return node;
  });
};

export function updateNode(
  node: TreeNode,
  { folderId, newFolder }: { folderId: string; newFolder: IFolder },
): TreeNode {
  return modifyNode(node, (node) => {
    if (node.id === folderId) {
      return new TreeNodeFolderWrapper(newFolder);
    } else {
      return node;
    }
  });
}

export class TreeNodeFolderWrapper implements TreeNode {
  constructor(public readonly folder: IFolder) {
    this.id = folder.id;
    this.name = folder.name;
    this.childNumber = folder.childNumber;
  }

  public readonly id: string;
  public readonly name: string;
  public readonly childNumber: number;

  public section = false;

  public readonly children: TreeNode[] = [];
}
