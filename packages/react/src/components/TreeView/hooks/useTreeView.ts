import {
  Ref,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import { TreeData } from '../../../types';
import { TreeViewHandlers_V1 } from '../TreeView';
import { findNodeById, findPathById } from '../utilities/treeview';

export const useTreeView = ({
  data,
  ref,
  externalSelectedNodeId,
  draggedNode,
  allExpandedNodes,
  onTreeItemUnfold,
  onTreeItemFold,
  onTreeItemClick,
}: {
  data: TreeData | TreeData[];
  ref: Ref<TreeViewHandlers_V1>;
  externalSelectedNodeId: string | undefined;
  draggedNode?: {
    isOver: boolean;
    overId: string | undefined;
    isTreeview: boolean;
  };
  allExpandedNodes?: boolean;
  /**
   * Callback function to provide unfolded item to parent component
   */
  onTreeItemUnfold?: (nodeId: string) => void;
  /**
   * Callback function to provide folded item to parent component
   */
  onTreeItemFold?: (nodeId: string) => void;
  /**
   * Callback function to provide selected item to parent component
   */
  onTreeItemClick?: (nodeId: string) => void;
}) => {
  const [internalSelectedNodeId, setInternalSelectedNodeId] = useState<
    string | undefined
  >(undefined);
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());
  const siblingsNodes = useRef<Set<string>>(new Set());
  const [draggedNodeId, setDraggedNodeId] = useState<string | undefined>(
    undefined,
  );

  const selectedNodeId = internalSelectedNodeId ?? externalSelectedNodeId;

  function addNodesWithSiblingHavingChildren(data: TreeData | TreeData[]) {
    if (Array.isArray(data)) {
      data.forEach((node) => {
        const resultSet = new Set(siblingsNodes.current);
        const siblings = data.filter(({ id }) => id !== node.id);
        const hasSiblingWithChildren = siblings.some(
          (sibling) => sibling.children && sibling.children.length > 0,
        );

        if (hasSiblingWithChildren) {
          resultSet.add(node.id);
        }

        if (node.children && node.children.length > 0) {
          node.children.forEach((child) => {
            const childSiblings = node.children?.filter(
              ({ id }) => id !== child.id,
            );
            const hasChildSiblingWithChildren = childSiblings?.some(
              (sibling) => sibling.children && sibling.children.length > 0,
            );

            if (hasChildSiblingWithChildren) {
              resultSet.add(child.id);
            }

            addNodesWithSiblingHavingChildren(child);
          });
        }
      });
    } else {
      data.children?.forEach((child) => {
        const resultSet = new Set(siblingsNodes.current);
        const siblings = data.children?.filter((c) => c.id !== child.id);

        const hasSiblingWithChildren = siblings?.some(
          (sibling) => sibling.children && sibling.children.length > 0,
        );

        if (hasSiblingWithChildren) {
          resultSet.add(child.id);
          siblingsNodes.current = resultSet;
        }

        addNodesWithSiblingHavingChildren(child);
      });
    }
  }

  const expandedAllNodes = (allExpandedNodes: boolean | undefined) => {
    const initExpandedNodes = new Set('');
    if (data && Array.isArray(data) && allExpandedNodes) {
      data.forEach((node) => {
        initExpandedNodes.add(node.id);
      });
      setExpandedNodes(initExpandedNodes);
    }
  };

  useEffect(() => {
    if (data) {
      addNodesWithSiblingHavingChildren(data);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  useEffect(() => {
    if (draggedNode?.isOver && draggedNode.isTreeview) {
      draggedNode.overId ? handleItemDrag(draggedNode.overId) : undefined;
      setDraggedNodeId(draggedNode.overId);
    } else {
      setDraggedNodeId(undefined);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draggedNode]);

  /**
   * Doesn't work with lazy loaded data
   * If children are fetched, prefer to use selectedNodeId props
   * And callback props (e.g: onTreeItemClick, onTreeItemUnfold, ...)
   */
  const handlers: TreeViewHandlers_V1 = useMemo(
    () => ({
      unselectAll() {
        setInternalSelectedNodeId(undefined);
      },
      select(nodeId: string) {
        handleItemClick(nodeId);
      },
      allExpandedNodes() {
        expandedAllNodes(allExpandedNodes);
      },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  useImperativeHandle(ref, () => handlers, [handlers]);

  useEffect(() => {
    expandedAllNodes(allExpandedNodes);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * Effect runs only when controlling treeview with selectedNodeId props
   */
  useEffect(() => {
    if (externalSelectedNodeId && !allExpandedNodes) {
      handleExternalSelectedNodeId(externalSelectedNodeId);
      setInternalSelectedNodeId(externalSelectedNodeId);
    } else {
      setInternalSelectedNodeId(undefined);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [externalSelectedNodeId]);

  /**
   * If you need to control treeview from a source other than itself
   * @param nodeId
   * @returns
   */
  const handleExternalSelectedNodeId = (nodeId: string) => {
    const isNodeExist = findNodeById(data, selectedNodeId as string);

    if (!isNodeExist) {
      setInternalSelectedNodeId(undefined);
      return;
    }

    if (externalSelectedNodeId === 'default') {
      expandedNodes.forEach((node) => onTreeItemUnfold?.(node));
      return;
    }

    handleExpandNode(nodeId);
  };

  /**
   * Expand a node by adding its ancestors and itself in expandedNodes
   * @param nodeId
   */
  const handleExpandNode = (nodeId: string) => {
    const updatedExpandedNodes = new Set(expandedNodes);

    const parents = findPathById(data, nodeId);
    const arrayOrder = Array.from(updatedExpandedNodes);

    parents.forEach((parent) => {
      const index = arrayOrder.indexOf(parent);
      if (index > -1) {
        arrayOrder.splice(index, 1);
      }
      arrayOrder.push(parent);
    });

    updatedExpandedNodes.clear();
    arrayOrder.forEach((node) => updatedExpandedNodes.add(node));
    updatedExpandedNodes.forEach((node) => onTreeItemUnfold?.(node));
    setExpandedNodes(updatedExpandedNodes);
  };

  /**
   * Collapse a node by deleting it from expandedNodes
   * @param nodeId
   */
  const handleCollapseNode = (nodeId: string) => {
    const updatedExpandedNodes = new Set(expandedNodes);
    updatedExpandedNodes.delete(nodeId);
    updatedExpandedNodes.forEach((node) => onTreeItemFold?.(node));
    setExpandedNodes(updatedExpandedNodes);
  };

  /**
   * Expand a node if is not in expandedNodes
   * or
   * Collapse a node if exists in expandedNodes
   * @param nodeId
   */
  const handleToggleNode = (nodeId: string) => {
    expandedNodes.has(nodeId)
      ? handleCollapseNode(nodeId)
      : handleExpandNode(nodeId);
  };

  /**
   * Select a node and update internalSelectedNodeId
   * @param nodeId
   * @returns nothing if already selected
   */
  const handleSelectedItem = (nodeId: string) => {
    const isSelected = selectedNodeId === nodeId;

    if (isSelected) return;
    setInternalSelectedNodeId(nodeId);
  };

  /**
   * When using uncontrolled Treeview or TreeviewRef
   * Select a node, expand node and its ancestors
   * If already in expandedNodes, select the node but collapse it in tree
   * @param nodeId
   */
  const handleItemClick = (nodeId: string) => {
    handleSelectedItem(nodeId);
    handleExpandNode(nodeId);
    onTreeItemClick?.(nodeId);
  };

  const handleFoldUnfold = (nodeId: string) => {
    // handleSelectedItem(nodeId);
    handleToggleNode(nodeId);
    // onTreeItemClick?.(nodeId);
  };

  /**
   * Find and expand node when dragging an item to open it in treeview
   * @param nodeId
   * @returns
   */
  const handleItemDrag = (nodeId: string) => {
    const isNodeExist = findNodeById(data, externalSelectedNodeId as string);
    if (!isNodeExist) return;
    handleExpandNode(nodeId);
  };

  return {
    selectedNodeId,
    expandedNodes,
    siblingsNodes,
    draggedNodeId,
    handleItemClick,
    handleFoldUnfold,
  };
};
