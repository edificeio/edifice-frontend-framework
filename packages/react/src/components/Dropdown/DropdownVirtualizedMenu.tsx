import {
  KeyboardEvent,
  Key,
  ReactNode,
  useCallback,
  useEffect,
  useId,
  useState,
} from 'react';

import { useVirtualizer } from '@tanstack/react-virtual';
import clsx from 'clsx';

import { mergeRefs } from '../../utilities/refs/ref';
import { useDropdownContext } from './DropdownContext';

export interface DropdownVirtualizedMenuProps<T> {
  /** Items to display, one option per entry. */
  'items': T[];
  /**
   * Render-prop for an option's content. `active` is true for the option
   * currently highlighted by keyboard/hover.
   */
  'renderItem': (
    item: T,
    state: { index: number; active: boolean },
  ) => ReactNode;
  /** Called when an option is chosen (click or Enter). */
  'onSelect'?: (item: T, index: number) => void;
  /** Stable key for an option. Defaults to the index. */
  'getItemKey'?: (item: T, index: number) => Key;
  /** Estimated option height in px, used before dynamic measurement. */
  'estimateItemHeight'?: number;
  /** Number of options rendered outside the visible window. */
  'overscan'?: number;
  /** Max height of the scrollable listbox, in px. */
  'maxHeight'?: number;
  /** Close the dropdown after a selection. Defaults to true. */
  'closeOnSelect'?: boolean;
  /** Use whole width. */
  'block'?: boolean;
  /** Skip the default menu styling. */
  'unstyled'?: boolean;
  /** Additional class name. */
  'className'?: string;
  /** Accessible label for the listbox. */
  'aria-label'?: string;
}

/**
 * Virtualized dropdown menu (opt-in, data-driven). Only the visible options
 * (+ overscan) are mounted, so the DOM node count stays constant whatever the
 * list size.
 *
 * Keyboard navigation lives on the listbox container and uses
 * `aria-activedescendant` (roving) instead of focusing each option, which is
 * required since off-screen options are not mounted. Arrow keys / Home / End
 * move the active option and scroll to it via `scrollToIndex`; Enter selects;
 * Escape/Tab close the dropdown.
 */
export function DropdownVirtualizedMenu<T>({
  items,
  renderItem,
  onSelect,
  getItemKey,
  estimateItemHeight = 40,
  overscan = 8,
  maxHeight = 320,
  closeOnSelect = true,
  block,
  unstyled,
  className,
  'aria-label': ariaLabel,
}: DropdownVirtualizedMenuProps<T>) {
  const { visible, menuProps, closeDropdown } = useDropdownContext();

  const baseId = useId();
  const [listboxEl, setListboxEl] = useState<HTMLDivElement | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => listboxEl,
    estimateSize: () => estimateItemHeight,
    overscan,
  });

  // Reset the active option when the menu (re)opens.
  useEffect(() => {
    if (visible) setActiveIndex(0);
  }, [visible]);

  // Keep the active index within bounds when the list changes (e.g. filtering).
  useEffect(() => {
    setActiveIndex((index) =>
      items.length === 0 ? 0 : Math.min(index, items.length - 1),
    );
  }, [items.length]);

  // Scroll the active option into view as it moves.
  useEffect(() => {
    if (visible && items.length > 0) {
      virtualizer.scrollToIndex(activeIndex, { align: 'auto' });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeIndex, visible]);

  const optionId = (index: number) => `${baseId}-option-${index}`;

  const select = useCallback(
    (index: number) => {
      const item = items[index];
      if (item === undefined) return;
      onSelect?.(item, index);
      if (closeOnSelect) closeDropdown();
    },
    [items, onSelect, closeOnSelect, closeDropdown],
  );

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const lastIndex = items.length - 1;
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        setActiveIndex((index) => Math.min(index + 1, lastIndex));
        break;
      case 'ArrowUp':
        event.preventDefault();
        setActiveIndex((index) => Math.max(index - 1, 0));
        break;
      case 'Home':
        event.preventDefault();
        setActiveIndex(0);
        break;
      case 'End':
        event.preventDefault();
        setActiveIndex(lastIndex);
        break;
      case 'Enter':
      case ' ':
        event.preventDefault();
        select(activeIndex);
        break;
      case 'Escape':
      case 'Tab':
        closeDropdown();
        break;
      default:
        break;
    }
  };

  if (!visible) return null;

  const {
    ref: menuRef,
    className: menuClassName,
    style,
    ...restMenuProps
  } = menuProps;

  const mergedClassName = clsx(
    { 'w-100': block, 'bg-white shadow rounded-4 p-8': !unstyled },
    menuClassName,
    className,
  );

  return (
    <div
      {...restMenuProps}
      ref={mergeRefs(menuRef, setListboxEl)}
      role="listbox"
      tabIndex={0}
      aria-label={ariaLabel}
      aria-activedescendant={
        items.length > 0 ? optionId(activeIndex) : undefined
      }
      className={mergedClassName}
      style={{ ...style, maxHeight, overflowY: 'auto' }}
      onKeyDown={handleKeyDown}
    >
      <div
        style={{
          height: virtualizer.getTotalSize(),
          width: '100%',
          position: 'relative',
        }}
      >
        {virtualizer.getVirtualItems().map((virtualItem) => {
          const index = virtualItem.index;
          const item = items[index];
          const active = index === activeIndex;
          return (
            <div
              key={getItemKey ? getItemKey(item, index) : index}
              id={optionId(index)}
              role="option"
              aria-selected={active}
              data-index={index}
              ref={virtualizer.measureElement}
              onClick={() => select(index)}
              onMouseEnter={() => setActiveIndex(index)}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                transform: `translateY(${virtualItem.start}px)`,
              }}
            >
              {renderItem(item, { index, active })}
            </div>
          );
        })}
      </div>
    </div>
  );
}

DropdownVirtualizedMenu.displayName = 'Dropdown.VirtualizedMenu';
