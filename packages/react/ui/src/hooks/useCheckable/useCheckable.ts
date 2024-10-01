import { useState } from "react";

export const useCheckable = <T extends { _id: string }>(
  /**
   * Generic data
   */
  data: T[] | undefined,
) => {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

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
      return deselect ? [] : data?.map((item) => item._id) ?? [];
    });
  };

  const allItemsSelected = selectedItems?.length === data?.length;
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
