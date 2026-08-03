import {
  DragEndEvent,
  DragMoveEvent,
  DragOverEvent,
  DragStartEvent,
  MeasuringStrategy,
} from '@dnd-kit/core';
import { act, renderHook } from '~/setup';
import { TreeItem, UpdateTreeData } from '../types';
import { useTreeSortable } from './useTreeSortable';

// a
// ├── a1
// └── a2
// b
function makeNodes(): TreeItem[] {
  return [
    {
      id: 'a',
      name: 'A',
      children: [
        { id: 'a1', name: 'A1' },
        { id: 'a2', name: 'A2' },
      ],
    },
    { id: 'b', name: 'B' },
  ];
}

function setup(nodes: TreeItem[] = makeNodes()) {
  const onSortable = vi.fn();
  const handleCollapseNode = vi.fn();

  // Stable identity: the hook mirrors the prop into its own state on change.
  const { result } = renderHook(() =>
    useTreeSortable({ nodes, onSortable, handleCollapseNode }),
  );

  return { result, onSortable, handleCollapseNode };
}

const dragStart = (id: string) =>
  ({ active: { id } }) as unknown as DragStartEvent;
const dragOver = (id: string) => ({ over: { id } }) as unknown as DragOverEvent;
const dragMove = (x: number) => ({ delta: { x } }) as unknown as DragMoveEvent;
const dragEnd = (activeId: string, overId?: string) =>
  ({
    active: { id: activeId },
    over: overId ? { id: overId } : null,
  }) as unknown as DragEndEvent;

const positions = (updateArray: UpdateTreeData[]) =>
  updateArray.map(({ _id, position, parentId }) => ({
    _id,
    position,
    parentId,
  }));

describe('useTreeSortable', () => {
  describe('initial state', () => {
    it('flattens the nodes and exposes their sorted ids', () => {
      const { result } = setup();

      expect(result.current.items).toEqual(makeNodes());
      expect(result.current.sortedIds).toEqual(['a', 'a1', 'a2', 'b']);
      expect(
        result.current.flattenedTree.map(({ id, depth, parentId }) => ({
          id,
          depth,
          parentId,
        })),
      ).toEqual([
        { id: 'a', depth: 0, parentId: null },
        { id: 'a1', depth: 1, parentId: 'a' },
        { id: 'a2', depth: 1, parentId: 'a' },
        { id: 'b', depth: 0, parentId: null },
      ]);
    });

    it('has nothing active and no projection before a drag', () => {
      const { result } = setup();

      expect(result.current.activeId).toBeNull();
      expect(result.current.activeItem).toBeNull();
      expect(result.current.projected).toBeNull();
    });

    it('exposes the drag-and-drop configuration of the tree', () => {
      const { result } = setup();

      expect(result.current.indentationWidth).toBe(64);
      expect(result.current.indicator).toBe(false);
      expect(result.current.activationConstraint).toEqual({
        delay: 200,
        tolerance: 5,
      });
      expect(result.current.measuring.droppable.strategy).toBe(
        MeasuringStrategy.Always,
      );
      expect(result.current.sensors).toHaveLength(2);
    });

    it('mirrors a new nodes prop into its items', () => {
      const first = makeNodes();
      const second: TreeItem[] = [{ id: 'z', name: 'Z' }];
      const onSortable = vi.fn();
      const handleCollapseNode = vi.fn();

      const { result, rerender } = renderHook(
        ({ nodes }: { nodes: TreeItem[] }) =>
          useTreeSortable({ nodes, onSortable, handleCollapseNode }),
        { initialProps: { nodes: first } },
      );

      expect(result.current.sortedIds).toEqual(['a', 'a1', 'a2', 'b']);

      rerender({ nodes: second });

      expect(result.current.items).toEqual(second);
      expect(result.current.sortedIds).toEqual(['z']);
    });
  });

  describe('handleDragStart', () => {
    it('collapses a first-level node and marks it active', () => {
      const { result, handleCollapseNode } = setup();

      act(() => result.current.handleDragStart(dragStart('a')));

      expect(handleCollapseNode).toHaveBeenCalledWith('a');
      expect(result.current.activeId).toBe('a');
      expect(result.current.activeItem?.id).toBe('a');
    });

    it('does not collapse a nested node', () => {
      const { result, handleCollapseNode } = setup();

      act(() => result.current.handleDragStart(dragStart('a1')));

      expect(handleCollapseNode).not.toHaveBeenCalled();
      expect(result.current.activeId).toBe('a1');
    });
  });

  describe('projection while dragging', () => {
    it('keeps the node at the root level without a horizontal offset', () => {
      const { result } = setup();

      act(() => result.current.handleDragStart(dragStart('a')));
      act(() => result.current.handleDragOver(dragOver('a2')));

      expect(result.current.projected).toMatchObject({
        depth: 0,
        parentId: null,
      });
    });

    it('nests the node after a one-step horizontal offset', () => {
      const { result } = setup();

      act(() => result.current.handleDragStart(dragStart('a')));
      act(() => result.current.handleDragOver(dragOver('a2')));
      act(() => result.current.handleDragMove(dragMove(64)));

      expect(result.current.projected).toMatchObject({
        depth: 1,
        parentId: 'a',
      });
    });
  });

  describe('handleDragEnd', () => {
    it('reorders at the root level and reports every new position', () => {
      const { result, onSortable } = setup();

      act(() => result.current.handleDragStart(dragStart('b')));
      act(() => result.current.handleDragOver(dragOver('a1')));
      act(() => result.current.handleDragEnd(dragEnd('b', 'a1')));

      expect(onSortable).toHaveBeenCalledTimes(1);
      expect(positions(onSortable.mock.calls[0][0])).toEqual([
        { _id: 'a', position: 0, parentId: undefined },
        { _id: 'a1', position: 1, parentId: 'a' },
        { _id: 'a2', position: 2, parentId: 'a' },
        { _id: 'b', position: 3, parentId: undefined },
      ]);
    });

    it('re-parents the dropped node when the drag projects a nesting', () => {
      const { result, onSortable } = setup();

      act(() => result.current.handleDragStart(dragStart('b')));
      act(() => result.current.handleDragOver(dragOver('a1')));
      act(() => result.current.handleDragMove(dragMove(64)));
      act(() => result.current.handleDragEnd(dragEnd('b', 'a1')));

      expect(positions(onSortable.mock.calls[0][0])).toEqual([
        { _id: 'a', position: 0, parentId: undefined },
        { _id: 'b', position: 1, parentId: 'a' },
        { _id: 'a1', position: 2, parentId: 'a' },
        { _id: 'a2', position: 3, parentId: 'a' },
      ]);
    });

    it('clears the drag state once dropped', () => {
      const { result } = setup();

      act(() => result.current.handleDragStart(dragStart('b')));
      act(() => result.current.handleDragEnd(dragEnd('b', 'a1')));

      expect(result.current.activeId).toBeNull();
      expect(result.current.activeItem).toBeNull();
      expect(result.current.projected).toBeNull();
    });
  });

  describe('announcements', () => {
    it('announces the picked up node', () => {
      const { result } = setup();

      expect(
        result.current.announcements.onDragStart?.({
          active: { id: 'b' },
        } as unknown as DragStartEvent),
      ).toBe('Picked up b.');
    });

    it('announces a cancelled move', () => {
      const { result } = setup();

      expect(
        result.current.announcements.onDragCancel?.({
          active: { id: 'b' },
        } as unknown as DragStartEvent),
      ).toBe('Moving was cancelled. b was dropped in its original position.');
    });

    it('announces a nesting while moving', () => {
      const { result } = setup();
      let announcement: string | undefined;

      act(() => result.current.handleDragStart(dragStart('b')));
      act(() => result.current.handleDragOver(dragOver('a1')));
      act(() => result.current.handleDragMove(dragMove(64)));
      act(() => {
        announcement = result.current.announcements.onDragMove?.({
          active: { id: 'b' },
          over: { id: 'a1' },
        } as unknown as DragMoveEvent) as string | undefined;
      });

      expect(announcement).toBe('b was nested under a.');
    });

    it('announces a move after the previous sibling', () => {
      const { result } = setup();
      let announcement: string | undefined;

      act(() => result.current.handleDragStart(dragStart('b')));
      act(() => result.current.handleDragOver(dragOver('a1')));
      act(() => {
        announcement = result.current.announcements.onDragOver?.({
          active: { id: 'b' },
          over: { id: 'a1' },
        } as unknown as DragOverEvent) as string | undefined;
      });

      expect(announcement).toBe('b was moved after a.');
    });

    it('says nothing while no node is being dragged', () => {
      const { result } = setup();

      expect(
        result.current.announcements.onDragMove?.({
          active: { id: 'b' },
          over: { id: 'a1' },
        } as unknown as DragMoveEvent),
      ).toBeUndefined();
    });

    it('says nothing when there is no node under the pointer', () => {
      const { result } = setup();

      act(() => result.current.handleDragStart(dragStart('b')));

      expect(
        result.current.announcements.onDragOver?.({
          active: { id: 'b' },
          over: null,
        } as unknown as DragOverEvent),
      ).toBeUndefined();
    });
  });

  describe('drag presentation', () => {
    it('lifts the drag overlay by 25 pixels', () => {
      const { result } = setup();

      expect(
        result.current.adjustTranslate({
          transform: { x: 10, y: 100, scaleX: 1, scaleY: 1 },
        } as Parameters<typeof result.current.adjustTranslate>[0]),
      ).toEqual({ x: 10, y: 75, scaleX: 1, scaleY: 1 });
    });

    it('fades the dropped node out and re-animates the source node', () => {
      const { result } = setup();
      const animate = vi.fn();
      const transform = {
        initial: { x: 0, y: 0, scaleX: 1, scaleY: 1 },
        final: { x: 10, y: 20, scaleX: 1, scaleY: 1 },
      };

      const keyframes = result.current.dropAnimationConfig.keyframes?.({
        transform,
      } as Parameters<
        NonNullable<typeof result.current.dropAnimationConfig.keyframes>
      >[0]);

      expect(keyframes?.[0]).toMatchObject({ opacity: 1 });
      expect(keyframes?.[1]).toMatchObject({ opacity: 0 });

      result.current.dropAnimationConfig.sideEffects?.({
        active: { node: { animate } },
      } as unknown as Parameters<
        NonNullable<typeof result.current.dropAnimationConfig.sideEffects>
      >[0]);

      expect(animate).toHaveBeenCalledWith(
        [{ opacity: 0 }, { opacity: 1 }],
        expect.objectContaining({ duration: expect.any(Number) }),
      );
    });
  });
});
