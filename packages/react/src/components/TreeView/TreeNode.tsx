import { useDroppable } from '@dnd-kit/core';
import clsx from 'clsx';
import { useId } from 'react';
import { useTranslation } from 'react-i18next';
import {
  IconFolder,
  IconPlus,
  IconRafterDown,
  IconRafterRight,
} from '../../modules/icons/components';
import { TreeData } from '../../types';

export interface TreeNodeProps_V1 {
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
   * Siblings nodes
   */
  siblingsNodes?: React.MutableRefObject<Set<string>>;
  // siblingsNodes?: Set<string>;
  /**
   * External node selected to sync Treeview
   */
  selectedNodeId?: string;
  /**
   * Is treeview is an array
   */
  isTreeviewArray?: boolean;
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
  /**
   * Function to handle secondary action
   */
  handleItemAction?: (nodeId: string) => void;
}

export const TreeNode = ({
  node,
  showIcon,
  selectedNodeId,
  expandedNodes,
  siblingsNodes,
  draggedNodeId,
  handleItemClick,
  handleToggleNode,
  handleItemAction,
}: TreeNodeProps_V1) => {
  const expanded = expandedNodes.has(node.id);
  const sibling = siblingsNodes?.current.has(node.id);
  const selected = selectedNodeId === node.id;
  const focused = draggedNodeId === node.id;

  const treeItemClasses = {
    action: clsx('action-container d-flex align-items-center gap-8 px-2', {
      'drag-focus': focused,
      'py-4': !node.section,
    }),
    arrow: clsx({
      'py-4': !node.section,
      'py-8': node.section,
      'invisible': !Array.isArray(node.children) || node.children.length === 0,
    }),
    button: clsx('flex-fill d-flex align-items-center text-truncate gap-8', {
      'py-8': node.section,
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
      accepts: ['folder', 'resource'],
    },
  });

  const handleOnItemClick = (nodeId: string) => handleItemClick?.(nodeId);
  const handleOnToggleNode = (nodeId: string) => handleToggleNode?.(nodeId);
  const handleOnCreateChildrenPage = (nodeId: string) =>
    handleItemAction?.(nodeId);

  const handleItemKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.code === 'Enter' || event.code === 'Space') {
      event.preventDefault();
      event.stopPropagation();

      handleItemClick?.(node.id);
    }
  };

  const handleItemToggleKeyDown = (
    event: React.KeyboardEvent<HTMLDivElement>,
  ) => {
    if (event.code === 'Enter' || event.code === 'Space') {
      event.preventDefault();
      event.stopPropagation();

      handleToggleNode?.(node.id);
    }
  };

  const renderRafterIcon = (expanded: boolean) => {
    const RafterComponent = expanded ? IconRafterDown : IconRafterRight;
    return (
      <RafterComponent
        title={t('foldUnfold')}
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
            aria-label={t('foldUnfold')}
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
              <IconFolder title={t('folder')} width={20} height={20} />
            )}
            <span className="text-truncate">{node.name}</span>
          </div>
          {node.section && handleItemAction && (
            <button
              className="tree-btn mx-8"
              onClick={() => handleOnCreateChildrenPage(node.id)}
            >
              <IconPlus height={16} width={16} />
            </button>
          )}
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
