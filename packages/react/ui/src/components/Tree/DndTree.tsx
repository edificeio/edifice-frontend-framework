import { useDroppable } from "@dnd-kit/core";
import { forwardRef, useId } from "react";
import { TreeNode } from "./Tree";
import { DndTreeNodeProps, DndTreeProps } from "./types";
import { useTreeView } from "./hooks/useTreeView";

const DndTree = ({
  nodes,
  selectedNodeId: externalSelectedNodeId,
  showIcon = false,
  shouldExpandAllNodes = false,
  draggedNode,
  onTreeItemClick,
  renderNode,
}: DndTreeProps) => {
  const {
    selectedNodeId,
    expandedNodes,
    draggedNodeId,
    handleItemClick,
    handleFoldUnfold,
  } = useTreeView({
    data: nodes,
    externalSelectedNodeId,
    draggedNode,
    shouldExpandAllNodes,
    onTreeItemClick,
    // onTreeItemFold,
    // onTreeItemUnfold,
  });

  return (
    <div className="treeview">
      <ul role="tree" className="m-0 p-0">
        {Array.isArray(nodes) &&
          nodes.map((node) => (
            <DndTreeNode
              node={node}
              key={node.id}
              showIcon={showIcon}
              draggedNodeId={draggedNodeId}
              expandedNodes={expandedNodes}
              selectedNodeId={selectedNodeId}
              onTreeItemClick={handleItemClick}
              onToggleNode={handleFoldUnfold}
              renderNode={renderNode}
            />
          ))}
      </ul>
    </div>
  );
};

export const DndTreeNode = forwardRef(
  ({
    node,
    selectedNodeId,
    showIcon = false,
    expandedNodes,
    renderNode,
    onTreeItemClick,
    onToggleNode,
    draggedNodeId,
    ...restProps
  }: DndTreeNodeProps) => {
    const { setNodeRef } = useDroppable({
      id: useId(),
      data: {
        id: node.id,
        name: node.name,
        isTreeview: true,
        accepts: ["folder", "resource"],
      },
    });

    const focused = draggedNodeId === node.id;

    return (
      <TreeNode
        ref={setNodeRef}
        node={node}
        key={node.id}
        showIcon={showIcon}
        selectedNodeId={selectedNodeId}
        expandedNodes={expandedNodes}
        onTreeItemClick={onTreeItemClick}
        onToggleNode={onToggleNode}
        renderNode={renderNode}
        focused={focused}
        {...restProps}
      />
    );
  },
);

DndTree.displayName = "DndTree";

export default DndTree;
