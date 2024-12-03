import { DndContext, DragOverlay } from "@dnd-kit/core";
import {
  AnimateLayoutChanges,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import clsx from "clsx";
import { CSSProperties, Ref, forwardRef } from "react";
import { createPortal } from "react-dom";
import { useTranslation } from "react-i18next";
import { IconFolder, IconRafterRight } from "../../../modules/icons/components";
import { useTree } from "../hooks/useTree";
import { useTreeSortable } from "../hooks/useTreeSortable";
import {
  FlattenedItem,
  SortableTreeNodeProps,
  SortableTreeProps,
  TreeItem,
} from "../types";

const SortableTree = ({
  nodes,
  selectedNodeId: externalSelectedNodeId,
  showIcon = false,
  shouldExpandAllNodes = false,
  renderNode,
  isDisabled = () => false,
  onTreeItemClick,
  onSortable,
}: SortableTreeProps) => {
  const {
    selectedNodeId,
    expandedNodes,
    handleItemClick,
    handleFoldUnfold,
    collapseAllNodes,
  } = useTree({
    data: nodes,
    externalSelectedNodeId,
    shouldExpandAllNodes,
    onTreeItemClick,
  });

  const {
    handleDragEnd,
    handleDragMove,
    handleDragOver,
    handleDragStart,
    adjustTranslate,
    sortedIds,
    indicator,
    projected,
    announcements,
    activeId,
    indentationWidth,
    activeItem,
    dropAnimationConfig,
    measuring,
    sensors,
    items,
  } = useTreeSortable({
    nodes: nodes as TreeItem[],
    onSortable,
    collapseAllNodes,
  });

  return (
    <div className="treeview">
      <ul role="tree" className="m-0 p-0">
        <DndContext
          accessibility={{ announcements }}
          sensors={sensors}
          measuring={measuring}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onDragOver={handleDragOver}
          onDragMove={handleDragMove}
        >
          <SortableContext
            items={sortedIds}
            strategy={verticalListSortingStrategy}
          >
            {Array.isArray(items) &&
              items.map((node) => (
                <TreeNode
                  node={node}
                  key={node.id}
                  showIcon={showIcon}
                  expandedNodes={expandedNodes}
                  selectedNodeId={selectedNodeId}
                  renderNode={renderNode}
                  disabled={isDisabled(node.id)}
                  onTreeItemClick={handleItemClick}
                  onToggleNode={handleFoldUnfold}
                  depth={
                    node.id === activeId && projected ? projected.depth : 0
                  }
                  indentationWidth={indentationWidth}
                  projected={projected}
                />
              ))}
          </SortableContext>
          {createPortal(
            <DragOverlay
              dropAnimation={dropAnimationConfig}
              modifiers={indicator ? [adjustTranslate] : undefined}
            >
              {activeId && activeItem ? (
                <DragOverlayItem activeItem={activeItem} />
              ) : null}
            </DragOverlay>,
            document.body,
          )}
        </DndContext>
      </ul>
    </div>
  );
};

const TreeNode = forwardRef(
  (
    {
      node,
      selectedNodeId,
      showIcon = false,
      expandedNodes,
      focused,
      disabled,
      indentationWidth,
      depth,
      isChild,
      projected,
      renderNode,
      onTreeItemClick,
      onToggleNode,
    }: SortableTreeNodeProps,
    ref: Ref<HTMLLIElement>,
  ) => {
    const { t } = useTranslation();

    const selected = selectedNodeId === node.id;
    const expanded = expandedNodes.has(node.id);

    const animateLayoutChanges: AnimateLayoutChanges = ({
      isSorting,
      wasDragging,
    }) => (isSorting || wasDragging ? false : true);

    const { listeners, setNodeRef, transform, transition, isDragging } =
      useSortable({
        id: node.id,
        disabled,
        animateLayoutChanges,
      });

    const style: CSSProperties = {
      transform: CSS.Translate.toString(transform),
      transition,
    };

    const treeItemClasses = {
      action: clsx("action-container d-flex align-items-center gap-8 px-2", {
        "drag-focus": focused,
        "border border-secondary rounded rounded-2 shadow bg-white": isDragging,
      }),
      arrow: clsx({
        invisible: !Array.isArray(node.children) || node.children.length === 0,
      }),
      button: clsx("flex-fill d-flex align-items-center text-truncate gap-8", {
        "py-8": depth === 0,
        "py-4": depth === 1,
      }),
    };

    const handleItemKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (event.code === "Enter" || event.code === "Space") {
        event.preventDefault();
        event.stopPropagation();

        onTreeItemClick?.(node.id);
      }
    };

    const handleItemToggleKeyDown = (
      event: React.KeyboardEvent<HTMLDivElement>,
    ) => {
      if (event.code === "Enter" || event.code === "Space") {
        event.preventDefault();
        event.stopPropagation();

        onToggleNode?.(node.id);
      }
    };

    const spaceGestion = () =>
      !isDragging
        ? null
        : isChild
          ? depth === 1
            ? `${indentationWidth * depth}px`
            : "0px"
          : `${indentationWidth * depth}px`;

    return (
      <li
        ref={setNodeRef}
        key={node.id}
        id={`treeitem-${node.id}`}
        role="treeitem"
        aria-selected={selected}
        aria-expanded={expanded}
        style={
          {
            ...style,
            marginLeft: spaceGestion(),
          } as React.CSSProperties
        }
        {...listeners}
      >
        <div>
          <div className={treeItemClasses.action}>
            <div
              className={treeItemClasses.arrow}
              tabIndex={0}
              role="button"
              onClick={() => onToggleNode?.(node.id)}
              onKeyDown={handleItemToggleKeyDown}
              aria-label={t("foldUnfold")}
            >
              <IconRafterRight
                width={16}
                style={{
                  transform: expanded ? "rotate(90deg)" : "",
                }}
              />
            </div>

            {node.children && showIcon ? (
              <IconFolder title="folder" width={20} height={20} />
            ) : null}

            <div
              tabIndex={0}
              role="button"
              className={treeItemClasses.button}
              onClick={() => onTreeItemClick(node.id)}
              onKeyDown={handleItemKeyDown}
            >
              {renderNode ? (
                renderNode({
                  node,
                  hasChildren:
                    Array.isArray(node.children) && !!node.children.length,
                  isChild,
                })
              ) : (
                <div className="text-truncate">{node.name}</div>
              )}
            </div>
          </div>

          {expanded && node.children && !!node.children.length && (
            <ul role="group">
              {node.children?.map((node) => (
                <TreeNode
                  ref={ref}
                  node={node}
                  key={node.id}
                  showIcon={showIcon}
                  selectedNodeId={selectedNodeId}
                  expandedNodes={expandedNodes}
                  onTreeItemClick={onTreeItemClick}
                  onToggleNode={onToggleNode}
                  renderNode={renderNode}
                  indentationWidth={indentationWidth}
                  depth={
                    node.id === projected?.activeId && projected
                      ? projected.depth
                      : 0
                  }
                  isChild={true}
                  projected={projected}
                />
              ))}
            </ul>
          )}
        </div>
      </li>
    );
  },
);

export const DragOverlayItem = forwardRef(
  (
    {
      activeItem,
      ...props
    }: {
      activeItem: FlattenedItem | null | undefined;
    },
    ref: Ref<HTMLDivElement>,
  ) => {
    return (
      <div
        ref={ref}
        {...props}
        className="opacity-0"
        style={{ cursor: "grabbing" }}
      >
        <div
          className={clsx("action-container align-items-center gap-8 px-2")}
          style={{
            backgroundColor: "white",
            border: "1px solid black",
            width: "100px",
          }}
        >
          <div
            className={clsx(
              "flex-fill d-flex align-items-center text-truncate gap-8 py-8",
            )}
          >
            <span className="text-truncate">{activeItem?.name}</span>
          </div>
        </div>
      </div>
    );
  },
);

SortableTree.displayName = "SortableTree";

export default SortableTree;
