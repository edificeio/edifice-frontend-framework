import { Key, ReactNode } from 'react';

import { useVirtualizer } from '@tanstack/react-virtual';

export interface TableVirtualizedBodyProps<T> {
  /**
   * Scrollable container (the `.table-responsive` element). Passed as state
   * (not a ref) so the virtualizer recomputes once the element is mounted.
   */
  scrollElement: HTMLElement | null;
  /** Data to render, one row per item. */
  items: T[];
  /** Render-prop returning the cells (`Table.Td`) of a row. */
  renderRow: (item: T, index: number) => ReactNode;
  /** Estimated row height in px (used before dynamic measurement). */
  estimateRowHeight?: number;
  /** Number of rows rendered outside the visible window. */
  overscan?: number;
  /** Extra attributes (onClick, className, aria-selected…) for a row. */
  rowProps?: (
    item: T,
    index: number,
  ) => React.HTMLAttributes<HTMLTableRowElement>;
  /** Stable key for a row. Defaults to the row index. */
  getRowKey?: (item: T, index: number) => Key;
}

/**
 * Virtualized `<tbody>`: only the visible rows (+ overscan) are mounted, with
 * top/bottom spacer rows keeping the scrollbar geometry. Row heights are
 * measured dynamically, so variable heights are supported.
 */
export function TableVirtualizedBody<T>({
  scrollElement,
  items,
  renderRow,
  estimateRowHeight = 44,
  overscan = 8,
  rowProps,
  getRowKey,
}: TableVirtualizedBodyProps<T>) {
  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => scrollElement,
    estimateSize: () => estimateRowHeight,
    overscan,
  });

  const virtualRows = virtualizer.getVirtualItems();
  const totalSize = virtualizer.getTotalSize();

  // When the window is empty (e.g. before the first measure), still reserve the
  // full height so the scroll container keeps a height and can be measured.
  const paddingTop = virtualRows.length > 0 ? virtualRows[0].start : 0;
  const paddingBottom =
    virtualRows.length > 0
      ? totalSize - virtualRows[virtualRows.length - 1].end
      : totalSize;

  return (
    <tbody>
      {paddingTop > 0 && (
        <tr aria-hidden data-virtual-spacer style={{ height: paddingTop }}>
          <td style={{ height: paddingTop, padding: 0, border: 0 }} />
        </tr>
      )}

      {virtualRows.map((virtualRow) => {
        const item = items[virtualRow.index];
        return (
          <tr
            key={
              getRowKey ? getRowKey(item, virtualRow.index) : virtualRow.index
            }
            data-index={virtualRow.index}
            data-parity={virtualRow.index % 2 === 0 ? 'even' : 'odd'}
            ref={virtualizer.measureElement}
            {...rowProps?.(item, virtualRow.index)}
          >
            {renderRow(item, virtualRow.index)}
          </tr>
        );
      })}

      {paddingBottom > 0 && (
        <tr aria-hidden data-virtual-spacer style={{ height: paddingBottom }}>
          <td style={{ height: paddingBottom, padding: 0, border: 0 }} />
        </tr>
      )}
    </tbody>
  );
}

TableVirtualizedBody.displayName = 'Table.VirtualizedBody';
