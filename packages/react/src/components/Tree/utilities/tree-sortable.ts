import { Active, Over, UniqueIdentifier } from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { FlattendedNodes, FlattenedItem, Projected, TreeItem } from '../types';

export function getDragDepth(offset: number, indentationWidth: number) {
  return Math.round(offset / indentationWidth);
}

function getSubtreeIndices(
  flattenedTree: FlattenedItem[],
  activeIndex: number,
) {
  const indices = [activeIndex];
  const nodeIds = [flattenedTree[activeIndex].id];

  for (let i = activeIndex + 1; i < flattenedTree.length; i++) {
    const item = flattenedTree[i];
    if (item.parentId) {
      if (nodeIds.includes(item.parentId)) {
        indices.push(i);
        nodeIds.push(item.id);
      }
    }
  }

  return indices;
}

export function determineNewParentId(
  active: Active,
  over: Over | null,
  activeNode: FlattenedItem,
  overNode: FlattenedItem | null,
  projected: Projected,
): string | null | undefined {
  if (projected && (projected.depth === 0 || projected.depth === 1)) {
    return projected.parentId;
  } else if (active.id !== over?.id && overNode) {
    return overNode.parentId === activeNode.parentId
      ? activeNode.parentId
      : overNode.parentId;
  }
  return undefined;
}

export function getActiveAndOverNodes(
  tree: FlattenedItem[],
  activeId: UniqueIdentifier,
  overId?: UniqueIdentifier | undefined,
) {
  const activeNodeIndex = tree.findIndex(({ id }) => id === activeId);
  const overNodeIndex = overId ? tree.findIndex(({ id }) => id === overId) : -1;
  const activeNode = tree[activeNodeIndex];
  const overNode = overNodeIndex !== -1 ? tree[overNodeIndex] : null;

  return { activeNode, activeNodeIndex, overNode, overNodeIndex };
}

export function getIndicesToUpdate(
  activeNode: FlattenedItem,
  activeNodeIndex: number,
  flattenedTree: FlattenedItem[],
  projected: Projected,
): number[] {
  if (
    activeNode.children &&
    activeNode.children.length > 0 &&
    projected?.depth === 1
  ) {
    return getSubtreeIndices(flattenedTree, activeNodeIndex);
  } else {
    return [activeNodeIndex];
  }
}

export function flattenTree(
  tree: TreeItem[],
  parentId: string | null,
  depth = 0,
): FlattenedItem[] {
  return tree.reduce((acc, node) => {
    acc.push({
      ...node,
      id: node.id,
      name: node.name,
      parentId: parentId ?? null,
      position: node.position ?? undefined,
      depth: depth ?? 0,
      children: node.children,
    });

    if (node.children && node.children.length > 0) {
      acc = acc.concat(flattenTree(node.children, node.id, depth + 1));
    }

    return acc;
  }, [] as FlattenedItem[]);
}

export function flattenNodes(
  nodes: TreeItem[],
  expandedNodes: Set<string>,
): FlattendedNodes[] {
  const flatten = (
    nodes: TreeItem[],
    isChild = false,
    parentExpanded = true,
  ): FlattendedNodes[] => {
    return nodes.reduce<FlattendedNodes[]>((acc, node) => {
      const isExpanded =
        expandedNodes.has(node.id) && node.children && node.children.length > 0;
      acc.push({
        ...node,
        id: node.id,
        name: node.name,
        isChild,
        haveChilds: !!node.children?.length,
        expandNode: isExpanded ?? false,
        parentExpanded,
      });
      if (node.children && isExpanded) {
        acc = acc.concat(flatten(node.children, true, isExpanded));
      }
      return acc;
    }, []);
  };
  return flatten(nodes);
}

export function updateParentIds(
  flattenedTree: any[],
  indices: number[],
  newParentId: string | null | undefined,
) {
  indices.forEach((index) => {
    flattenedTree[index] = {
      ...flattenedTree[index],
      parentId: newParentId,
    };
  });
}

export function findItemIndexInTree(
  tree: any[],
  itemId: string,
): number | null {
  for (let i = 0; i < tree.length; i++) {
    const node = tree[i];
    if (node.id === itemId) {
      return i;
    }
    if (node.children && node.children.length > 0) {
      const result = findItemIndexInTree(node.children, itemId);
      if (result) {
        return result;
      }
    }
  }
  return 0;
}

export function generateUpdateData(
  updatedFlattenedTree: FlattenedItem[],
  tree: TreeItem[],
) {
  const updateArray: { _id: string; position: number; parentId?: string }[] =
    [];
  let positionCounter = 0;

  // Créer une map pour accéder rapidement aux éléments du flattenedTree
  const itemMap = new Map<string, FlattenedItem>();
  updatedFlattenedTree.forEach((item) => {
    itemMap.set(item.id, item);
  });

  // Fonction récursive pour parcourir l'arbre et assigner les positions
  function traverse(items: TreeItem[], parentId: string | null) {
    for (const item of items) {
      // Créer l'objet de mise à jour pour cet élément
      const updateItem = {
        _id: item.id,
        position: positionCounter,
        parentId: parentId ?? undefined,
        isVisible: item.isVisible,
      };
      updateArray.push(updateItem);

      // Mettre à jour la position dans le flattenedTree
      const flattenedItem = itemMap.get(item.id);
      if (flattenedItem) {
        flattenedItem.position = positionCounter;
      }

      positionCounter++;

      // Parcourir les enfants si présents
      if (item.children && item.children.length > 0) {
        traverse(item.children, item.id);
      }
    }
  }

  // Démarrer le parcours à partir des racines
  traverse(tree, null);

  return { updateArray, updatedTreeData: updatedFlattenedTree };
}

export const buildTree = (flatNodes: FlattenedItem[]): TreeItem[] => {
  const nodeMap = new Map<string, TreeItem>();

  // Initialiser la map avec chaque nœud
  flatNodes.forEach((node) => {
    nodeMap.set(node.id, {
      id: node.id,
      name: node.name,
      children: [],
      position: node.position,
      isVisible: node.isVisible,
    });
  });

  const tree: TreeItem[] = [];

  // Parcourir les nœuds et assigner les enfants à leur parent
  flatNodes.forEach((node) => {
    const treeNode = nodeMap.get(node.id)!; // Récupère le nœud correspondant
    if (node.parentId === null || node.parentId === undefined) {
      tree.push(treeNode); // Pas de parent, c'est un nœud racine
    } else {
      const parentNode = nodeMap.get(node.parentId);
      if (parentNode) {
        parentNode.children = parentNode.children ?? undefined;
        parentNode.children?.push(treeNode); // Ajoute le nœud en tant qu'enfant de son parent
      }
    }
  });

  return tree;
};

export function getProjection(
  items: FlattenedItem[],
  activeId: UniqueIdentifier,
  overId: UniqueIdentifier,
  dragOffset: number,
  indentationWidth: number,
) {
  const overItemIndex = items.findIndex(({ id }) => id === overId);
  const activeItemIndex = items.findIndex(({ id }) => id === activeId);
  const activeItem = items[activeItemIndex];
  const newItems = arrayMove(items, activeItemIndex, overItemIndex);
  const previousItem = newItems[overItemIndex - 1];
  const dragDepth = getDragDepth(dragOffset, indentationWidth);
  const projectedDepth = activeItem.depth + dragDepth;
  let depth = projectedDepth + activeItem.depth;

  if (!previousItem) {
    depth = 0;
  } else {
    depth = Math.max(0, Math.min(1, projectedDepth));
  }

  return { depth, parentId: getParentId(), activeId, previousItem };

  function getParentId() {
    if (depth === 0 || !previousItem) {
      return null;
    }

    if (depth === previousItem.depth) {
      return previousItem.parentId;
    }

    if (depth > previousItem.depth) {
      return previousItem.id;
    }

    const newParent = newItems
      .slice(0, overItemIndex)
      .reverse()
      .find((item) => item.depth === depth)?.parentId;

    return newParent ?? null;
  }
}
