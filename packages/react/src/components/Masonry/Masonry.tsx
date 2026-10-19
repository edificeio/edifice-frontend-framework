import {
  Children,
  HTMLAttributes,
  ReactElement,
  ReactNode,
  isValidElement,
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';

import clsx from 'clsx';

export interface MasonryItemProps {
  /**
   * Number of columns the item spans (capped to the number of columns).
   * @default 1
   */
  span?: number;
  children: ReactNode;
}

/**
 * Optional wrapper to give an item a column span. It renders its children
 * as is: the span is read by the parent `Masonry`.
 */
const MasonryItem = ({ children }: MasonryItemProps) => <>{children}</>;
MasonryItem.displayName = 'Masonry.Item';

export interface MasonryProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * Items to lay out. Each child is one masonry item, in reading order.
   */
  children: ReactNode;
  /**
   * Number of columns. Each column takes an equal share of the available
   * width, gap excluded.
   * @default 2
   */
  columns?: number;
  /**
   * Gap between columns and between items, as a spacing token (e.g. `16`).
   * @default '16'
   */
  gap?: string;
  /**
   * Optional class for styling purpose
   */
  className?: string;
}

/**
 * Lays its children out in a CSS grid whose rows are 1px high: each item
 * spans as many rows as its measured height, so an item always lands in the
 * column that is the least filled so far and columns stay balanced in height.
 *
 * Items stay in the DOM in the order they were given (reading order and tab
 * order are preserved). Their column is derived from measured heights, so an
 * item that grows after mount (lazy loading, async data) can shift the ones
 * that follow it.
 */
const Root = ({
  children,
  columns = 2,
  gap = '16',
  className,
  style,
  ...restProps
}: MasonryProps) => {
  const columnCount = Math.max(1, Math.floor(columns));
  const gridRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef(new Map<string, HTMLDivElement>());
  const [spans, setSpans] = useState<Record<string, number>>({});

  const items = Children.toArray(children);

  const measure = useCallback(() => {
    const grid = gridRef.current;
    if (!grid) return;
    // The gap token is only known to the CSS: read it back so that the space
    // between two stacked items equals the space between two columns.
    const rowGap = parseFloat(getComputedStyle(grid).columnGap) || 0;
    const next: Record<string, number> = {};
    itemRefs.current.forEach((el, key) => {
      next[key] = Math.ceil(el.getBoundingClientRect().height + rowGap);
    });
    setSpans((prev) => {
      const keys = Object.keys(next);
      const unchanged =
        keys.length === Object.keys(prev).length &&
        keys.every((key) => prev[key] === next[key]);
      return unchanged ? prev : next;
    });
  }, []);

  useLayoutEffect(() => {
    measure();
    if (typeof ResizeObserver === 'undefined') return;
    const observer = new ResizeObserver(measure);
    if (gridRef.current) observer.observe(gridRef.current);
    itemRefs.current.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
    // Re-subscribe when the set of items or the column count changes
  }, [measure, columnCount, items.length]);

  return (
    <div
      ref={gridRef}
      className={clsx('masonry', `column-gap-${gap}`, className)}
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${columnCount}, minmax(0, 1fr))`,
        gridAutoRows: '1px',
        alignItems: 'start',
        ...style,
      }}
      {...restProps}
    >
      {items.map((item, index) => {
        const key = String((item as { key?: string }).key ?? index);
        const span =
          isValidElement(item) && item.type === MasonryItem
            ? Math.min(
                Math.max(
                  1,
                  Math.floor(
                    (item as ReactElement<MasonryItemProps>).props.span ?? 1,
                  ),
                ),
                columnCount,
              )
            : 1;
        return (
          <div
            key={key}
            ref={(el) => {
              if (el) itemRefs.current.set(key, el);
              else itemRefs.current.delete(key);
            }}
            className="masonry__item"
            data-testid={`masonry-item-${index}`}
            style={{
              gridColumn: `span ${span}`,
              gridRowEnd: `span ${spans[key] ?? 1}`,
            }}
          >
            {item}
          </div>
        );
      })}
    </div>
  );
};

Root.displayName = 'Masonry';

export const Masonry = Object.assign(Root, { Item: MasonryItem });

export default Masonry;
