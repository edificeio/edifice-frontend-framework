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
  showIcon,
  selectedNodeId,
  expandedNodes,
  draggedNodeId,
  handleItemClick,
  handleToggleNode,
}: TreeNodeProps) => {
  const expanded = expandedNodes.has(node.id);
  const selected = selectedNodeId === node.id;
  const focused = draggedNodeId === node.id;

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

  const handleItemKeyDown = (
    event: React.KeyboardEvent<HTMLDivElement>,
    nodeId: string,
  ) => {
    if (event.code === "Enter" || event.code === "Space") {
      event.preventDefault();
      event.stopPropagation();

      handleItemClick?.(nodeId);
    }
  };

  const handleItemToggleKeyDown = (
    event: React.KeyboardEvent<HTMLDivElement>,
    nodeId: string,
  ) => {
    if (event.code === "Enter" || event.code === "Space") {
      event.preventDefault();
      event.stopPropagation();

      handleToggleNode?.(nodeId);
    }
  };

  const treeItemClasses = {
    action: clsx("action-container d-flex align-items-center gap-8 px-2", {
      "drag-focus": focused,
    }),
    arrow: clsx("py-8", {
      invisible: !Array.isArray(node.children),
    }),
    button: clsx(
      "flex-fill d-flex align-items-center text-truncate gap-8 py-8",
    ),
  };

  const iconSize = node.section ? 16 : 12;

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
            onClick={() => handleToggleNode?.(node.id)}
            onKeyDown={(event) => handleItemToggleKeyDown(event, node.id)}
            aria-label={t("foldUnfold")}
          >
            {Array.isArray(node.children) &&
              !!node.children.length &&
              (expanded ? (
                <RafterDown
                  title={t("foldUnfold")}
                  width={iconSize}
                  height={iconSize}
                />
              ) : (
                <RafterRight
                  title={t("foldUnfold")}
                  width={iconSize}
                  height={iconSize}
                />
              ))}

            {/* Hide rafter when no children to keep alignment */}
            {!Array.isArray(node.children) && !node.section && (
              <RafterRight
                title={t("foldUnfold")}
                width={iconSize}
                height={iconSize}
                aria-hidden="true"
              />
            )}
          </div>
          <div
            tabIndex={0}
            role="button"
            className={treeItemClasses.button}
            onClick={() => handleItemClick?.(node.id)}
            onKeyDown={(event) => handleItemKeyDown(event, node.id)}
          >
            {node.section && showIcon && (
              <Folder title={t("folder")} width={20} height={20} />
            )}
            <span className="text-truncate">{node.name}</span>
          </div>
        </div>

        {Array.isArray(node.children) && !!node.children.length && expanded && (
          <ul role="group">
            {node.children.map((child) => {
              return (
                <TreeNode
                  key={child.id}
                  node={child}
                  selectedNodeId={selectedNodeId}
                  expandedNodes={expandedNodes}
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
