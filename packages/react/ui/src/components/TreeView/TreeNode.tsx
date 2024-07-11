import { TreeData } from "../../types";
import { TreeItem } from "./TreeItem";

export interface TreeNodeProps {
  node: TreeData;
  expandedNodes: Set<string>;
  selectedNodeId?: string;
  draggedNodeId?: string | undefined;
  handleItemClick: (nodeId: string) => void;
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
              expandedNodes={expandedNodes}
              handleItemClick={handleItemClick}
              handleToggleNode={handleToggleNode}
            />
          ))
        : null}
    </TreeItem>
  );
};
