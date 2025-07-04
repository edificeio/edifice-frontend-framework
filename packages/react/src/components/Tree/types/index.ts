import { UniqueIdentifier } from '@dnd-kit/core';
import { ComponentPropsWithRef } from 'react';

export type TreeItem = {
  id: string;
  name: string;
  position?: number;
  section?: boolean;
  children?: TreeItem[];
  isVisible?: boolean;
  [index: string]: any;
};

export type Projected = {
  depth: number;
  parentId: string | null;
  activeId: UniqueIdentifier;
} | null;

export interface TreeProps extends SharedTreeProps {
  /**
   * Tree data
   */
  nodes: TreeItem | TreeItem[];
  /**
   * Expand all nodes
   */
  shouldExpandAllNodes?: boolean;
  /**
   * Pass draggeNode when you drag an element from another context (resource / folder)
   */
  draggedNode?: {
    isOver: boolean;
    overId: string | undefined;
    isTreeview: boolean;
  };
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
   * @deprecated Use `renderNode ` instead
   */
  // @deprecated Use `renderNode ` instead
  onTreeItemAction?: (nodeId: string) => void;
}

export interface DndTreeProps extends TreeProps {
  /**
   * Pass draggeNode when you drag an element from another context (resource / folder)
   */
  draggedNode?: {
    isOver: boolean;
    overId: string | undefined;
    isTreeview: boolean;
  };
}

export interface SortableTreeProps extends TreeProps {
  /**
   *
   * @param id
   * @returns disable a specific node or the whole tree
   * disable a specific node: (nodeId) => disabledIds.includes(nodeId)
   * disable sorting: () => true
   */
  isDisabled?: (id: UniqueIdentifier) => boolean;
  /**
   *
   * @param nodeId dropped node
   * @param parentId current parentId or new parentId if move inside a new item
   * @returns gets nodeId and parentId to update via a service
   */
  onSortable: (updateArray: UpdateTreeData[]) => void;
}

export interface SharedTreeProps {
  /**
   * Customize the JSX we render inside a node
   */
  renderNode?: (payload: {
    node: TreeItem;
    hasChildren?: boolean;
    isChild?: boolean;
  }) => React.ReactNode;
  /**
   * Show Section Icon
   */
  showIcon?: boolean;
  /**
   * Node ID used for synchronization
   */
  selectedNodeId?: string | null;
  /**
   * Callback function to provide selected item to parent component
   */
  onTreeItemClick: (nodeId: string) => void;
}

export interface TreeNodeProps
  extends ComponentPropsWithRef<'li'>,
    SharedTreeProps {
  /**
   * Node data
   */
  node: TreeItem;
  /**
   * Is dragging element
   */
  focused?: boolean;
  /**
   * Use to disable sorting, check SortableTreeProps
   */
  disabled?: boolean;
  /**
   * Id of draggable node
   */
  draggedNodeId?: string | undefined;
  /**
   * Nodes expanded (opened)
   */
  expandedNodes: Set<string>;
  /**
   * Node is a child
   */
  isChild?: boolean;
  /**
   * Function to fold / unfold node
   */
  onToggleNode?: (nodeId: string) => void;
  /**
   * Space for indentation
   */
}

export interface DndTreeNodeProps extends TreeNodeProps {
  /**
   * Id of draggable node
   */
  draggedNodeId?: string | undefined;
}

export interface SortableTreeNodeProps extends TreeNodeProps {
  /**
   * Use to disable sorting, check SortableTreeProps
   */
  disabled?: boolean;
  /**
   * Node spacing value
   */
  indentationWidth: number;
  /**
   * Depth.
   */
  depth: number;
  /**
   * Node identifier as parent or child
   */
  isChild?: boolean;
  /**
   *  Projected node before dragging it
   */
  projected?: Projected;
}

export interface FlattenedItem extends TreeItem {
  parentId: string | null;
  depth: number;
}

export interface FlattendedNodes extends TreeItem {
  expandNode: boolean;
  parentExpanded: boolean;
}

export interface TreeViewHandlers {
  unselect: () => void;
  select: (nodeId: string) => void;
}

export interface UpdateTreeData {
  _id: string;
  parentId: string;
  position: number | null;
}
