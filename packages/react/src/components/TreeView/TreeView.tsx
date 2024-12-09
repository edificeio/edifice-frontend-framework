import { Ref, forwardRef } from 'react';

import { TreeData } from '../../types';
import { TreeNode } from './TreeNode';
import { useTreeView } from './hooks/useTreeView';

// @deprecated This interface is deprecated and will be removed in future versions.
export interface TreeViewHandlers_V1 {
  unselectAll: () => void;
  select: (nodeId: string) => void;
}

// @deprecated This interface is deprecated and will be removed in future versions.
export interface TreeViewProps {
  /**
   * TreeNode data
   */
  data: TreeData | TreeData[];

  /**
   * Node ID used for navigation folders
   */
  selectedNodeId?: string;

  /**
   * Show Section Icon Folder
   */
  showIcon?: boolean;

  /**
   * Open all treeview nodes
   */
  allExpandedNodes?: boolean;

  /**
   * Pass draggeNode when you drag an element from another context (resource / folder)
   */
  draggedNode?: {
    isOver: boolean;
    overId: string | undefined;
    isTreeview: boolean;
  };

  /**
   * Callback function to provide selected item to parent component
   */
  onTreeItemClick?: (nodeId: string) => void;

  /**
   * Callback function to provide folded item to parent component
   */
  onTreeItemFold?: (nodeId: string) => void;

  /**
   * Callback function to provide unfolded item to parent component
   */
  onTreeItemUnfold?: (nodeId: string) => void;
  /**
   * Callback function to secondary action
   */
  onTreeItemAction?: (nodeId: string) => void;
}

/**
 * @deprecated This component is deprecated and will be removed in future versions.
 * Please use the Tree component instead.
 */
/**
 * UI TreeView Component
 */

const TreeView = forwardRef(
  (props: TreeViewProps, ref: Ref<TreeViewHandlers_V1>) => {
    const {
      data,
      onTreeItemClick,
      onTreeItemUnfold,
      onTreeItemFold,
      onTreeItemAction,
      draggedNode,
      showIcon = true,
      allExpandedNodes = false,
      selectedNodeId: externalSelectedNodeId,
    } = props;

    const {
      selectedNodeId,
      expandedNodes,
      siblingsNodes,
      draggedNodeId,
      handleItemClick,
      handleFoldUnfold,
    } = useTreeView({
      data,
      ref,
      externalSelectedNodeId,
      draggedNode,
      allExpandedNodes,
      onTreeItemClick,
      onTreeItemFold,
      onTreeItemUnfold,
    });

    return (
      <div className="treeview">
        <ul role="tree" className="m-0 p-0">
          {Array.isArray(data) ? (
            data.map((node) => {
              return (
                <TreeNode
                  node={node}
                  key={node.id}
                  showIcon={showIcon}
                  selectedNodeId={selectedNodeId}
                  expandedNodes={expandedNodes}
                  siblingsNodes={siblingsNodes}
                  draggedNodeId={draggedNodeId}
                  handleItemClick={handleItemClick}
                  handleToggleNode={handleFoldUnfold}
                  handleItemAction={onTreeItemAction}
                />
              );
            })
          ) : (
            <TreeNode
              node={data}
              selectedNodeId={selectedNodeId}
              expandedNodes={expandedNodes}
              siblingsNodes={siblingsNodes}
              showIcon={showIcon}
              draggedNodeId={draggedNodeId}
              handleItemClick={handleItemClick}
              handleToggleNode={handleFoldUnfold}
            />
          )}
        </ul>
      </div>
    );
  },
);

TreeView.displayName = 'TreeView';

export default TreeView;
