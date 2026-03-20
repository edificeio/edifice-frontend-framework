/**
 * Sharing rights list for a resource.
 * Displays the owner, shared users/groups with their permissions,
 * and optionally a block to save the configuration as a bookmark.
 * Supports adding bookmarks which appear as collapsible groups of users.
 */
import { Fragment, forwardRef, useImperativeHandle, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { IconBookmark, IconRafterDown } from '../../modules/icons/components';
import { useEdificeClient } from '../../providers';
import { Button } from '../Button';
import { LoadingScreen } from '../LoadingScreen';
import { SharingItem } from '../UserSearch';
import { VisuallyHidden } from '../VisuallyHidden';
import { useRights } from './hooks/useRights';
import { SaveBookmark } from './SaveBookmark';
import {
  BookmarkInput,
  BookmarkState,
  ResourceRightName,
  ResourceRights,
  isBookmarkInput,
} from './types/types';
import UserRightsBookmarkRow from './UserRightsBookmarkRow';
import UserRightsItem from './UserRightsItem';

interface UserRightsListProps {
  resourceRights: ResourceRights;
  isReadOnly: boolean;
  isLoading: boolean;
  ownerId: string;
  isCreating: boolean;
  initialSharings?: SharingItem[];
  onChange: (value: SharingItem[]) => void;
  onAddItem: (value: SharingItem) => void;
  onDeleteItem: (value: SharingItem) => void;
  onSaveBookmark?: (
    bookmarkName: string,
    items: SharingItem[],
  ) => Promise<void>;
}

interface UserRightsListRef {
  addItem: (item: SharingItem | BookmarkInput) => void;
}

export const UserRightsList = forwardRef<
  UserRightsListRef,
  UserRightsListProps
>(
  (
    {
      resourceRights,
      isReadOnly = true,
      isLoading = false,
      ownerId,
      isCreating = false,
      initialSharings = [],
      onChange,
      onAddItem,
      onDeleteItem,
      onSaveBookmark,
    },
    ref,
  ) => {
    const [items, setItems] = useState<SharingItem[]>(initialSharings ?? []);
    const [bookmarkEntries, setBookmarkEntries] = useState<BookmarkState[]>([]);
    const [showBookmarkInput, setBookmarkInput] = useState<boolean>(false);
    const { t } = useTranslation();
    const { user } = useEdificeClient();
    const { applyRight, toggleRight, getOwnerItem } = useRights(resourceRights);

    const ownerItem = getOwnerItem(ownerId, user, isCreating);

    const bookmarkUserIds = new Set(bookmarkEntries.flatMap((b) => b.userIds));
    const regularItems = items.filter(
      (i) => !bookmarkUserIds.has(i.recipientId),
    );

    const getDefaultPermissions = (): string[] =>
      Object.entries(resourceRights)
        .filter(([, def]) => def.default)
        .map(([name]) => name);

    /** Adds a sharing item or a bookmark to the list. */
    const handleAddItem = (item: SharingItem | BookmarkInput) => {
      if (isBookmarkInput(item)) {
        handleAddBookmark(item);
      } else {
        setItems((prev) => [...prev, item]);
        onAddItem(item);
      }
    };

    /** Adds a bookmark: creates user SharingItems and a BookmarkState entry. */
    const handleAddBookmark = (bookmark: BookmarkInput) => {
      const defaultPermissions = getDefaultPermissions();

      const newUsers: SharingItem[] = bookmark.users.map((u) => ({
        recipientId: u.id,
        recipientType: 'user' as const,
        displayName: u.displayName,
        permission: [...defaultPermissions],
      }));

      const bookmarkState: BookmarkState = {
        id: bookmark.id,
        name: bookmark.name,
        permission: [...defaultPermissions],
        userIds: bookmark.users.map((u) => u.id),
        isExpanded: false,
      };

      setItems((prev) => {
        const nextItems = [...prev, ...newUsers];
        onChange(nextItems);
        return nextItems;
      });
      setBookmarkEntries((prev) => [...prev, bookmarkState]);

      newUsers.forEach((u) => onAddItem(u));
    };

    /** Removes a sharing from the list and notifies the parent. */
    const handleDeleteItem = (item: SharingItem) => {
      setItems((prev) => {
        const nextItems = prev.filter(
          (i) => i.recipientId !== item.recipientId,
        );
        onChange(nextItems);
        return nextItems;
      });
      onDeleteItem(item);
    };

    /** Removes a bookmark and all its associated users. */
    const handleDeleteBookmark = (bookmarkId: string) => {
      const bookmark = bookmarkEntries.find((b) => b.id === bookmarkId);
      if (!bookmark) return;

      const userIdsToRemove = new Set(bookmark.userIds);
      const removedItems = items.filter((i) =>
        userIdsToRemove.has(i.recipientId),
      );

      setItems((prev) => {
        const nextItems = prev.filter(
          (i) => !userIdsToRemove.has(i.recipientId),
        );
        onChange(nextItems);
        return nextItems;
      });
      setBookmarkEntries((prev) => prev.filter((b) => b.id !== bookmarkId));

      removedItems.forEach((item) => onDeleteItem(item));
    };

    /** Updates a sharing's permissions (toggle right) and notifies the parent. */
    const handleChange = (item: SharingItem, rightName: ResourceRightName) => {
      const updatedItem = toggleRight(item, rightName);
      setItems((prevItems) => {
        const nextItems = prevItems.map((prevItem) =>
          prevItem.recipientId === item.recipientId ? updatedItem : prevItem,
        );
        onChange(nextItems);
        return nextItems;
      });
    };

    /** Toggles a right on a bookmark row, applying the change to all its users. */
    const handleBookmarkRightChange = (
      bookmarkId: string,
      rightName: ResourceRightName,
    ) => {
      const bookmark = bookmarkEntries.find((b) => b.id === bookmarkId);
      if (!bookmark) return;

      const hasRight = bookmark.permission.includes(rightName);
      const shouldAdd = !hasRight;

      // Toggle the bookmark's own permission display
      const fakeItem: SharingItem = {
        recipientId: bookmark.id,
        recipientType: 'bookmark',
        displayName: bookmark.name,
        permission: bookmark.permission,
      };
      const toggledBookmark = toggleRight(fakeItem, rightName);

      setBookmarkEntries((prev) =>
        prev.map((b) =>
          b.id === bookmarkId
            ? { ...b, permission: toggledBookmark.permission }
            : b,
        ),
      );

      // Apply the same change to all users of this bookmark
      const userIdsSet = new Set(bookmark.userIds);
      setItems((prev) => {
        const nextItems = prev.map((item) => {
          if (!userIdsSet.has(item.recipientId)) return item;
          return applyRight(item, rightName, shouldAdd);
        });
        onChange(nextItems);
        return nextItems;
      });
    };

    /** Toggles the expanded/collapsed state of a bookmark. */
    const handleToggleBookmarkExpand = (bookmarkId: string) => {
      setBookmarkEntries((prev) =>
        prev.map((b) =>
          b.id === bookmarkId ? { ...b, isExpanded: !b.isExpanded } : b,
        ),
      );
    };

    /** Triggers bookmark save with the entered name and current list. */
    const handleOnSaveBookmark = (bookmarkName: string) => {
      if (!onSaveBookmark) {
        return Promise.resolve();
      }
      return onSaveBookmark(bookmarkName, items);
    };

    const toggleBookmarkInput = () => {
      setBookmarkInput((prev) => !prev);
    };

    /** Exposes addItem so a sharing or bookmark can be added from outside (e.g. via ref). */
    useImperativeHandle(ref, () => ({
      addItem: handleAddItem,
    }));

    return (
      <div className="user-rights-list">
        {isLoading ? (
          <LoadingScreen />
        ) : (
          <>
            <div className="table-responsive">
              <table className="table border align-middle">
                <thead>
                  <tr>
                    <th scope="col" className="w-32">
                      <VisuallyHidden>
                        {t('explorer.modal.share.avatar.shared.alt')}
                      </VisuallyHidden>
                    </th>
                    <th scope="col">
                      <VisuallyHidden>
                        {t('explorer.modal.share.search.placeholder')}
                      </VisuallyHidden>
                    </th>
                    {Object.entries(resourceRights).map(([rightName]) => (
                      <th key={rightName}>{rightName}</th>
                    ))}
                    {!isReadOnly && (
                      <th scope="col">
                        <VisuallyHidden>{t('close')}</VisuallyHidden>
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {/* Owner row (always read-only). */}
                  <UserRightsItem
                    key={ownerItem?.recipientId}
                    item={ownerItem}
                    resourceRights={resourceRights}
                    isReadOnly={true}
                  />
                  {/* Bookmark entries with their associated users. */}
                  {bookmarkEntries.map((bookmark) => (
                    <Fragment key={bookmark.id}>
                      <UserRightsBookmarkRow
                        bookmark={bookmark}
                        resourceRights={resourceRights}
                        isReadOnly={isReadOnly}
                        onToggleRight={handleBookmarkRightChange}
                        onDelete={handleDeleteBookmark}
                        onToggleExpand={handleToggleBookmarkExpand}
                      />
                      {bookmark.isExpanded &&
                        bookmark.userIds.map((userId) => {
                          const item = items.find(
                            (i) => i.recipientId === userId,
                          );
                          if (!item) return null;
                          return (
                            <UserRightsItem
                              key={item.recipientId}
                              item={item}
                              resourceRights={resourceRights}
                              isReadOnly={isReadOnly}
                              isDeletable={false}
                              rowClassName="bg-light"
                              onChange={handleChange}
                            />
                          );
                        })}
                    </Fragment>
                  ))}
                  {/* Regular (non-bookmark) items. */}
                  {regularItems.map((item) => (
                    <UserRightsItem
                      key={item.recipientId}
                      item={item}
                      resourceRights={resourceRights}
                      isReadOnly={
                        isReadOnly ||
                        ownerItem?.recipientId === item.recipientId
                      }
                      onChange={handleChange}
                      onDeleteItem={handleDeleteItem}
                    />
                  ))}
                </tbody>
              </table>
            </div>
            {onSaveBookmark && (
              <div className="mt-16">
                <Button
                  data-testid="common-user-rights-list-share-bookmark-show-button"
                  color="tertiary"
                  leftIcon={<IconBookmark />}
                  rightIcon={
                    <IconRafterDown
                      title={t('show')}
                      className="w-16 min-w-0"
                      style={{
                        transition: 'rotate 0.2s ease-out',
                        rotate: showBookmarkInput ? '-180deg' : '0deg',
                      }}
                    />
                  }
                  type="button"
                  variant="ghost"
                  className="fw-normal"
                  onClick={() => toggleBookmarkInput()}
                >
                  {t('share.save.sharebookmark')}
                </Button>
                {showBookmarkInput && (
                  <SaveBookmark onSave={handleOnSaveBookmark} />
                )}
              </div>
            )}
          </>
        )}
      </div>
    );
  },
);

UserRightsList.displayName = 'UserRightsList';
