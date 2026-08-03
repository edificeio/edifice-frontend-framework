import { act, renderHook } from '~/setup';
import { TreeItem } from '../types';
import { useTree } from './useTree';

// a
// └── a1
// b
function makeNodes(): TreeItem[] {
  return [
    { id: 'a', name: 'A', children: [{ id: 'a1', name: 'A1' }] },
    { id: 'b', name: 'B' },
  ];
}

type Callbacks = {
  onTreeItemUnfold: ReturnType<typeof vi.fn>;
  onTreeItemFold: ReturnType<typeof vi.fn>;
  onTreeItemClick: ReturnType<typeof vi.fn>;
};

// The data identity must stay stable across renders: the expand-all effect
// depends on it, so a fresh array on every render would loop forever.
function setup(
  props: Partial<Parameters<typeof useTree>[0]> = {},
): { result: { current: ReturnType<typeof useTree> } } & Callbacks {
  const callbacks: Callbacks = {
    onTreeItemUnfold: vi.fn(),
    onTreeItemFold: vi.fn(),
    onTreeItemClick: vi.fn(),
  };
  const data = props.data ?? makeNodes();

  const { result } = renderHook(() =>
    useTree({ ...callbacks, ...props, data }),
  );

  return { result, ...callbacks };
}

const expanded = (result: { current: ReturnType<typeof useTree> }) =>
  Array.from(result.current.expandedNodes);

describe('useTree', () => {
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
      expect(onTreeItemUnfold).toHaveBeenCalledWith('a1');
    });

    it('keeps the selection when clicking the already selected node', () => {
      const { result, onTreeItemClick } = setup();

      act(() => result.current.handleItemClick('b'));
      act(() => result.current.handleItemClick('b'));

      expect(result.current.selectedNodeId).toBe('b');
      expect(onTreeItemClick).toHaveBeenCalledTimes(2);
    });

    it('expands a first-level node with its own id only', () => {
      const { result } = setup();

      act(() => result.current.handleItemClick('a'));

      expect(expanded(result)).toEqual(['a']);
    });
  });

  describe('handleFoldUnfold', () => {
    it('expands a collapsed node', () => {
      const { result, onTreeItemUnfold } = setup();

      act(() => result.current.handleFoldUnfold('a'));

      expect(expanded(result)).toEqual(['a']);
      expect(onTreeItemUnfold).toHaveBeenCalledWith('a');
    });

    it('collapses an expanded node without touching its ancestors', () => {
      const { result, onTreeItemFold } = setup();

      act(() => result.current.handleItemClick('a1'));
      act(() => result.current.handleFoldUnfold('a1'));

      expect(expanded(result)).toEqual(['a']);
      // The fold callback fires for the nodes that stay open.
      expect(onTreeItemFold).toHaveBeenCalledWith('a');
      expect(onTreeItemFold).not.toHaveBeenCalledWith('a1');
    });

    it('is a no-op on an unknown node beyond opening nothing', () => {
      const { result } = setup();

      act(() => result.current.handleFoldUnfold('ghost'));

      expect(expanded(result)).toEqual([]);
    });
  });

  describe('handleCollapseNode', () => {
    it('removes a single node from the expanded set', () => {
      const { result } = setup();

      act(() => result.current.handleItemClick('a1'));
      act(() => result.current.handleCollapseNode('a'));

      expect(expanded(result)).toEqual(['a1']);
    });
  });

  describe('shouldExpandAllNodes', () => {
    it('expands every first-level node on mount', () => {
      const { result } = setup({ shouldExpandAllNodes: true });

      expect(expanded(result)).toEqual(['a', 'b']);
    });

    it('ignores the flag when the data is a single root node', () => {
      const data: TreeItem = {
        id: 'root',
        name: 'Root',
        children: makeNodes(),
      };

      const { result } = renderHook(() =>
        useTree({ data, shouldExpandAllNodes: true }),
      );

      expect(Array.from(result.current.expandedNodes)).toEqual([]);
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
      const { result, onTreeItemUnfold } = setup({
        externalSelectedNodeId: 'ghost',
      });

      expect(result.current.selectedNodeId).toBe('ghost');
      expect(expanded(result)).toEqual([]);
      expect(onTreeItemUnfold).not.toHaveBeenCalled();
    });

    it('does not expand the path when every node is already expanded', () => {
      const { result } = setup({
        externalSelectedNodeId: 'a1',
        shouldExpandAllNodes: true,
      });

      expect(result.current.selectedNodeId).toBe('a1');
      expect(expanded(result)).toEqual(['a', 'b']);
    });

    it('only replays the unfold callbacks for the "default" node', () => {
      const nodes: TreeItem[] = [
        { id: 'default', name: 'Default' },
        ...makeNodes(),
      ];
      const onTreeItemUnfold = vi.fn();

      const { result } = renderHook(() =>
        useTree({
          data: nodes,
          externalSelectedNodeId: 'default',
          onTreeItemUnfold,
        }),
      );

      expect(result.current.selectedNodeId).toBe('default');
      expect(Array.from(result.current.expandedNodes)).toEqual([]);
      expect(onTreeItemUnfold).not.toHaveBeenCalled();
    });

    it('drops the internal selection when the prop is cleared', () => {
      const data = makeNodes();

      const { result, rerender } = renderHook(
        ({ externalSelectedNodeId }: { externalSelectedNodeId?: string }) =>
          useTree({ data, externalSelectedNodeId }),
        { initialProps: { externalSelectedNodeId: 'a1' } },
      );

      expect(result.current.selectedNodeId).toBe('a1');

      rerender({ externalSelectedNodeId: undefined });

      expect(result.current.selectedNodeId).toBeUndefined();
    });
  });

  describe('draggedNode', () => {
    it('tracks the node being dragged over the tree', () => {
      const { result } = setup({
        externalSelectedNodeId: 'a1',
        draggedNode: { isOver: true, overId: 'a', isTreeview: true },
      });

      expect(result.current.draggedNodeId).toBe('a');
    });

    it('clears the dragged node when the pointer leaves the tree', () => {
      const { result } = setup({
        externalSelectedNodeId: 'a1',
        draggedNode: { isOver: false, overId: 'a', isTreeview: true },
      });

      expect(result.current.draggedNodeId).toBeUndefined();
    });

    it('ignores a drag coming from outside the treeview', () => {
      const { result } = setup({
        draggedNode: { isOver: true, overId: 'a', isTreeview: false },
      });

      expect(result.current.draggedNodeId).toBeUndefined();
    });

    // Dragging over a node collapses it here, where the TreeView flavour of the
    // hook expands it.
    it('collapses the hovered node when a drag enters it', () => {
      const data = makeNodes();
      const onTreeItemFold = vi.fn();
      type Props = {
        draggedNode?: Parameters<typeof useTree>[0]['draggedNode'];
      };

      const { result, rerender } = renderHook(
        ({ draggedNode }: Props) =>
          useTree({
            data,
            externalSelectedNodeId: 'a1',
            draggedNode,
            onTreeItemFold,
          }),
        { initialProps: {} as Props },
      );

      // The external selection expanded the whole path of 'a1'.
      expect(Array.from(result.current.expandedNodes)).toEqual(['a', 'a1']);

      rerender({
        draggedNode: { isOver: true, overId: 'a1', isTreeview: true },
      });

      expect(result.current.draggedNodeId).toBe('a1');
      expect(Array.from(result.current.expandedNodes)).toEqual(['a']);
      expect(onTreeItemFold).toHaveBeenCalledWith('a');
    });
  });
});
