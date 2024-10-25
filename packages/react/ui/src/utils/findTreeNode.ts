import { TreeData } from "../types";

/**
 * Utility function to find a node in a subtree
 * @param root The root node to begin with.
 * @param predicate Function called on the node or its children, recursively.
 *        Must return true when the child node is found.
 * @returns The found child node (may be the root), or undefined
 */
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
