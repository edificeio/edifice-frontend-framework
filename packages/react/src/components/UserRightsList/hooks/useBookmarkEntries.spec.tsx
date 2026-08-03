import { act, renderHook } from '~/setup';
import { SharingItem } from '../../../types';
import {
  BookmarkInput,
  ResourceRightName,
  ResourceRights,
} from '../types/types';
import { useBookmarkEntries } from './useBookmarkEntries';

const resourceRights: ResourceRights = {
  read: { priority: 0, default: true, requires: [], excludes: [] },
  contrib: { priority: 1, default: false, requires: ['read'], excludes: [] },
};

function bookmark(
  id: string,
  users: { id: string; displayName: string }[] = [
    { id: `${id}-user-1`, displayName: 'User 1' },
  ],
): BookmarkInput {
  return { id, name: `Bookmark ${id}`, users };
}

function setup({
  existingRecipientIds = new Set<string>(),
}: { existingRecipientIds?: Set<string> } = {}) {
  const addItems = vi.fn();
  const deleteItemsByIds = vi.fn();
  const applyRightToIds = vi.fn();
  const toggleRight = (item: SharingItem, rightName: ResourceRightName) => ({
    ...item,
    permission: item.permission.includes(rightName)
      ? item.permission.filter((right) => right !== rightName)
      : [...item.permission, rightName],
  });

  return {
    ...renderHook(() =>
      useBookmarkEntries({
        resourceRights,
        existingRecipientIds,
        toggleRight,
        addItems,
        deleteItemsByIds,
        applyRightToIds,
      }),
    ),
    addItems,
    deleteItemsByIds,
    applyRightToIds,
  };
}

const entryIds = (entries: { id: string }[]) => entries.map(({ id }) => id);

describe('useBookmarkEntries', () => {
  it('starts without any bookmark', () => {
    const { result } = setup();

    expect(result.current.bookmarkEntries).toEqual([]);
    expect(result.current.bookmarkUserIds.size).toBe(0);
  });

  describe('addBookmark', () => {
    it('registers the bookmark with the default rights and shares its users', async () => {
      const { result, addItems } = setup();

      await act(() => result.current.addBookmark(bookmark('b1')));

      expect(result.current.bookmarkEntries[0]).toMatchObject({
        id: 'b1',
        name: 'Bookmark b1',
        permission: ['read'],
        isExpanded: false,
      });
      expect(addItems).toHaveBeenCalledWith([
        expect.objectContaining({
          recipientId: 'b1-user-1',
          permission: ['read'],
        }),
      ]);
      expect(Array.from(result.current.bookmarkUserIds)).toEqual(['b1-user-1']);
    });

    it('ignores a bookmark already registered', async () => {
      const { result, addItems } = setup();

      await act(() => result.current.addBookmark(bookmark('b1')));
      addItems.mockClear();
      await act(() => result.current.addBookmark(bookmark('b1')));

      expect(result.current.bookmarkEntries).toHaveLength(1);
      expect(addItems).not.toHaveBeenCalled();
    });

    it('skips the users already shared with', async () => {
      const { result, addItems } = setup({
        existingRecipientIds: new Set(['known-user']),
      });

      await act(() =>
        result.current.addBookmark(
          bookmark('b1', [
            { id: 'known-user', displayName: 'Known' },
            { id: 'new-user', displayName: 'New' },
          ]),
        ),
      );

      expect(addItems).toHaveBeenCalledWith([
        expect.objectContaining({ recipientId: 'new-user' }),
      ]);
      expect(result.current.bookmarkEntries[0].userIds).toEqual(['new-user']);
    });
  });

  describe('deleteBookmark', () => {
    it('removes the bookmark and unshares its users', async () => {
      const { result, deleteItemsByIds } = setup();

      await act(() => result.current.addBookmark(bookmark('b1')));
      await act(() => result.current.deleteBookmark('b1'));

      expect(result.current.bookmarkEntries).toEqual([]);
      expect(deleteItemsByIds).toHaveBeenCalledWith(new Set(['b1-user-1']));
    });

    it('ignores an unknown bookmark', async () => {
      const { result, deleteItemsByIds } = setup();

      await act(() => result.current.addBookmark(bookmark('b1')));
      await act(() => result.current.deleteBookmark('ghost'));

      expect(entryIds(result.current.bookmarkEntries)).toEqual(['b1']);
      expect(deleteItemsByIds).not.toHaveBeenCalled();
    });
  });

  describe('toggleBookmarkRight', () => {
    it('grants the right on the row and on every user of the bookmark', async () => {
      const { result, applyRightToIds } = setup();

      await act(() => result.current.addBookmark(bookmark('b1')));
      await act(() => result.current.toggleBookmarkRight('b1', 'contrib'));

      expect(result.current.bookmarkEntries[0].permission).toContain('contrib');
      expect(applyRightToIds).toHaveBeenCalledWith(
        new Set(['b1-user-1']),
        'contrib',
        true,
      );
    });

    it('revokes a right already granted', async () => {
      const { result, applyRightToIds } = setup();

      await act(() => result.current.addBookmark(bookmark('b1')));
      await act(() => result.current.toggleBookmarkRight('b1', 'read'));

      expect(result.current.bookmarkEntries[0].permission).not.toContain(
        'read',
      );
      expect(applyRightToIds).toHaveBeenCalledWith(
        new Set(['b1-user-1']),
        'read',
        false,
      );
    });

    it('leaves the other bookmarks alone', async () => {
      const { result } = setup();

      await act(() => result.current.addBookmark(bookmark('b1')));
      await act(() => result.current.addBookmark(bookmark('b2')));
      await act(() => result.current.toggleBookmarkRight('b2', 'contrib'));

      expect(result.current.bookmarkEntries[0].permission).not.toContain(
        'contrib',
      );
      expect(result.current.bookmarkEntries[1].permission).toContain('contrib');
    });

    it('ignores an unknown bookmark', async () => {
      const { result, applyRightToIds } = setup();

      await act(() => result.current.addBookmark(bookmark('b1')));
      await act(() => result.current.toggleBookmarkRight('ghost', 'contrib'));

      expect(result.current.bookmarkEntries[0].permission).toEqual(['read']);
      expect(applyRightToIds).not.toHaveBeenCalled();
    });
  });

  describe('toggleExpand', () => {
    it('opens and closes a bookmark row', async () => {
      const { result } = setup();

      await act(() => result.current.addBookmark(bookmark('b1')));
      await act(() => result.current.toggleExpand('b1'));
      expect(result.current.bookmarkEntries[0].isExpanded).toBe(true);

      await act(() => result.current.toggleExpand('b1'));
      expect(result.current.bookmarkEntries[0].isExpanded).toBe(false);
    });

    it('leaves the other bookmarks collapsed', async () => {
      const { result } = setup();

      await act(() => result.current.addBookmark(bookmark('b1')));
      await act(() => result.current.addBookmark(bookmark('b2')));
      await act(() => result.current.toggleExpand('b2'));

      expect(result.current.bookmarkEntries[0].isExpanded).toBe(false);
      expect(result.current.bookmarkEntries[1].isExpanded).toBe(true);
    });
  });
});
