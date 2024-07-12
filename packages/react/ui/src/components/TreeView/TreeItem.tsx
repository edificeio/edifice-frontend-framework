import { useDroppable } from "@dnd-kit/core";
import { Folder, RafterDown, RafterRight } from "@edifice-ui/icons";
import clsx from "clsx";
import { useId } from "react";
import { useTranslation } from "react-i18next";

export interface TreeItemProps {
  /**
   * Node's id
   */
  nodeId: string;

  /**
   * Node's label
   */
  label: string;

  /**
   * ReactNode children
   */
  children: React.ReactNode;

  /**
   * Is current node a section (root element)
   */
  section?: boolean;

  /**
   * Is current node needed icon folder
   */
  showIconSection?: boolean;

  /**
   * Is node selected
   */
  selected: boolean;

  /**
   * Is node expanded
   */
  expanded: boolean;

  /**
   * Is node over
   */
  focused?: boolean;

  /**
   * Callback function to provide selected item to parent component (TreeView)
   */
  onItemClick?: (nodeId: string) => void;

  /**
   * Callback function to provide unfolded item to parent component (TreeView)
   */
  onItemUnfold?: (nodeId: string) => void;

  /**
   * Callback function to provide unfolded item to parent component (TreeView)
   */
  onToggleNode?: (nodeId: string) => void;
}

export const TreeItem = (props: TreeItemProps) => {
  const {
    nodeId,
    label,
    children,
    section,
    showIconSection,
    selected,
    expanded,
    focused,
    onItemClick,
    onToggleNode,
  } = props;

  const { t } = useTranslation();

  const { setNodeRef } = useDroppable({
    id: useId(),
    data: {
      id: nodeId,
      name: label,
      isTreeview: true,
      accepts: ["folder", "resource"],
    },
  });

  const rafterSize = section ? 16 : 12;

  const handleItemKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.code === "Enter" || event.code === "Space") {
      event.preventDefault();
      event.stopPropagation();

      onItemClick?.(nodeId);
    }
  };

  const handleItemToggleKeyDown = (
    event: React.KeyboardEvent<HTMLDivElement>,
  ) => {
    if (event.code === "Enter" || event.code === "Space") {
      event.preventDefault();
      event.stopPropagation();

      onToggleNode?.(nodeId);
    }
  };

  const handleItemClick = () => onItemClick?.(nodeId);
  const handleToggleNode = () => onToggleNode?.(nodeId);

  const treeItemClasses = {
    action: clsx("action-container d-flex align-items-center gap-8 px-2", {
      "drag-focus": focused,
    }),
    arrow: clsx("py-8", {
      invisible: !Array.isArray(children),
    }),
    button: clsx(
      "flex-fill d-flex align-items-center text-truncate gap-8 py-8",
    ),
  };

  const showIfHasChildren =
    Array.isArray(children) && !!children.length && expanded;

  const renderSection = () => (
    <ul role="tree" className="m-0 p-0">
      {renderItem()}
    </ul>
  );

  const renderItem = () => (
    <li
      key={nodeId}
      ref={setNodeRef}
      id={`treeitem-${nodeId}`}
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
            onClick={handleToggleNode}
            onKeyDown={handleItemToggleKeyDown}
            aria-label={t("foldUnfold")}
          >
            {Array.isArray(children) && !!children.length && !expanded && (
              <RafterRight
                title={t("foldUnfold")}
                width={rafterSize}
                height={rafterSize}
              />
            )}

            {showIfHasChildren && (
              <RafterDown
                title={t("foldUnfold")}
                width={rafterSize}
                height={rafterSize}
              />
            )}

            {/* Hide rafter when no children to keep alignment */}
            {!Array.isArray(children) && (
              <RafterRight
                title={t("foldUnfold")}
                width={rafterSize}
                height={rafterSize}
                aria-hidden="true"
              />
            )}
          </div>
          <div
            tabIndex={0}
            role="button"
            className={treeItemClasses.button}
            onClick={handleItemClick}
            onKeyDown={handleItemKeyDown}
          >
            {section && showIconSection && (
              <Folder title={t("folder")} width={20} height={20} />
            )}
            <span className="text-truncate">{label}</span>
          </div>
        </div>

        {showIfHasChildren && <ul role="group">{children}</ul>}
      </div>
    </li>
  );

  return section ? renderSection() : renderItem();
};
