import { FOLDER, IFolder } from '@edifice.io/client';
import { TreeItem } from '../types';
import {
  addNode,
  arrayUnique,
  deleteNode,
  findNodeById,
  findParentNode,
  findPathById,
  getAncestors,
  getChildrenIds,
  hasChildren,
  modifyNode,
  moveNode,
  TreeNodeFolderWrapper,
  updateNode,
  wrapTreeNode,
} from './tree';

function makeFolder(partial: Partial<IFolder> & { id: string }): IFolder {
  return {
    parentId: '',
    name: `folder-${partial.id}`,
    type: 'FOLDER',
    childNumber: 0,
    trashed: false,
    rights: [],
    ancestors: [],
    ...partial,
  } as IFolder;
}

// root
// ├── a
// │   └── a1
// └── b
function makeTree(): TreeItem {
  return {
    id: 'root',
    name: 'Root',
    children: [
      {
        id: 'a',
        name: 'A',
        children: [{ id: 'a1', name: 'A1' }],
      },
      { id: 'b', name: 'B' },
    ],
  };
}

describe('Tree utilities', () => {
  describe('findNodeById', () => {
    it('finds a nested node from a single root', () => {
      expect(findNodeById(makeTree(), 'a1')?.name).toBe('A1');
    });

    it('finds a node from an array of roots', () => {
      const forest: TreeItem[] = [
        { id: 'r1', name: 'R1' },
        { id: 'r2', name: 'R2', children: [{ id: 'r2a', name: 'R2A' }] },
      ];

      expect(findNodeById(forest, 'r2a')?.name).toBe('R2A');
    });

    it('returns undefined when no node matches', () => {
      expect(findNodeById(makeTree(), 'nope')).toBeUndefined();
    });
  });

  describe('getChildrenIds', () => {
    it('returns the folder children ids plus the folder itself', () => {
      const data: TreeItem[] = [
        {
          id: 'f1',
          name: 'F1',
          folder: { childrenIds: ['c1', 'c2'] },
        },
      ];

      expect(getChildrenIds(data, 'f1')).toEqual(['c1', 'c2', 'f1']);
    });

    it('returns the bin alone when asking for the bin', () => {
      expect(getChildrenIds([], FOLDER.BIN)).toEqual([FOLDER.BIN]);
    });

    it('falls back to the default folder for an unknown id', () => {
      expect(getChildrenIds([], 'unknown')).toEqual([FOLDER.DEFAULT]);
    });
  });

  describe('getAncestors', () => {
    it('returns the folder ancestors plus the folder itself', () => {
      const data: TreeItem[] = [
        { id: 'f1', name: 'F1', folder: { ancestors: ['root', 'mid'] } },
      ];

      expect(getAncestors(data, 'f1')).toEqual(['root', 'mid', 'f1']);
    });

    it('returns the bin alone when asking for the bin', () => {
      expect(getAncestors([], FOLDER.BIN)).toEqual([FOLDER.BIN]);
    });

    it('falls back to the default folder for an unknown id', () => {
      expect(getAncestors([], 'unknown')).toEqual([FOLDER.DEFAULT]);
    });
  });

  describe('arrayUnique', () => {
    it('keeps the first occurrence of each item', () => {
      expect(arrayUnique(['a', 'b', 'a', 'c', 'b'])).toEqual(['a', 'b', 'c']);
    });

    it('returns an empty array unchanged', () => {
      expect(arrayUnique([])).toEqual([]);
    });
  });

  describe('addNode', () => {
    it('appends a wrapped folder under the target parent', () => {
      const result = addNode(makeTree(), {
        parentId: 'a',
        newFolder: makeFolder({ id: 'a2', name: 'A2' }),
      });

      const parent = findNodeById(result, 'a');
      expect(parent?.children?.map(({ id }) => id)).toEqual(['a1', 'a2']);
    });

    it('derives the new folder ancestors from its parent', () => {
      const tree: TreeItem = {
        id: 'root',
        name: 'Root',
        folder: { ancestors: ['grand'] },
        children: [],
      };

      const result = addNode(tree, {
        parentId: 'root',
        newFolder: makeFolder({ id: 'child' }),
      });

      expect(findNodeById(result, 'child')?.folder.ancestors).toEqual([
        'grand',
        'root',
      ]);
    });

    it('leaves the tree untouched when the parent is missing', () => {
      const tree = makeTree();

      expect(
        addNode(tree, {
          parentId: 'ghost',
          newFolder: makeFolder({ id: 'x' }),
        }),
      ).toEqual(tree);
    });
  });

  describe('deleteNode', () => {
    it('removes every listed node', () => {
      const result = deleteNode(makeTree(), { folders: ['a1', 'b'] });

      expect(findNodeById(result, 'a1')).toBeUndefined();
      expect(findNodeById(result, 'b')).toBeUndefined();
      expect(findNodeById(result, 'a')?.name).toBe('A');
    });

    it('keeps the root even when it is listed, since a root cannot be dropped', () => {
      const tree = makeTree();

      expect(deleteNode(tree, { folders: ['root'] })).toEqual(tree);
    });
  });

  describe('findParentNode', () => {
    it('returns the direct parent of a node', () => {
      expect(findParentNode(makeTree(), 'a1')?.id).toBe('a');
    });

    it('returns the root when the child is a first-level node', () => {
      expect(findParentNode(makeTree(), 'b')?.id).toBe('root');
    });

    it('returns undefined for an unknown child', () => {
      expect(findParentNode(makeTree(), 'ghost')).toBeUndefined();
    });
  });

  describe('hasChildren', () => {
    it('is true for a node holding children', () => {
      expect(hasChildren('root', makeTree())).toBe(true);
    });

    it('is false for a node declaring an empty children array', () => {
      expect(
        hasChildren('root', { id: 'root', name: 'Root', children: [] }),
      ).toBe(false);
    });

    it('is false for a leaf', () => {
      expect(hasChildren('leaf', { id: 'leaf', name: 'Leaf' })).toBe(false);
    });

    it('is true for a nested id holding children', () => {
      expect(hasChildren('a', makeTree())).toBe(true);
    });
  });

  describe('modifyNode', () => {
    it('applies the callback to every node', () => {
      const result = modifyNode(makeTree(), (node) => ({
        ...node,
        name: node.name.toUpperCase(),
      }));

      expect(findNodeById(result, 'a1')?.name).toBe('A1');
      expect(findNodeById(result, 'root')?.name).toBe('ROOT');
    });

    it('drops the nodes for which the callback returns undefined', () => {
      const result = modifyNode(makeTree(), (node) =>
        node.id === 'a' ? undefined : node,
      );

      expect(result.children?.map(({ id }) => id)).toEqual(['b']);
    });

    it('returns the original node when the callback drops the root', () => {
      const tree = makeTree();

      expect(modifyNode(tree, () => undefined)).toEqual(tree);
    });

    it('exposes the parent to the callback', () => {
      const parents: Array<string | undefined> = [];

      modifyNode(makeTree(), (node, parent) => {
        parents.push(parent?.id);
        return node;
      });

      expect(parents).toEqual([undefined, 'root', 'a', 'root']);
    });
  });

  describe('moveNode', () => {
    it('re-parents a descendant of the destination and updates its ancestors', () => {
      // root ── b ── c ── d ; moving d directly under b
      const tree: TreeItem = {
        id: 'root',
        name: 'Root',
        children: [
          {
            id: 'b',
            name: 'B',
            folder: { ancestors: ['root'] },
            children: [
              { id: 'c', name: 'C', children: [{ id: 'd', name: 'D' }] },
            ],
          },
        ],
      };

      const result = moveNode(tree, { destinationId: 'b', folders: ['d'] });

      const b = findNodeById(result, 'b');
      expect(b?.children?.map(({ id }) => id)).toEqual(['c', 'd']);
      expect(findNodeById(result, 'c')?.children ?? []).toEqual([]);
      expect(b?.children?.[1].folder.ancestors).toEqual(['root', 'b']);
    });

    // The destination lookup is scoped to the destination subtree, so a node
    // living elsewhere is removed from its original position without being
    // re-attached.
    it('removes a node moved from outside the destination subtree', () => {
      const result = moveNode(makeTree(), {
        destinationId: 'b',
        folders: ['a1'],
      });

      expect(findNodeById(result, 'a1')).toBeUndefined();
      expect(findNodeById(result, 'b')?.children ?? []).toEqual([]);
    });

    it('keeps a node already sitting in the destination children', () => {
      const result = moveNode(makeTree(), {
        destinationId: 'a',
        folders: ['a1'],
      });

      expect(findNodeById(result, 'a')?.children?.map(({ id }) => id)).toEqual([
        'a1',
      ]);
    });
  });

  describe('wrapTreeNode', () => {
    it('replaces the children of the target node with wrapped folders', () => {
      const folders = [makeFolder({ id: 'f1' }), makeFolder({ id: 'f2' })];

      const result = wrapTreeNode(makeTree(), folders, 'b');

      const b = findNodeById(result, 'b');
      expect(b?.children?.map(({ id }) => id)).toEqual(['f1', 'f2']);
      expect(b?.children?.[0]).toBeInstanceOf(TreeNodeFolderWrapper);
    });

    it('accepts an undefined folder list', () => {
      const result = wrapTreeNode(makeTree(), undefined, 'b');

      expect(findNodeById(result, 'b')?.children).toBeUndefined();
    });
  });

  describe('updateNode', () => {
    it('swaps the matching node for a wrapper around the new folder', () => {
      const result = updateNode(makeTree(), {
        folderId: 'b',
        newFolder: makeFolder({ id: 'b', name: 'B renamed' }),
      });

      const b = findNodeById(result, 'b');
      expect(b?.name).toBe('B renamed');
      expect(b).toBeInstanceOf(TreeNodeFolderWrapper);
    });

    it('leaves the tree untouched for an unknown folder id', () => {
      const tree = makeTree();

      expect(
        updateNode(tree, {
          folderId: 'ghost',
          newFolder: makeFolder({ id: 'ghost' }),
        }),
      ).toEqual(tree);
    });
  });

  describe('findPathById', () => {
    it('returns the path from the root down to the node', () => {
      expect(findPathById(makeTree(), 'a1')).toEqual(['root', 'a', 'a1']);
    });

    it('returns the node alone when it is the root', () => {
      expect(findPathById(makeTree(), 'root')).toEqual(['root']);
    });

    it('walks an array of roots and stops on the first match', () => {
      const forest: TreeItem[] = [
        { id: 'r1', name: 'R1' },
        { id: 'r2', name: 'R2', children: [{ id: 'r2a', name: 'R2A' }] },
      ];

      expect(findPathById(forest, 'r2a')).toEqual(['r2', 'r2a']);
    });

    it('returns an empty path for an unknown node', () => {
      expect(findPathById(makeTree(), 'ghost')).toEqual([]);
    });
  });

  describe('TreeNodeFolderWrapper', () => {
    it('exposes the folder identity and defaults to a childless section-less node', () => {
      const wrapper = new TreeNodeFolderWrapper(
        makeFolder({ id: 'f1', name: 'F1', childNumber: 3 }),
      );

      expect(wrapper.id).toBe('f1');
      expect(wrapper.name).toBe('F1');
      expect(wrapper.childNumber).toBe(3);
      expect(wrapper.section).toBe(false);
      expect(wrapper.children).toEqual([]);
    });
  });
});
