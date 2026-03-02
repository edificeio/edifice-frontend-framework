/**
 * Sharing rights list for a resource.
 * Displays the owner, shared users/groups with their permissions,
 * and optionally a block to save the configuration as a bookmark.
 */
import { forwardRef, useImperativeHandle, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { IconBookmark, IconRafterDown } from '../../modules/icons/components';
import { useEdificeClient } from '../../providers';
import { Button } from '../Button';
import { LoadingScreen } from '../LoadingScreen';
import { SharingItem } from '../UserSearch';
import { VisuallyHidden } from '../VisuallyHidden';
import { useRights } from './hooks/useRights';
import { SaveBookmark } from './SaveBookmark';
import { ResourceRightName, ResourceRights } from './types/types';
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
  addItem: (item: SharingItem) => void;
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
    const [showBookmarkInput, setBookmarkInput] = useState<boolean>(false);
    const { t } = useTranslation();
    const { user } = useEdificeClient();
    const { toggleRight, getOwnerItem } = useRights(resourceRights);

    const ownerItem = getOwnerItem(ownerId, user, isCreating);

    /** Adds a sharing to the list and notifies the parent. */
    const handleAddItem = (item: SharingItem) => {
      setItems((prev) => [...prev, item]);
      onAddItem(item);
    };

    /** Removes a sharing from the list and notifies the parent. */
    const handleDeleteItem = (item: SharingItem) => {
      setItems((prev) =>
        prev.filter((i) => i.recipientId !== item.recipientId),
      );
      onDeleteItem(item);
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

    /** Exposes addItem so a sharing can be added from outside (e.g. via ref). */
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
                  {/* Add a disabled line about the resource owner. */}
                  <UserRightsItem
                    key={ownerItem?.recipientId}
                    item={ownerItem}
                    resourceRights={resourceRights}
                    isReadOnly={true}
                  />
                  {items.map((item) => (
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
