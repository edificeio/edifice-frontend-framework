/**
 * Sharing rights list for a resource.
 * Displays the owner, shared users/groups with their permissions,
 * and optionally a block to save the configuration as a bookmark.
 * Supports adding bookmarks which appear as collapsible groups of users.
 */
import {
  Fragment,
  forwardRef,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useTranslation } from 'react-i18next';
import { IconBookmark, IconRafterDown } from '../../modules/icons/components';
import { useEdificeClient } from '../../providers';
import { SharingItem } from '../../types';
import { getRotateTransitionStyle } from '../../utilities';
import { Button } from '../Button';
import { LoadingScreen } from '../LoadingScreen';
import { VisuallyHidden } from '../VisuallyHidden';
import { createRightsHelpers } from './helpers/rightsHelpers';
import { useBookmarkEntries } from './hooks/useBookmarkEntries';
import { useSharingItems } from './hooks/useSharingItems';
import { SaveBookmark } from './SaveBookmark';
import { BookmarkInput, ResourceRights, isBookmarkInput } from './types/types';
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
  onAddItems: (value: SharingItem[]) => void;
  onDeleteItems: (value: SharingItem[]) => void;
  onSaveBookmark?: (
    bookmarkName: string,
    items: SharingItem[],
  ) => Promise<void>;
}

export interface UserRightsListRef {
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
      onAddItems,
      onDeleteItems,
      onSaveBookmark,
    },
    ref,
  ) => {
    const [showBookmarkInput, setBookmarkInput] = useState<boolean>(false);
    const tableRef = useRef<HTMLTableElement>(null);
    const { t } = useTranslation();
    const { user } = useEdificeClient();
    const { applyRight, toggleRight, getOwnerItem } = useMemo(
      () => createRightsHelpers(resourceRights),
      [resourceRights],
    );

    const ownerItem = getOwnerItem(ownerId, user, isCreating);

    const sharingItems = useSharingItems({
      initialSharings,
      toggleRight,
      applyRight,
      onChange,
      onAddItems,
      onDeleteItems,
    });

    const itemsByRecipientId = useMemo(
      () => new Map(sharingItems.items.map((item) => [item.recipientId, item])),
      [sharingItems.items],
    );

    const existingRecipientIds = useMemo(
      () => new Set(itemsByRecipientId.keys()),
      [itemsByRecipientId],
    );

    const bookmarks = useBookmarkEntries({
      resourceRights,
      existingRecipientIds,
      toggleRight,
      addItems: sharingItems.addItems,
      deleteItemsByIds: sharingItems.deleteItemsByIds,
      applyRightToIds: sharingItems.applyRightToIds,
    });

    const regularItems = useMemo(
      () =>
        sharingItems.items.filter(
          (item) => !bookmarks.bookmarkUserIds.has(item.recipientId),
        ),
      [sharingItems.items, bookmarks.bookmarkUserIds],
    );

    const focusTable = () => {
      tableRef.current?.focus();
    };

    const handleAddItem = (item: SharingItem | BookmarkInput) => {
      if (isBookmarkInput(item)) {
        bookmarks.addBookmark(item);
      } else {
        sharingItems.addItem(item);
      }
    };

    const handleDeleteItem = (item: SharingItem) => {
      sharingItems.deleteItem(item);
      focusTable();
    };

    const handleDeleteBookmark = (bookmarkId: string) => {
      bookmarks.deleteBookmark(bookmarkId);
      focusTable();
    };

    const handleOnSaveBookmark = (bookmarkName: string) => {
      if (!onSaveBookmark) {
        return Promise.resolve();
      }
      return onSaveBookmark(bookmarkName, sharingItems.items);
    };

    const toggleBookmarkInput = () => {
      setBookmarkInput((prev) => !prev);
    };

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
              <table
                ref={tableRef}
                tabIndex={-1}
                className="table border align-middle"
              >
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
                    {Object.entries(resourceRights).map(
                      ([rightName, rightDef]) => (
                        <th key={rightName}>
                          {rightDef.displayName ?? rightName}
                        </th>
                      ),
                    )}
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
                  {bookmarks.bookmarkEntries.map((bookmark) => (
                    <Fragment key={bookmark.id}>
                      <UserRightsBookmarkRow
                        bookmark={bookmark}
                        resourceRights={resourceRights}
                        isReadOnly={isReadOnly}
                        onToggleRight={bookmarks.toggleBookmarkRight}
                        onDelete={handleDeleteBookmark}
                        onToggleExpand={bookmarks.toggleExpand}
                      />
                      {bookmark.isExpanded &&
                        bookmark.userIds.map((userId) => {
                          const item = itemsByRecipientId.get(userId);
                          if (!item) return null;
                          return (
                            <UserRightsItem
                              key={item.recipientId}
                              item={item}
                              resourceRights={resourceRights}
                              isReadOnly={isReadOnly}
                              isDeletable={false}
                              rowClassName="bg-light"
                              bookmarkName={bookmark.name}
                              onChange={sharingItems.changeRight}
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
                      onChange={sharingItems.changeRight}
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
                      style={getRotateTransitionStyle(showBookmarkInput)}
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
