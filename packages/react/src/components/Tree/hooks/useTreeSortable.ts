import {
  Announcements,
  DragEndEvent,
  DragMoveEvent,
  DragOverEvent,
  DragStartEvent,
  DropAnimation,
  KeyboardSensor,
  MeasuringStrategy,
  Modifier,
  PointerSensor,
  UniqueIdentifier,
  defaultDropAnimation,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { arrayMove, sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useEffect, useMemo, useState } from 'react';
import { FlattenedItem, TreeItem, UpdateTreeData } from '../types';
import {
  buildTree,
  determineNewParentId,
  flattenTree,
  generateUpdateData,
  getActiveAndOverNodes,
  getIndicesToUpdate,
  getProjection,
  updateParentIds,
} from '../utilities/tree-sortable';

export const useTreeSortable = ({
  nodes,
  onSortable,
  handleCollapseNode,
}: {
  nodes: TreeItem[];
  onSortable: (updateArray: UpdateTreeData[]) => void;
  handleCollapseNode: (nodeId: string) => void;
}) => {
  const [items, setItems] = useState<TreeItem[]>(() => nodes);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [overId, setOverId] = useState<string | null>(null);
  const [offsetLeft, setOffsetLeft] = useState(0);
  const [currentPosition, setCurrentPosition] = useState<{
    parentId: UniqueIdentifier | null;
    overId: UniqueIdentifier;
  } | null>(null);

  useEffect(() => {
    setItems(nodes);
  }, [nodes]);

  const activationConstraint = {
    delay: 200,
    tolerance: 5,
  };

  const indicator = false;
  const indentationWidth = 64;

  const flattenedTree: FlattenedItem[] = useMemo(
    () => flattenTree(items, null),
    [items],
  );

  const activeItem = activeId
    ? flattenedTree.find(({ id }) => id === activeId)
    : null;

  const projected =
    activeId && overId
      ? getProjection(
          flattenedTree,
          activeId,
          overId,
          offsetLeft,
          indentationWidth,
        )
      : null;

  function handleDragStart(event: DragStartEvent) {
    const { active } = event;

    const { activeNode } = getActiveAndOverNodes(flattenedTree, active.id);

    if (!activeNode.parentId) {
      handleCollapseNode(activeNode.id);
    }

    setActiveId(active.id as unknown as string);
    setOverId(active.id as unknown as string);

    const activeItem = flattenedTree.find(({ id }) => id === activeId);

    if (activeItem) {
      setCurrentPosition({
        parentId: activeItem.parentId,
        overId: activeId as unknown as string,
      });
    }
  }

  function handleDragMove({ delta }: DragMoveEvent) {
    setOffsetLeft(delta.x);
  }

  function handleDragOver(event: DragOverEvent) {
    const { over } = event;

    setOverId(over?.id as unknown as string);
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    const { activeNode, activeNodeIndex, overNode, overNodeIndex } =
      getActiveAndOverNodes(flattenedTree, active.id, over?.id);

    const newParentId = determineNewParentId(
      active,
      over,
      activeNode,
      overNode,
      projected,
    );

    const indicesToUpdate = getIndicesToUpdate(
      activeNode,
      activeNodeIndex,
      flattenedTree,
      projected,
    );

    updateParentIds(flattenedTree, indicesToUpdate, newParentId);

    const updatedFlattenedTree = arrayMove(
      flattenedTree,
      activeNodeIndex,
      overNodeIndex,
    );

    const updatedTree = buildTree(updatedFlattenedTree);

    const { updateArray } = generateUpdateData(
      updatedFlattenedTree,
      updatedTree,
    );

    setItems(updatedTree);
    setActiveId(null);
    setOverId(null);

    onSortable(updateArray as UpdateTreeData[]);
  }

  const sortedIds = useMemo(
    () => flattenedTree.map(({ id }) => id),
    [flattenedTree],
  );

  function getMovementAnnouncement(
    eventName: string,
    activeId: UniqueIdentifier,
    overId?: UniqueIdentifier,
  ) {
    if (overId && projected) {
      if (eventName !== 'onDragEnd') {
        if (
          currentPosition &&
          projected.parentId === currentPosition.parentId &&
          overId === currentPosition.overId
        ) {
          return;
        } else {
          setCurrentPosition({
            parentId: projected.parentId,
            overId,
          });
        }
      }

      const clonedItems: FlattenedItem[] = JSON.parse(
        JSON.stringify(flattenTree(items, null, 0)),
      );
      const overIndex = clonedItems.findIndex(({ id }) => id === overId);
      const activeIndex = clonedItems.findIndex(({ id }) => id === activeId);
      const sortedItems = arrayMove(clonedItems, activeIndex, overIndex);

      const previousItem = sortedItems[overIndex - 1];

      let announcement;
      const movedVerb = eventName === 'onDragEnd' ? 'dropped' : 'moved';
      const nestedVerb = eventName === 'onDragEnd' ? 'dropped' : 'nested';

      if (!previousItem) {
        const nextItem = sortedItems[overIndex + 1];
        if (nextItem) {
          announcement = `${activeId} was ${movedVerb} before ${nextItem.id}.`;
        } else {
          announcement = `${activeId} was ${movedVerb} as the only item in the list.`;
        }
      } else {
        if (projected.depth > previousItem.depth) {
          announcement = `${activeId} was ${nestedVerb} under ${previousItem.id}.`;
        } else {
          let previousSibling: FlattenedItem | undefined = previousItem;
          while (previousSibling && projected.depth < previousSibling.depth) {
            const parentId: UniqueIdentifier | null = previousSibling.parentId;
            previousSibling = sortedItems.find(({ id }) => id === parentId);
          }

          if (previousSibling) {
            announcement = `${activeId} was ${movedVerb} after ${previousSibling.id}.`;
          }
        }
      }

      return announcement;
    }

    return;
  }

  const announcements: Announcements = {
    onDragStart({ active }) {
      return `Picked up ${active.id}.`;
    },
    onDragMove({ active, over }) {
      return getMovementAnnouncement('onDragMove', active.id, over?.id);
    },
    onDragOver({ active, over }) {
      return getMovementAnnouncement('onDragOver', active.id, over?.id);
    },
    onDragEnd({ active, over }) {
      return getMovementAnnouncement('onDragEnd', active.id, over?.id);
    },
    onDragCancel({ active }) {
      return `Moving was cancelled. ${active.id} was dropped in its original position.`;
    },
  };

  const dropAnimationConfig: DropAnimation = {
    keyframes({ transform }) {
      return [
        { opacity: 1, transform: CSS.Transform.toString(transform.initial) },
        {
          opacity: 0,
          transform: CSS.Transform.toString({
            ...transform.final,
            x: transform.final.x + 5,
            y: transform.final.y + 5,
          }),
        },
      ];
    },
    easing: 'ease-out',
    sideEffects({ active }) {
      active.node.animate([{ opacity: 0 }, { opacity: 1 }], {
        duration: defaultDropAnimation.duration,
        easing: defaultDropAnimation.easing,
      });
    },
  };

  const adjustTranslate: Modifier = ({ transform }) => {
    return {
      ...transform,
      y: transform.y - 25,
    };
  };

  const measuring = {
    droppable: {
      strategy: MeasuringStrategy.Always,
    },
  };

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  return {
    handleDragStart,
    handleDragMove,
    handleDragOver,
    handleDragEnd,
    adjustTranslate,
    sortedIds,
    indicator,
    activationConstraint,
    projected,
    announcements,
    activeId,
    indentationWidth,
    activeItem,
    dropAnimationConfig,
    measuring,
    sensors,
    items,
    flattenedTree,
  };
};
