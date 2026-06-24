/**
 * Table  Component
 * @see WAI-ARIA https://www.w3.org/WAI/ARIA/apg/patterns/table/
 */

import {
  CSSProperties,
  forwardRef,
  Key,
  ReactElement,
  ReactNode,
  Ref,
  useState,
} from 'react';
import { TableTbody } from './TableTbody';
import { TableTd } from './TableTd';
import { TableTh } from './TableTh';
import { TableThead } from './TableThead';
import { TableTr } from './TableTr';
import { TableVirtualizedBody } from './TableVirtualizedBody';
export type TableRef = HTMLTableElement;

export interface TableProps<T = unknown> {
  /**
   * Compound children (`Table.Thead`, `Table.Tbody`…). Used when no `items`
   * are provided (legacy / small lists).
   */
  children?: ReactNode;
  /** Caps the height of the scrollable container, in any CSS unit. */
  maxHeight?: string;

  // --- Data-driven, opt-in virtualization (Approach A) ---
  /**
   * Data array, one row per item. When provided, rows are rendered from this
   * array via `renderRow` instead of `children`. Above `virtualizeThreshold`
   * (and with `maxHeight` set), rows are virtualized automatically.
   */
  items?: T[];
  /** Render-prop returning the cells (`Table.Td`) of a row. */
  renderRow?: (item: T, index: number) => ReactNode;
  /** Header rendered above the body (typically a `Table.Thead`). */
  header?: ReactNode;
  /** Estimated row height in px, used before dynamic measurement. */
  estimateRowHeight?: number;
  /** Number of rows rendered outside the visible window. */
  overscan?: number;
  /**
   * Row count above which virtualization kicks in (requires `maxHeight`).
   * Defaults to 100.
   */
  virtualizeThreshold?: number;
  /** Extra attributes (onClick, className, aria-selected…) for a row. */
  rowProps?: (
    item: T,
    index: number,
  ) => React.HTMLAttributes<HTMLTableRowElement>;
  /** Stable key for a row. Defaults to the row index. */
  getRowKey?: (item: T, index: number) => Key;
}

function TableRoot<T>(
  {
    children,
    maxHeight,
    items,
    renderRow,
    header,
    estimateRowHeight,
    overscan,
    virtualizeThreshold = 100,
    rowProps,
    getRowKey,
  }: TableProps<T>,
  ref: Ref<TableRef>,
) {
  // Stored as state (callback ref): the transition null -> element re-renders
  // the body so the virtualizer measures the container as soon as it mounts.
  const [scrollElement, setScrollElement] = useState<HTMLDivElement | null>(
    null,
  );

  const style: CSSProperties = {
    maxHeight,
    overflowY: 'auto',
  };

  const isDataDriven = !!items && !!renderRow;
  // Virtualization needs a bounded, scrollable container.
  const isVirtualized =
    isDataDriven && !!maxHeight && items!.length > virtualizeThreshold;

  return (
    <div
      ref={setScrollElement}
      className="table-responsive"
      style={maxHeight ? style : {}}
    >
      <table
        ref={ref}
        className={`table align-middle mb-0${
          isVirtualized ? ' table--virtualized' : ''
        }`}
        style={{ overflow: maxHeight ? 'visible' : 'hidden' }}
      >
        {isVirtualized ? (
          <>
            {header}
            <TableVirtualizedBody
              scrollElement={scrollElement}
              items={items!}
              renderRow={renderRow!}
              estimateRowHeight={estimateRowHeight}
              overscan={overscan}
              rowProps={rowProps}
              getRowKey={getRowKey}
            />
          </>
        ) : isDataDriven ? (
          <>
            {header}
            <TableTbody>
              {items!.map((item, index) => (
                <TableTr
                  key={getRowKey ? getRowKey(item, index) : index}
                  {...rowProps?.(item, index)}
                >
                  {renderRow!(item, index)}
                </TableTr>
              ))}
            </TableTbody>
          </>
        ) : (
          children
        )}
      </table>
    </div>
  );
}

const Root = forwardRef(TableRoot) as <T>(
  props: TableProps<T> & { ref?: Ref<TableRef> },
) => ReactElement;

(Root as { displayName?: string }).displayName = 'Table';

const Table = Object.assign(Root, {
  Thead: TableThead,
  Th: TableTh,
  Tbody: TableTbody,
  Tr: TableTr,
  Td: TableTd,
});

export default Table;
