import { FOLDER, IFolder } from '@edifice.io/client';
import { TreeData } from '../../../types';
import {
  addNode,
  arrayUnique,
  deleteNode,
  findNodeById,
  findParentNode,
  findPathById,
  findTreeNode,
  getAncestors,
  hasChildren,
  modifyNode,
  moveNode,
  TreeNodeFolderWrapper,
  updateNode,
  wrapTreeNode,
} from './treeview';

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
function makeTree(): TreeData {
  return {
    id: 'root',
    name: 'Root',
    children: [
      { id: 'a', name: 'A', children: [{ id: 'a1', name: 'A1' }] },
      { id: 'b', name: 'B' },
    ],
  };
}

describe('TreeView utilities', () => {
  describe('findTreeNode', () => {
    it('returns the root when the predicate matches it', () => {
      expect(findTreeNode(makeTree(), ({ id }) => id === 'root')?.name).toBe(
        'Root',
      );
    });

    it('walks the children depth-first', () => {
      expect(findTreeNode(makeTree(), ({ id }) => id === 'a1')?.name).toBe(
        'A1',
      );
    });

    it('returns undefined when nothing matches', () => {
      expect(findTreeNode(makeTree(), () => false)).toBeUndefined();
    });

    it('returns the first node satisfying a non-id predicate', () => {
      expect(findTreeNode(makeTree(), (node) => !node.children)?.id).toBe('a1');
    });
  });

  describe('findNodeById', () => {
    it('finds a nested node from a single root', () => {
      expect(findNodeById(makeTree(), 'a1')?.name).toBe('A1');
    });

    it('finds a node from an array of roots', () => {
      const forest: TreeData[] = [
        { id: 'r1', name: 'R1' },
        { id: 'r2', name: 'R2', children: [{ id: 'r2a', name: 'R2A' }] },
      ];

      expect(findNodeById(forest, 'r2a')?.name).toBe('R2A');
    });

    it('returns undefined when no node matches', () => {
      expect(findNodeById(makeTree(), 'nope')).toBeUndefined();
    });
  });

  describe('getAncestors', () => {
    it('returns the folder ancestors plus the folder itself', () => {
      const data: TreeData = {
        id: 'root',
        name: 'Root',
        children: [
          { id: 'f1', name: 'F1', folder: { ancestors: ['root', 'mid'] } },
        ],
      };

      expect(getAncestors(data, 'f1')).toEqual(['root', 'mid', 'f1']);
    });

    it('returns the bin alone when asking for the bin', () => {
      expect(getAncestors(makeTree(), FOLDER.BIN)).toEqual([FOLDER.BIN]);
    });

    it('falls back to the default folder for an unknown id', () => {
      expect(getAncestors(makeTree(), 'unknown')).toEqual([FOLDER.DEFAULT]);
    });
  });

  describe('arrayUnique', () => {
    it('keeps the first occurrence of each item', () => {
      expect(arrayUnique(['a', 'b', 'a'])).toEqual(['a', 'b']);
    });
  });

  describe('addNode', () => {
    it('appends a wrapped folder under the target parent', () => {
      const result = addNode(makeTree(), {
        parentId: 'a',
        newFolder: makeFolder({ id: 'a2', name: 'A2' }),
      });

      expect(findNodeById(result, 'a')?.children?.map(({ id }) => id)).toEqual([
        'a1',
        'a2',
      ]);
    });

    it('derives the new folder ancestors from its parent', () => {
      const tree: TreeData = {
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

    // Same quirk as the Tree flavour: the recursive call forwards the parent id.
    it('is false for a nested id, because the lookup only matches the traversal root', () => {
      expect(hasChildren('a', makeTree())).toBe(false);
    });
  });

  describe('modifyNode', () => {
    it('applies the callback to every node', () => {
      const result = modifyNode(makeTree(), (node) => ({
        ...node,
        name: node.name.toLowerCase(),
      }));

      expect(findNodeById(result, 'root')?.name).toBe('root');
      expect(findNodeById(result, 'a1')?.name).toBe('a1');
    });

    it('drops the nodes for which the callback returns undefined', () => {
      const result = modifyNode(makeTree(), (node) =>
        node.id === 'b' ? undefined : node,
      );

      expect(result.children?.map(({ id }) => id)).toEqual(['a']);
    });

    it('returns the original node when the callback drops the root', () => {
      const tree = makeTree();

      expect(modifyNode(tree, () => undefined)).toEqual(tree);
    });
  });

  describe('moveNode', () => {
    it('re-parents a descendant of the destination and updates its ancestors', () => {
      const tree: TreeData = {
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

    it('removes a node moved from outside the destination subtree', () => {
      const result = moveNode(makeTree(), {
        destinationId: 'b',
        folders: ['a1'],
      });

      expect(findNodeById(result, 'a1')).toBeUndefined();
      expect(findNodeById(result, 'b')?.children ?? []).toEqual([]);
    });
  });

  describe('wrapTreeNode', () => {
    it('replaces the children of the target node with wrapped folders', () => {
      const result = wrapTreeNode(
        makeTree(),
        [makeFolder({ id: 'f1' }), makeFolder({ id: 'f2' })],
        'b',
      );

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

      expect(findNodeById(result, 'b')?.name).toBe('B renamed');
      expect(findNodeById(result, 'b')).toBeInstanceOf(TreeNodeFolderWrapper);
    });
  });

  describe('findPathById', () => {
    it('returns the path from the root down to the node', () => {
      expect(findPathById(makeTree(), 'a1')).toEqual(['root', 'a', 'a1']);
    });

    it('walks an array of roots and stops on the first match', () => {
      const forest: TreeData[] = [
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
        makeFolder({ id: 'f1', name: 'F1', childNumber: 2 }),
      );

      expect(wrapper.id).toBe('f1');
      expect(wrapper.name).toBe('F1');
      expect(wrapper.childNumber).toBe(2);
      expect(wrapper.section).toBe(false);
      expect(wrapper.children).toEqual([]);
    });
  });
});
