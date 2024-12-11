import { useDroppable } from '@dnd-kit/core';
import { Ref, forwardRef, useId } from 'react';
import { mergeRefs } from '../../../utilities';
import { useTree } from '../hooks/useTree';
import { DndTreeNodeProps, DndTreeProps } from '../types';
import { TreeNode } from './Tree';

export const DndTree = forwardRef(
  (
    {
      nodes,
      selectedNodeId: externalSelectedNodeId,
      showIcon = false,
      shouldExpandAllNodes = false,
      draggedNode,
      onTreeItemClick,
      onTreeItemFold,
      onTreeItemUnfold,
      renderNode,
    }: DndTreeProps,
    ref: Ref<HTMLDivElement>,
  ) => {
    const {
      selectedNodeId,
      expandedNodes,
      draggedNodeId,
      handleItemClick,
      handleFoldUnfold,
    } = useTree({
      data: nodes,
      externalSelectedNodeId,
      draggedNode,
      shouldExpandAllNodes,
      onTreeItemClick,
      onTreeItemFold,
      onTreeItemUnfold,
    });

    return (
      <div className="treeview" ref={ref}>
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
  },
);

const DndTreeNode = forwardRef(
  (
    {
      node,
      selectedNodeId,
      showIcon = false,
      expandedNodes,
      renderNode,
      onTreeItemClick,
      onToggleNode,
      draggedNodeId,
      ...restProps
    }: DndTreeNodeProps,
    ref: Ref<HTMLLIElement>,
  ) => {
    const { setNodeRef } = useDroppable({
      id: useId(),
      data: {
        id: node.id,
        name: node.name,
        isTreeview: true,
        accepts: ['folder', 'resource'],
      },
    });

    const focused = draggedNodeId === node.id;

    return (
      <TreeNode
        ref={mergeRefs(ref, setNodeRef)}
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

DndTree.displayName = 'DndTree';

export default DndTree;
