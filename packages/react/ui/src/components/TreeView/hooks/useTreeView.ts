import { Ref, useEffect, useImperativeHandle, useMemo, useState } from "react";
import { TreeData } from "../../../types";
import { findNodeById, findPathById } from "../../../utils/treeview";
import { TreeViewHandlers } from "../TreeView";

export const useTreeView = ({
  data,
  ref,
  externalSelectedNodeId,
  draggedNode,
  onTreeItemUnfold,
  onTreeItemFold,
  onTreeItemClick,
}: {
  data: TreeData | TreeData[];
  ref: Ref<TreeViewHandlers>;
  externalSelectedNodeId: string | undefined;
  draggedNode?: {
    isOver: boolean;
    overId: string | undefined;
    isTreeview: boolean;
  };
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

  const selectedNodeId = internalSelectedNodeId ?? externalSelectedNodeId;
  const [draggedNodeId, setDraggedNodeId] = useState<string | undefined>(
    undefined,
  );

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
  const handlers: TreeViewHandlers = useMemo(
    () => ({
      unselectAll() {
        setInternalSelectedNodeId(undefined);
      },
      select(nodeId: string) {
        handleItemClick(nodeId);
      },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  useImperativeHandle(ref, () => handlers, [handlers]);

  useEffect(() => {
    if (data && !Array.isArray(data)) {
      setInternalSelectedNodeId(data.id);
    }
  }, [data]);

  /**
   * Effect runs only when controlling treeview with selectedNodeId props
   */
  useEffect(() => {
    if (externalSelectedNodeId) {
      handleExternalSelectedNodeId(externalSelectedNodeId);
      setInternalSelectedNodeId(externalSelectedNodeId);
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

    if (!isNodeExist) return;

    if (externalSelectedNodeId === "default") {
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
    handleSelectedItem(nodeId);
    handleToggleNode(nodeId);
    onTreeItemClick?.(nodeId);
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
    draggedNodeId,
    handleItemClick,
    handleFoldUnfold,
  };
};
