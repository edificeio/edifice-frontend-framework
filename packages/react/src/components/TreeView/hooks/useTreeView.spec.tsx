import { createRef } from 'react';
import { act, renderHook } from '~/setup';
import { TreeData } from '../../../types';
import { TreeViewHandlers_V1 } from '../TreeView';
import { useTreeView } from './useTreeView';

// a
// └── a1
// b
function makeNodes(): TreeData[] {
  return [
    { id: 'a', name: 'A', children: [{ id: 'a1', name: 'A1' }] },
    { id: 'b', name: 'B' },
  ];
}

type Params = Parameters<typeof useTreeView>[0];

function setup(props: Partial<Params> = {}) {
  const onTreeItemUnfold = vi.fn();
  const onTreeItemFold = vi.fn();
  const onTreeItemClick = vi.fn();
  const ref = createRef<TreeViewHandlers_V1>();
  // Stable identity: the sibling-scanning effect depends on it.
  const data = props.data ?? makeNodes();

  const { result, rerender } = renderHook(() =>
    useTreeView({
      externalSelectedNodeId: undefined,
      onTreeItemUnfold,
      onTreeItemFold,
      onTreeItemClick,
      ...props,
      data,
      ref,
    }),
  );

  return {
    result,
    rerender,
    ref,
    onTreeItemUnfold,
    onTreeItemFold,
    onTreeItemClick,
  };
}

const expanded = (result: { current: ReturnType<typeof useTreeView> }) =>
  Array.from(result.current.expandedNodes);

describe('useTreeView', () => {
  it('starts with nothing selected, nothing expanded and nothing dragged', () => {
    const { result } = setup();

    expect(result.current.selectedNodeId).toBeUndefined();
    expect(expanded(result)).toEqual([]);
    expect(result.current.draggedNodeId).toBeUndefined();
  });

  describe('handleItemClick', () => {
    it('selects the node, expands its path and notifies the parent', () => {
      const { result, onTreeItemClick, onTreeItemUnfold } = setup();

      act(() => result.current.handleItemClick('a1'));

      expect(result.current.selectedNodeId).toBe('a1');
      expect(expanded(result)).toEqual(['a', 'a1']);
      expect(onTreeItemClick).toHaveBeenCalledWith('a1');
      expect(onTreeItemUnfold).toHaveBeenCalledWith('a');
    });

    it('re-clicking the selected node keeps it selected', () => {
      const { result } = setup();

      act(() => result.current.handleItemClick('b'));
      act(() => result.current.handleItemClick('b'));

      expect(result.current.selectedNodeId).toBe('b');
    });
  });

  describe('handleFoldUnfold', () => {
    it('expands a collapsed node', () => {
      const { result } = setup();

      act(() => result.current.handleFoldUnfold('a'));

      expect(expanded(result)).toEqual(['a']);
    });

    it('collapses an expanded node and folds back the remaining ones', () => {
      const { result, onTreeItemFold } = setup();

      act(() => result.current.handleItemClick('a1'));
      act(() => result.current.handleFoldUnfold('a1'));

      expect(expanded(result)).toEqual(['a']);
      expect(onTreeItemFold).toHaveBeenCalledWith('a');
    });
  });

  describe('allExpandedNodes', () => {
    it('expands every first-level node on mount', () => {
      const { result } = setup({ allExpandedNodes: true });

      expect(expanded(result)).toEqual(['a', 'b']);
    });

    it('leaves a single root node collapsed', () => {
      const data: TreeData = {
        id: 'root',
        name: 'Root',
        children: makeNodes(),
      };

      const { result } = setup({ data, allExpandedNodes: true });

      expect(expanded(result)).toEqual([]);
    });
  });

  describe('externalSelectedNodeId', () => {
    it('selects and expands the path of an existing node', () => {
      const { result, onTreeItemUnfold } = setup({
        externalSelectedNodeId: 'a1',
      });

      expect(result.current.selectedNodeId).toBe('a1');
      expect(expanded(result)).toEqual(['a', 'a1']);
      expect(onTreeItemUnfold).toHaveBeenCalledWith('a1');
    });

    it('still reports an unknown node as selected but expands nothing', () => {
      const { result } = setup({ externalSelectedNodeId: 'ghost' });

      expect(result.current.selectedNodeId).toBe('ghost');
      expect(expanded(result)).toEqual([]);
    });

    it('is ignored while every node is expanded', () => {
      const { result } = setup({
        externalSelectedNodeId: 'a1',
        allExpandedNodes: true,
      });

      expect(expanded(result)).toEqual(['a', 'b']);
    });
  });

  describe('imperative handlers', () => {
    it('selects a node through the ref', () => {
      const { result, ref, onTreeItemClick } = setup();

      act(() => ref.current?.select('a1'));

      expect(result.current.selectedNodeId).toBe('a1');
      expect(expanded(result)).toEqual(['a', 'a1']);
      expect(onTreeItemClick).toHaveBeenCalledWith('a1');
    });

    it('unselects everything through the ref, falling back to the prop', () => {
      const { result, ref } = setup({ externalSelectedNodeId: 'b' });

      act(() => result.current.handleItemClick('a1'));
      expect(result.current.selectedNodeId).toBe('a1');

      act(() => ref.current?.unselectAll());

      expect(result.current.selectedNodeId).toBe('b');
    });

    it('expands every first-level node through the ref', () => {
      const { result, ref } = setup({ allExpandedNodes: true });

      act(() => result.current.handleFoldUnfold('a'));
      expect(expanded(result)).toEqual(['b']);

      act(() =>
        (
          ref.current as unknown as { allExpandedNodes: () => void }
        ).allExpandedNodes(),
      );

      expect(expanded(result)).toEqual(['a', 'b']);
    });
  });

  describe('siblingsNodes', () => {
    it('collects the nodes whose siblings have children, from a single root', () => {
      const data: TreeData = {
        id: 'root',
        name: 'Root',
        children: [
          { id: 'c1', name: 'C1', children: [{ id: 'g1', name: 'G1' }] },
          { id: 'c2', name: 'C2' },
        ],
      };

      const { result } = setup({ data });

      expect(Array.from(result.current.siblingsNodes.current)).toEqual(['c2']);
    });

    // The array branch builds its result set but never commits it to the ref.
    it('stays empty when the data is an array of roots', () => {
      const { result } = setup();

      expect(Array.from(result.current.siblingsNodes.current)).toEqual([]);
    });
  });

  describe('draggedNode', () => {
    it('expands the hovered node when a drag enters it', () => {
      const data = makeNodes();
      const onTreeItemUnfold = vi.fn();
      const ref = createRef<TreeViewHandlers_V1>();
      type Props = { draggedNode?: Params['draggedNode'] };

      const { result, rerender } = renderHook(
        ({ draggedNode }: Props) =>
          useTreeView({
            data,
            ref,
            externalSelectedNodeId: 'a1',
            draggedNode,
            onTreeItemUnfold,
          }),
        { initialProps: {} as Props },
      );

      expect(Array.from(result.current.expandedNodes)).toEqual(['a', 'a1']);

      rerender({
        draggedNode: { isOver: true, overId: 'b', isTreeview: true },
      });

      expect(result.current.draggedNodeId).toBe('b');
      expect(Array.from(result.current.expandedNodes)).toEqual([
        'a',
        'a1',
        'b',
      ]);
      expect(onTreeItemUnfold).toHaveBeenCalledWith('b');
    });

    it('clears the dragged node when the pointer leaves the tree', () => {
      const { result } = setup({
        externalSelectedNodeId: 'a1',
        draggedNode: { isOver: false, overId: 'b', isTreeview: true },
      });

      expect(result.current.draggedNodeId).toBeUndefined();
    });

    it('ignores a drag coming from outside the treeview', () => {
      const { result } = setup({
        externalSelectedNodeId: 'a1',
        draggedNode: { isOver: true, overId: 'b', isTreeview: false },
      });

      expect(result.current.draggedNodeId).toBeUndefined();
    });

    it('tracks the hovered node even when the selected node is unknown', () => {
      const { result } = setup({
        externalSelectedNodeId: 'ghost',
        draggedNode: { isOver: true, overId: 'b', isTreeview: true },
      });

      expect(result.current.draggedNodeId).toBe('b');
      expect(expanded(result)).toEqual([]);
    });
  });
});
