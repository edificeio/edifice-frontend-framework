import { TreeData } from "../../types";
import { TreeItem } from "./TreeItem";

export interface TreeNodeProps {
  /**
   * Data
   */
  node: TreeData;
  /**
   * Nodes expanded (opened)
   */
  expandedNodes: Set<string>;
  /**
   * External node selected to sync Treeview
   */
  selectedNodeId?: string;
  /**
   * Is node over
   */
  focused?: boolean;
  /**
   * Id of draggable node
   */
  draggedNodeId?: string | undefined;
  /**
   * Function to select item
   */
  handleItemClick: (nodeId: string) => void;
  /**
   * Function to fold / unfold node
   */
  handleToggleNode?: (nodeId: string) => void;
}

export const TreeNode = ({
  node,
  selectedNodeId,
  expandedNodes,
  draggedNodeId,
  handleItemClick,
  handleToggleNode,
}: TreeNodeProps) => {
  const selected = selectedNodeId === node.id;
  const expanded = expandedNodes.has(node.id);
  const focused = draggedNodeId === node.id;

  return (
    <TreeItem
      key={node.id}
      nodeId={node.id}
      label={node.name}
      section={node.section}
      selected={selected}
      expanded={expanded}
      focused={focused}
      onToggleNode={handleToggleNode}
      onItemClick={handleItemClick}
    >
      {Array.isArray(node.children)
        ? node.children.map((item) => (
            <TreeNode
              key={item.id}
              node={item}
              selectedNodeId={selectedNodeId}
              draggedNodeId={draggedNodeId}
              expandedNodes={expandedNodes}
              focused={focused}
              handleItemClick={handleItemClick}
              handleToggleNode={handleToggleNode}
            />
          ))
        : null}
    </TreeItem>
  );
};
