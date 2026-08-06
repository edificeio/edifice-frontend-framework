import { Active, Over } from '@dnd-kit/core';
import { FlattenedItem, Projected, TreeItem } from '../types';
import {
  buildTree,
  determineNewParentId,
  findItemIndexInTree,
  flattenNodes,
  flattenTree,
  generateUpdateData,
  getActiveAndOverNodes,
  getDragDepth,
  getIndicesToUpdate,
  getProjection,
  updateParentIds,
} from './tree-sortable';

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

const asActive = (id: string) => ({ id }) as unknown as Active;
const asOver = (id: string) => ({ id }) as unknown as Over;

describe('Tree sortable utilities', () => {
  describe('getDragDepth', () => {
    it('converts a horizontal offset into a depth step', () => {
      expect(getDragDepth(64, 64)).toBe(1);
      expect(getDragDepth(0, 64)).toBe(0);
    });

    it('rounds to the nearest step', () => {
      expect(getDragDepth(100, 64)).toBe(2);
      expect(getDragDepth(20, 64)).toBe(0);
    });

    it('handles a drag back to the left', () => {
      expect(getDragDepth(-64, 64)).toBe(-1);
    });
  });

  describe('flattenTree', () => {
    it('flattens depth-first with parent ids and depths', () => {
      const flattened = flattenTree(makeNodes(), null);

      expect(
        flattened.map(({ id, parentId, depth }) => ({ id, parentId, depth })),
      ).toEqual([
        { id: 'a', parentId: null, depth: 0 },
        { id: 'a1', parentId: 'a', depth: 1 },
        { id: 'a2', parentId: 'a', depth: 1 },
        { id: 'b', parentId: null, depth: 0 },
      ]);
    });

    it('starts at the given depth and parent', () => {
      const flattened = flattenTree([{ id: 'x', name: 'X' }], 'parent', 3);

      expect(flattened[0]).toMatchObject({
        id: 'x',
        parentId: 'parent',
        depth: 3,
      });
    });

    it('keeps an explicit position and defaults it to undefined otherwise', () => {
      const flattened = flattenTree(
        [
          { id: 'x', name: 'X', position: 7 },
          { id: 'y', name: 'Y' },
        ],
        null,
      );

      expect(flattened[0].position).toBe(7);
      expect(flattened[1].position).toBeUndefined();
    });

    it('returns an empty array for an empty tree', () => {
      expect(flattenTree([], null)).toEqual([]);
    });
  });

  describe('flattenNodes', () => {
    it('includes the children of an expanded node and flags the hierarchy', () => {
      const flattened = flattenNodes(makeNodes(), new Set(['a']));

      expect(
        flattened.map(
          ({ id, isChild, haveChilds, expandNode, parentExpanded }) => ({
            id,
            isChild,
            haveChilds,
            expandNode,
            parentExpanded,
          }),
        ),
      ).toEqual([
        {
          id: 'a',
          isChild: false,
          haveChilds: true,
          expandNode: true,
          parentExpanded: true,
        },
        {
          id: 'a1',
          isChild: true,
          haveChilds: false,
          expandNode: false,
          parentExpanded: true,
        },
        {
          id: 'a2',
          isChild: true,
          haveChilds: false,
          expandNode: false,
          parentExpanded: true,
        },
        {
          id: 'b',
          isChild: false,
          haveChilds: false,
          expandNode: false,
          parentExpanded: true,
        },
      ]);
    });

    it('hides the children of a collapsed node', () => {
      const flattened = flattenNodes(makeNodes(), new Set());

      expect(flattened.map(({ id }) => id)).toEqual(['a', 'b']);
      expect(flattened[0].expandNode).toBe(false);
    });

    it('does not mark a childless node as expanded even when it is in the set', () => {
      const flattened = flattenNodes([{ id: 'b', name: 'B' }], new Set(['b']));

      expect(flattened[0].expandNode).toBe(false);
      expect(flattened[0].haveChilds).toBe(false);
    });

    it('treats an empty children array as no children', () => {
      const flattened = flattenNodes(
        [{ id: 'b', name: 'B', children: [] }],
        new Set(['b']),
      );

      expect(flattened).toHaveLength(1);
      expect(flattened[0].expandNode).toBe(false);
    });
  });

  describe('getActiveAndOverNodes', () => {
    it('resolves both nodes and their indices', () => {
      const tree = flattenTree(makeNodes(), null);

      const { activeNode, activeNodeIndex, overNode, overNodeIndex } =
        getActiveAndOverNodes(tree, 'a1', 'b');

      expect(activeNode.id).toBe('a1');
      expect(activeNodeIndex).toBe(1);
      expect(overNode?.id).toBe('b');
      expect(overNodeIndex).toBe(3);
    });

    it('returns a null over node when no over id is given', () => {
      const tree = flattenTree(makeNodes(), null);

      const { overNode, overNodeIndex } = getActiveAndOverNodes(tree, 'a');

      expect(overNode).toBeNull();
      expect(overNodeIndex).toBe(-1);
    });

    it('returns a null over node for an unknown over id', () => {
      const tree = flattenTree(makeNodes(), null);

      expect(getActiveAndOverNodes(tree, 'a', 'ghost').overNode).toBeNull();
    });
  });

  describe('determineNewParentId', () => {
    const activeNode = { id: 'a1', parentId: 'a', depth: 1 } as FlattenedItem;
    const overNode = { id: 'b', parentId: null, depth: 0 } as FlattenedItem;

    it('trusts the projection at the root depth', () => {
      const projected = {
        depth: 0,
        parentId: null,
        activeId: 'a1',
      } as Projected;

      expect(
        determineNewParentId(
          asActive('a1'),
          asOver('b'),
          activeNode,
          overNode,
          projected,
        ),
      ).toBeNull();
    });

    it('trusts the projection at the first nesting level', () => {
      const projected = {
        depth: 1,
        parentId: 'a',
        activeId: 'a1',
      } as Projected;

      expect(
        determineNewParentId(
          asActive('a1'),
          asOver('b'),
          activeNode,
          overNode,
          projected,
        ),
      ).toBe('a');
    });

    it('adopts the over node parent when the two nodes are not siblings', () => {
      expect(
        determineNewParentId(
          asActive('a1'),
          asOver('b'),
          activeNode,
          overNode,
          null,
        ),
      ).toBeNull();
    });

    it('keeps the active parent when both nodes are siblings', () => {
      const sibling = { id: 'a2', parentId: 'a', depth: 1 } as FlattenedItem;

      expect(
        determineNewParentId(
          asActive('a1'),
          asOver('a2'),
          activeNode,
          sibling,
          null,
        ),
      ).toBe('a');
    });

    it('is undefined when the node is dropped on itself', () => {
      expect(
        determineNewParentId(
          asActive('a1'),
          asOver('a1'),
          activeNode,
          activeNode,
          null,
        ),
      ).toBeUndefined();
    });

    it('is undefined without a projection and without an over node', () => {
      expect(
        determineNewParentId(asActive('a1'), null, activeNode, null, null),
      ).toBeUndefined();
    });
  });

  describe('getIndicesToUpdate', () => {
    it('returns the whole subtree when nesting a node that has children', () => {
      const tree = flattenTree(makeNodes(), null);
      const projected = { depth: 1, parentId: 'a', activeId: 'a' } as Projected;

      expect(getIndicesToUpdate(tree[0], 0, tree, projected)).toEqual([
        0, 1, 2,
      ]);
    });

    it('returns the node alone when it has no children', () => {
      const tree = flattenTree(makeNodes(), null);
      const projected = {
        depth: 1,
        parentId: null,
        activeId: 'b',
      } as Projected;

      expect(getIndicesToUpdate(tree[3], 3, tree, projected)).toEqual([3]);
    });

    it('returns the node alone when the projected depth is not the nesting one', () => {
      const tree = flattenTree(makeNodes(), null);
      const projected = {
        depth: 0,
        parentId: null,
        activeId: 'a',
      } as Projected;

      expect(getIndicesToUpdate(tree[0], 0, tree, projected)).toEqual([0]);
    });

    it('returns the node alone without a projection', () => {
      const tree = flattenTree(makeNodes(), null);

      expect(getIndicesToUpdate(tree[0], 0, tree, null)).toEqual([0]);
    });
  });

  describe('updateParentIds', () => {
    it('rewrites the parent id of the given indices only', () => {
      const tree = flattenTree(makeNodes(), null);

      updateParentIds(tree, [1, 2], 'b');

      expect(tree.map(({ parentId }) => parentId)).toEqual([
        null,
        'b',
        'b',
        null,
      ]);
    });

    it('accepts a null parent to promote a node to the root level', () => {
      const tree = flattenTree(makeNodes(), null);

      updateParentIds(tree, [1], null);

      expect(tree[1].parentId).toBeNull();
    });

    it('does nothing without indices', () => {
      const tree = flattenTree(makeNodes(), null);

      updateParentIds(tree, [], 'b');

      expect(tree[1].parentId).toBe('a');
    });
  });

  describe('findItemIndexInTree', () => {
    it('returns the index of a first-level item', () => {
      expect(findItemIndexInTree(makeNodes(), 'b')).toBe(1);
    });

    it('returns the index of a nested item within its own siblings', () => {
      expect(findItemIndexInTree(makeNodes(), 'a2')).toBe(1);
    });

    // A nested first child resolves to 0, which the caller cannot tell apart
    // from "not found" — both answers collapse onto the same value.
    it('returns 0 for a nested first child as well as for an unknown id', () => {
      expect(findItemIndexInTree(makeNodes(), 'a1')).toBe(0);
      expect(findItemIndexInTree(makeNodes(), 'ghost')).toBe(0);
    });
  });

  describe('generateUpdateData', () => {
    it('numbers the positions depth-first and carries the parent id', () => {
      const nodes = makeNodes();
      const flattened = flattenTree(nodes, null);

      const { updateArray } = generateUpdateData(flattened, nodes);

      expect(
        updateArray.map(({ _id, position, parentId }) => ({
          _id,
          position,
          parentId,
        })),
      ).toEqual([
        { _id: 'a', position: 0, parentId: undefined },
        { _id: 'a1', position: 1, parentId: 'a' },
        { _id: 'a2', position: 2, parentId: 'a' },
        { _id: 'b', position: 3, parentId: undefined },
      ]);
    });

    it('writes the computed positions back into the flattened tree', () => {
      const nodes = makeNodes();
      const flattened = flattenTree(nodes, null);

      const { updatedTreeData } = generateUpdateData(flattened, nodes);

      expect(updatedTreeData.map(({ position }) => position)).toEqual([
        0, 1, 2, 3,
      ]);
      expect(updatedTreeData).toBe(flattened);
    });

    it('forwards the visibility flag', () => {
      const nodes: TreeItem[] = [{ id: 'a', name: 'A', isVisible: false }];

      const { updateArray } = generateUpdateData(
        flattenTree(nodes, null),
        nodes,
      );

      expect(updateArray[0]).toMatchObject({ _id: 'a', isVisible: false });
    });

    it('returns an empty update array for an empty tree', () => {
      expect(generateUpdateData([], []).updateArray).toEqual([]);
    });
  });

  describe('buildTree', () => {
    it('rebuilds the hierarchy from the flattened items', () => {
      const tree = buildTree(flattenTree(makeNodes(), null));

      expect(tree.map(({ id }) => id)).toEqual(['a', 'b']);
      expect(tree[0].children?.map(({ id }) => id)).toEqual(['a1', 'a2']);
      expect(tree[1].children).toEqual([]);
    });

    it('treats an undefined parent id as a root node', () => {
      const tree = buildTree([
        { id: 'a', name: 'A', depth: 0 } as unknown as FlattenedItem,
      ]);

      expect(tree.map(({ id }) => id)).toEqual(['a']);
    });

    it('drops an item whose parent is missing from the flat list', () => {
      const tree = buildTree([
        { id: 'a', name: 'A', parentId: null, depth: 0 } as FlattenedItem,
        {
          id: 'orphan',
          name: 'Orphan',
          parentId: 'ghost',
          depth: 1,
        } as FlattenedItem,
      ]);

      expect(tree.map(({ id }) => id)).toEqual(['a']);
      expect(tree[0].children).toEqual([]);
    });

    it('keeps the position and the visibility of each item', () => {
      const tree = buildTree([
        {
          id: 'a',
          name: 'A',
          parentId: null,
          depth: 0,
          position: 4,
          isVisible: false,
        } as FlattenedItem,
      ]);

      expect(tree[0]).toMatchObject({ position: 4, isVisible: false });
    });
  });

  describe('getProjection', () => {
    it('projects to the root level when the node lands first', () => {
      const items = flattenTree(makeNodes(), null);

      const projection = getProjection(items, 'b', 'a', 0, 64);

      expect(projection.depth).toBe(0);
      expect(projection.parentId).toBeNull();
      expect(projection.activeId).toBe('b');
      expect(projection.previousItem).toBeUndefined();
    });

    it('nests under the previous item when dragged one step to the right', () => {
      const items = flattenTree(makeNodes(), null);

      const projection = getProjection(items, 'b', 'a1', 64, 64);

      expect(projection.depth).toBe(1);
      expect(projection.parentId).toBe('a');
    });

    it('adopts the parent of the previous item when both sit at the same depth', () => {
      const items = flattenTree(makeNodes(), null);

      const projection = getProjection(items, 'b', 'a2', 64, 64);

      expect(projection.depth).toBe(1);
      expect(projection.previousItem.id).toBe('a1');
      expect(projection.parentId).toBe('a');
    });

    it('clamps the depth to the root level when dragged back to the left', () => {
      const items = flattenTree(makeNodes(), null);

      const projection = getProjection(items, 'a1', 'b', -64, 64);

      expect(projection.depth).toBe(0);
      expect(projection.parentId).toBeNull();
    });

    it('never projects deeper than one nesting level', () => {
      const items = flattenTree(makeNodes(), null);

      // Three indentation steps to the right, yet the tree stays two levels deep.
      expect(getProjection(items, 'b', 'a1', 192, 64).depth).toBe(1);
    });
  });
});
