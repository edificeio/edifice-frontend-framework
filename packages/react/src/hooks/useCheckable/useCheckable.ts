import { useEffect, useState } from 'react';

export const useCheckable = <T extends { _id: string }>(
  /**
   * Generic data
   */
  data: T[] | undefined,
) => {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  useEffect(() => {
    // If data changes, check if selected items are still valid
    if (data) {
      setSelectedItems((currentSelection) => {
        const validSelectedItems = currentSelection.filter((id) =>
          data.some((item) => item._id === id),
        );
        return validSelectedItems.length !== currentSelection.length
          ? validSelectedItems
          : currentSelection;
      });
    }
  }, [data]);

  const handleOnSelectItem = (itemId: string) => {
    setSelectedItems((currentSelection: string[]) => {
      const newSelection = [...currentSelection];
      if (!newSelection.includes(itemId)) {
        newSelection.push(itemId);
      } else {
        newSelection.splice(newSelection.indexOf(itemId), 1);
      }
      return newSelection;
    });
  };

  const handleOnSelectAllItems = (deselect: boolean) => {
    setSelectedItems(() => {
      return deselect ? [] : (data?.map((item) => item._id) ?? []);
    });
  };

  const allItemsSelected =
    selectedItems?.length === data?.length && data?.length > 0;
  const isIndeterminate = data
    ? selectedItems?.length > 0 && selectedItems?.length < data?.length
    : false;

  return {
    selectedItems,
    allItemsSelected,
    isIndeterminate,
    handleOnSelectAllItems,
    handleOnSelectItem,
  };
};
