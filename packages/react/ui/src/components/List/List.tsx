import { useMediaQuery } from "@uidotdev/usehooks";
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

  const isDesktopDevice = useMediaQuery("only screen and (min-width: 1024px)");

  useEffect(() => {
    if (selectedItems) onSelectedItems?.(selectedItems);
  }, [onSelectedItems, selectedItems]);

  return (
    <>
      {items && (
        <>
          <div
            className={clsx("d-flex align-items-center gap-8", {
              "px-12": items,
            })}
          >
            <>
              <div className="d-flex align-items-center gap-8">
                <Checkbox
                  checked={allItemsSelected}
                  indeterminate={isIndeterminate}
                  onChange={() => handleOnSelectAllItems(allItemsSelected)}
                />
                <span>({selectedItems.length})</span>
              </div>
              <Toolbar
                items={items}
                isBlock
                align="left"
                variant="no-shadow"
                className={clsx("gap-4 py-4", {
                  "px-0 ms-auto": !isDesktopDevice,
                })}
              />
            </>
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
    </>
  );
};
