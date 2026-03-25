/**
 * Hook managing bookmark entries in the rights list.
 * A bookmark groups multiple users: batch right toggle, bulk delete,
 * and expand/collapse are handled here. Item mutations are delegated
 * to the sharing items hook via the provided callbacks.
 */
import { useMemo, useState } from 'react';
import { SharingItem } from '../../../types';
import {
  BookmarkInput,
  BookmarkState,
  ResourceRightName,
  ResourceRights,
} from '../types/types';

interface UseBookmarkEntriesParams {
  resourceRights: ResourceRights;
  existingRecipientIds: Set<string>;
  toggleRight: (item: SharingItem, rightName: ResourceRightName) => SharingItem;
  addItems: (items: SharingItem[]) => void;
  deleteItemsByIds: (ids: Set<string>) => void;
  applyRightToIds: (
    ids: Set<string>,
    rightName: ResourceRightName,
    shouldAdd: boolean,
  ) => void;
}

export const useBookmarkEntries = ({
  resourceRights,
  existingRecipientIds,
  toggleRight,
  addItems,
  deleteItemsByIds,
  applyRightToIds,
}: UseBookmarkEntriesParams) => {
  const [bookmarkEntries, setBookmarkEntries] = useState<BookmarkState[]>([]);

  const bookmarkUserIds = useMemo(
    () => new Set(bookmarkEntries.flatMap((entry) => entry.userIds)),
    [bookmarkEntries],
  );

  const getDefaultPermissions = (): string[] =>
    Object.entries(resourceRights)
      .filter(([, definition]) => definition.default)
      .map(([name]) => name);

  /** Converts a BookmarkInput into a BookmarkState and creates SharingItems for its users.
   *  Ignores if bookmark already exists. Skips users already present in the items list. */
  const addBookmark = (bookmark: BookmarkInput) => {
    if (bookmarkEntries.some((entry) => entry.id === bookmark.id)) return;

    const defaultPermissions = getDefaultPermissions();

    // Only include users not already present in the sharing list
    const newBookmarkUsers = bookmark.users.filter(
      (bookmarkUser) => !existingRecipientIds.has(bookmarkUser.id),
    );

    const newUsers: SharingItem[] = newBookmarkUsers.map((bookmarkUser) => ({
      recipientId: bookmarkUser.id,
      recipientType: 'user' as const,
      displayName: bookmarkUser.displayName,
      permission: [...defaultPermissions],
    }));

    const bookmarkState: BookmarkState = {
      id: bookmark.id,
      name: bookmark.name,
      permission: [...defaultPermissions],
      userIds: newBookmarkUsers.map((bookmarkUser) => bookmarkUser.id),
      isExpanded: false,
    };

    setBookmarkEntries((prev) => [...prev, bookmarkState]);
    addItems(newUsers);
  };

  /** Removes a bookmark and deletes all its associated users from the items list. */
  const deleteBookmark = (bookmarkId: string) => {
    const bookmark = bookmarkEntries.find((entry) => entry.id === bookmarkId);
    if (!bookmark) return;

    setBookmarkEntries((prev) =>
      prev.filter((entry) => entry.id !== bookmarkId),
    );
    deleteItemsByIds(new Set(bookmark.userIds));
  };

  /** Toggles a right on the bookmark row and applies the same change to all its users. */
  const toggleBookmarkRight = (
    bookmarkId: string,
    rightName: ResourceRightName,
  ) => {
    const bookmark = bookmarkEntries.find((entry) => entry.id === bookmarkId);
    if (!bookmark) return;

    const hasRight = bookmark.permission.includes(rightName);
    const shouldAdd = !hasRight;

    // Use toggleRight to compute the bookmark's new permission set (with requires/excludes)
    const bookmarkAsSharingItem: SharingItem = {
      recipientId: bookmark.id,
      recipientType: 'bookmark',
      displayName: bookmark.name,
      permission: bookmark.permission,
    };
    const toggledBookmark = toggleRight(bookmarkAsSharingItem, rightName);

    setBookmarkEntries((prev) =>
      prev.map((entry) =>
        entry.id === bookmarkId
          ? { ...entry, permission: toggledBookmark.permission }
          : entry,
      ),
    );

    applyRightToIds(new Set(bookmark.userIds), rightName, shouldAdd);
  };

  /** Toggles the expanded/collapsed state of a bookmark. */
  const toggleExpand = (bookmarkId: string) => {
    setBookmarkEntries((prev) =>
      prev.map((entry) =>
        entry.id === bookmarkId
          ? { ...entry, isExpanded: !entry.isExpanded }
          : entry,
      ),
    );
  };

  return {
    bookmarkEntries,
    bookmarkUserIds,
    addBookmark,
    deleteBookmark,
    toggleBookmarkRight,
    toggleExpand,
  };
};
