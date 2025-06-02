import clsx from 'clsx';
import { Fragment, ReactNode, useEffect } from 'react';
import { Checkbox, Toolbar, ToolbarItem } from '..';
import { useBreakpoint, useCheckable } from '../..';

export type ListProps<T> = {
  /**
   * Toolbar data items
   */
  items?: ToolbarItem[];
  /**
   * Checkable list
   */
  isCheckable?: boolean;
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
  /**
   * Custom class name
   */
  className?: string;
  /**
   * Toolbar options
   */
  toolbarOptions?: {
    shouldHideLabelsOnMobile?: boolean;
    sticky?: boolean;
  };
};

export const List = <T extends { _id: string }>({
  items,
  isCheckable = false,
  data,
  renderNode,
  onSelectedItems,
  className,
  toolbarOptions,
}: ListProps<T>) => {
  const {
    selectedItems,
    allItemsSelected,
    isIndeterminate,
    handleOnSelectAllItems,
    handleOnSelectItem,
  } = useCheckable<T>(data);

  const { lg } = useBreakpoint();

  useEffect(() => {
    if (selectedItems) onSelectedItems?.(selectedItems);
  }, [onSelectedItems, selectedItems]);

  const toolbarClassName = clsx(
    'list-header d-flex align-items-center gap-8 px-12 bg-white border-bottom',
    className,
    {
      'sticky-top': toolbarOptions?.sticky,
    },
  );

  return (
    <>
      {(items || isCheckable) && (
        <>
          <div className={toolbarClassName}>
            <>
              <div className="d-flex align-items-center gap-8 py-12">
                <Checkbox
                  checked={allItemsSelected}
                  indeterminate={isIndeterminate}
                  onChange={() => handleOnSelectAllItems(allItemsSelected)}
                />
                <span>({selectedItems.length})</span>
              </div>
              {items && (
                <Toolbar
                  items={items}
                  shouldHideLabelsOnMobile={
                    toolbarOptions?.shouldHideLabelsOnMobile
                  }
                  isBlock
                  align="left"
                  variant="no-shadow"
                  className={clsx('gap-4 py-4', {
                    'px-0 ms-auto': !lg,
                  })}
                />
              )}
            </>
          </div>
        </>
      )}
      <div>
        {data?.map((node) => {
          const checked = selectedItems.includes(node._id);
          const checkbox = (
            <Checkbox
              checked={checked}
              onChange={() => handleOnSelectItem(node._id)}
              onClick={(event) => event.stopPropagation()}
            />
          );

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
