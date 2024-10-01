import clsx from "clsx";
import { Fragment, ReactNode, useEffect } from "react";
import { Checkbox, Toolbar, ToolbarItem } from "..";
import { useCheckable } from "../..";

export type ListProps<T> = {
  /**
   * Toolbar data items
   */
  items?: ToolbarItem[];
  /**
   * Generic data
   */
  data: T[] | undefined;
  /**
   * render to display its own JSX
   */
  renderNode: (node: T, checkbox?: JSX.Element, checked?: boolean) => ReactNode;
  /**
   * Callback to get selected ids
   */
  onSelectedItems?: (selectedIds: string[]) => void;
};

export const List = <T extends { _id: string }>({
  items,
  data,
  renderNode,
  onSelectedItems,
}: ListProps<T>) => {
  const {
    selectedItems,
    allItemsSelected,
    isIndeterminate,
    handleOnSelectAllItems,
    handleOnSelectItem,
  } = useCheckable<T>(data);

  useEffect(() => {
    if (selectedItems) onSelectedItems?.(selectedItems);
  }, [onSelectedItems, selectedItems]);

  return (
    <div>
      {items && (
        <>
          <div
            className={clsx("d-flex align-items-center", {
              "px-12": items,
            })}
          >
            {items && (
              <div className="d-flex align-items-center gap-8">
                <Checkbox
                  checked={allItemsSelected}
                  indeterminate={isIndeterminate}
                  onChange={() => handleOnSelectAllItems(allItemsSelected)}
                />
                <span>({selectedItems.length})</span>
              </div>
            )}
            {items && (
              <Toolbar
                items={items}
                isBlock
                variant="no-shadow"
                className={clsx({
                  "py-4": items,
                })}
              />
            )}
          </div>
          <div className="border-top"></div>
        </>
      )}
      <div className="mt-8">
        {data?.map((node) => {
          const checkbox = (
            <Checkbox
              checked={selectedItems.includes(node._id)}
              onChange={() => handleOnSelectItem(node._id)}
            />
          );

          const checked = selectedItems.includes(node._id);
          return (
            <Fragment key={node._id}>
              {renderNode(node, checkbox, checked)}
            </Fragment>
          );
        })}
      </div>
    </div>
  );
};
