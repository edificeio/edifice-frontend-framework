import { useDroppable } from "@dnd-kit/core";
import { Folder, RafterDown, RafterRight } from "@edifice-ui/icons";
import clsx from "clsx";
import { useId } from "react";
import { useTranslation } from "react-i18next";
import { TreeData } from "../../types";

export interface TreeNodeProps {
  /**
   * Data
   */
  node: TreeData;
  /**
   * Show or hide section icon (folder icon)
   */
  showIcon?: boolean;
  /**
   * Open all treeview nodes
   */
  allExpandedNodes?: boolean;
  /**
   * Nodes expanded (opened)
   */
  expandedNodes: Set<string>;
  /**
   * Siblings nodes
   */
  siblingsNodes?: React.MutableRefObject<Set<string>>;
  // siblingsNodes?: Set<string>;
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
  showIcon,
  allExpandedNodes,
  selectedNodeId,
  expandedNodes,
  siblingsNodes,
  draggedNodeId,
  handleItemClick,
  handleToggleNode,
}: TreeNodeProps) => {
  const expanded = expandedNodes.has(node.id);
  const sibling = siblingsNodes?.current.has(node.id);
  const selected = selectedNodeId === node.id;
  const focused = draggedNodeId === node.id;

  const treeItemClasses = {
    action: clsx("action-container d-flex align-items-center gap-8 px-2", {
      "drag-focus": focused,
      "py-4": !node.section,
    }),
    arrow: clsx({
      "py-4": !node.section,
      "py-8": node.section,
      "invisible": !Array.isArray(node.children) || node.children.length === 0,
    }),
    button: clsx("flex-fill d-flex align-items-center text-truncate gap-8", {
      "py-8": node.section,
    }),
  };

  const iconSize = node.section ? 16 : 12;

  const { t } = useTranslation();

  const { setNodeRef } = useDroppable({
    id: useId(),
    data: {
      id: node.id,
      name: node.name,
      isTreeview: true,
      accepts: ["folder", "resource"],
    },
  });

  const handleOnItemClick = (nodeId: string) => handleItemClick?.(nodeId);
  const handleOnToggleNode = (nodeId: string) => handleToggleNode?.(nodeId);

  const handleItemKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.code === "Enter" || event.code === "Space") {
      event.preventDefault();
      event.stopPropagation();

      handleItemClick?.(node.id);
    }
  };

  const handleItemToggleKeyDown = (
    event: React.KeyboardEvent<HTMLDivElement>,
  ) => {
    if (event.code === "Enter" || event.code === "Space") {
      event.preventDefault();
      event.stopPropagation();

      handleToggleNode?.(node.id);
    }
  };

  const renderRafterIcon = (expanded: boolean) => {
    const RafterComponent = expanded ? RafterDown : RafterRight;
    return (
      <RafterComponent
        title={t("foldUnfold")}
        width={iconSize}
        height={iconSize}
      />
    );
  };

  const shouldRenderRafterIcon = () => {
    const hasNoSiblings = !siblingsNodes?.current?.has(node.id);
    const hasChildren =
      Array.isArray(node.children) && node.children.length > 0;

    return sibling || (hasNoSiblings && hasChildren);
  };

  return (
    <li
      key={node.id}
      ref={setNodeRef}
      id={`treeitem-${node.id}`}
      role="treeitem"
      aria-selected={selected && selected}
      aria-expanded={expanded && expanded}
    >
      <div>
        <div className={treeItemClasses.action}>
          <div
            className={treeItemClasses.arrow}
            tabIndex={0}
            role="button"
            onClick={() => handleOnToggleNode(node.id)}
            onKeyDown={handleItemToggleKeyDown}
            aria-label={t("foldUnfold")}
          >
            {shouldRenderRafterIcon() && renderRafterIcon(expanded)}
          </div>
          <div
            tabIndex={0}
            role="button"
            className={treeItemClasses.button}
            onClick={() => handleOnItemClick(node.id)}
            onKeyDown={handleItemKeyDown}
          >
            {node.section && showIcon && (
              <Folder title={t("folder")} width={20} height={20} />
            )}
            <span className="text-truncate">{node.name}</span>
          </div>
        </div>

        {Array.isArray(node.children) && !!node.children.length && expanded && (
          <ul role="group" className={allExpandedNodes ? "" : "border-left"}>
            {node.children.map((child) => {
              return (
                <TreeNode
                  key={child.id}
                  node={child}
                  selectedNodeId={selectedNodeId}
                  expandedNodes={expandedNodes}
                  siblingsNodes={siblingsNodes}
                  draggedNodeId={draggedNodeId}
                  handleItemClick={handleItemClick}
                  handleToggleNode={handleToggleNode}
                />
              );
            })}
          </ul>
        )}
      </div>
    </li>
  );
};
