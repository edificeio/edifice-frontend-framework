import { useDroppable } from "@dnd-kit/core";
import { Folder, RafterDown, RafterRight } from "@edifice-ui/icons";
import clsx from "clsx";
import { useId } from "react";
import { useTranslation } from "react-i18next";
import { TreeData } from "../../types";
import { hasChildren } from "../../utils";

export interface TreeNodeProps {
  /**
   * TreeData[]
   */
  data?: TreeData[];
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
  data,
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
  const getSections = data?.filter((node) => node.section);
  const sectionsChildren = getSections?.map((section) =>
    hasChildren(section.id, section),
  );

  const treeItemClasses = {
    action: clsx("action-container d-flex align-items-center gap-8 px-2", {
      "drag-focus": focused,
      "py-4": !node.section,
    }),
    arrow: clsx({
      "py-4": !node.section,
      "py-8": node.section,
      invisible: !Array.isArray(node.children),
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

  const shouldRenderIcon = node.section
    ? sectionsChildren?.some((value) => value === true)
    : Array.isArray(node.children) && node.children.length;

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
            {shouldRenderIcon && renderRafterIcon(expanded)}
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
