/**
 * Hook managing the list of SharingItems (users/groups) and their permissions.
 * Handles add, delete, individual right toggle, and batch right application.
 */
import { useState } from 'react';
import { SharingItem } from '../../../types';
import { ResourceRightName } from '../types/types';

interface UseSharingItemsParams {
  initialSharings: SharingItem[];
  toggleRight: (item: SharingItem, rightName: ResourceRightName) => SharingItem;
  applyRight: (
    item: SharingItem,
    rightName: ResourceRightName,
    add: boolean,
  ) => SharingItem;
  onChange: (value: SharingItem[]) => void;
  onAddItems: (value: SharingItem[]) => void;
  onDeleteItems: (value: SharingItem[]) => void;
}

export const useSharingItems = ({
  initialSharings,
  toggleRight,
  applyRight,
  onChange,
  onAddItems,
  onDeleteItems,
}: UseSharingItemsParams) => {
  const [items, setItems] = useState<SharingItem[]>(initialSharings ?? []);

  /** Adds a single item, ignores if recipientId already exists. */
  const addItem = (item: SharingItem) => {
    setItems((prev) => {
      const existingIds = new Set(prev.map((sharing) => sharing.recipientId));
      if (existingIds.has(item.recipientId)) return prev;
      const nextItems = [...prev, item];
      onChange(nextItems);
      onAddItems([item]);
      return nextItems;
    });
  };

  /** Adds multiple items at once, filtering out duplicates. */
  const addItems = (newItems: SharingItem[]) => {
    setItems((prev) => {
      const existingIds = new Set(prev.map((sharing) => sharing.recipientId));
      const uniqueItems = newItems.filter(
        (newItem) => !existingIds.has(newItem.recipientId),
      );
      if (uniqueItems.length === 0) return prev;
      const nextItems = [...prev, ...uniqueItems];
      onChange(nextItems);
      onAddItems(uniqueItems);
      return nextItems;
    });
  };

  /** Removes a single item by recipientId. */
  const deleteItem = (item: SharingItem) => {
    setItems((prev) => {
      const nextItems = prev.filter(
        (sharing) => sharing.recipientId !== item.recipientId,
      );
      if (nextItems.length === prev.length) return prev;
      onChange(nextItems);
      onDeleteItems([item]);
      return nextItems;
    });
  };

  /** Removes multiple items by their recipientIds (used when deleting a bookmark). */
  const deleteItemsByIds = (ids: Set<string>) => {
    setItems((prev) => {
      const nextItems = prev.filter((sharing) => !ids.has(sharing.recipientId));
      const removedItems = prev.filter((sharing) =>
        ids.has(sharing.recipientId),
      );
      onChange(nextItems);
      onDeleteItems(removedItems);
      return nextItems;
    });
  };

  /** Toggles a single right on a specific item. */
  const changeRight = (item: SharingItem, rightName: ResourceRightName) => {
    const updatedItem = toggleRight(item, rightName);
    setItems((prevItems) => {
      const nextItems = prevItems.map((prevItem) =>
        prevItem.recipientId === item.recipientId ? updatedItem : prevItem,
      );
      onChange(nextItems);
      return nextItems;
    });
  };

  /** Forces a right on/off for a set of items (used for bookmark batch toggle). */
  const applyRightToIds = (
    ids: Set<string>,
    rightName: ResourceRightName,
    shouldAdd: boolean,
  ) => {
    setItems((prev) => {
      const nextItems = prev.map((sharing) => {
        if (!ids.has(sharing.recipientId)) return sharing;
        return applyRight(sharing, rightName, shouldAdd);
      });
      onChange(nextItems);
      return nextItems;
    });
  };

  return {
    items,
    addItem,
    addItems,
    deleteItem,
    deleteItemsByIds,
    changeRight,
    applyRightToIds,
  };
};
