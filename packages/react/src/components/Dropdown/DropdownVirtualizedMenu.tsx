import {
  Key,
  KeyboardEvent,
  ReactNode,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useState,
} from 'react';

import { useVirtualizer } from '@tanstack/react-virtual';
import clsx from 'clsx';

import { SearchBar } from '../SearchBar';
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

  // --- Integrated search (combobox) ---
  /** Render a search field at the top of the menu, filtering the options. */
  'searchable'?: boolean;
  /**
   * Text of an item, used to filter when `searchable`. Required for the
   * built-in filtering to work.
   */
  'getItemText'?: (item: T) => string;
  /** Placeholder of the search field. */
  'searchPlaceholder'?: string;
  /** Message shown when the search yields no result. */
  'noResultsLabel'?: string;
  /** Called whenever the search query changes. */
  'onSearch'?: (query: string) => void;
}

/**
 * Virtualized dropdown menu (opt-in, data-driven). Only the visible options
 * (+ overscan) are mounted, so the DOM node count stays constant whatever the
 * list size.
 *
 * The menu is a panel containing an optional search field and a scrollable
 * listbox. Keyboard navigation uses `aria-activedescendant` (roving) instead of
 * focusing each option, which is required since off-screen options are not
 * mounted: arrows / Home / End move the active option and scroll to it via
 * `scrollToIndex`; Enter selects; Escape / Tab close. When `searchable`, focus
 * stays in the search field (combobox pattern) and the same keys drive the
 * listbox.
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
  searchable = false,
  getItemText,
  searchPlaceholder = 'Rechercher...',
  noResultsLabel = 'Pas de résultat',
  onSearch,
}: DropdownVirtualizedMenuProps<T>) {
  const { visible, menuProps, closeDropdown } = useDropdownContext();

  const baseId = useId();
  const listboxId = `${baseId}-listbox`;
  const optionId = (index: number) => `${baseId}-option-${index}`;

  const [listboxEl, setListboxEl] = useState<HTMLDivElement | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [query, setQuery] = useState('');

  const filteredItems = useMemo(() => {
    if (!searchable || !query || !getItemText) return items;
    const needle = query.toLowerCase();
    return items.filter((item) =>
      getItemText(item).toLowerCase().includes(needle),
    );
  }, [items, query, searchable, getItemText]);

  const virtualizer = useVirtualizer({
    count: filteredItems.length,
    getScrollElement: () => listboxEl,
    estimateSize: () => estimateItemHeight,
    overscan,
  });

  // Reset the query and active option when the menu (re)opens.
  useEffect(() => {
    if (visible) {
      setActiveIndex(0);
      setQuery('');
    }
  }, [visible]);

  // Reset / clamp the active option when the filtered list changes.
  useEffect(() => {
    setActiveIndex((index) =>
      filteredItems.length === 0
        ? 0
        : Math.min(index, filteredItems.length - 1),
    );
  }, [filteredItems.length]);

  // Move focus to the listbox when not searchable (the search field autofocuses
  // itself otherwise).
  useEffect(() => {
    if (visible && !searchable && listboxEl) listboxEl.focus();
  }, [visible, searchable, listboxEl]);

  // Scroll the active option into view as it moves.
  useEffect(() => {
    if (visible && filteredItems.length > 0) {
      virtualizer.scrollToIndex(activeIndex, { align: 'auto' });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeIndex, visible]);

  const select = useCallback(
    (index: number) => {
      const item = filteredItems[index];
      if (item === undefined) return;
      onSelect?.(item, index);
      if (closeOnSelect) closeDropdown();
    },
    [filteredItems, onSelect, closeOnSelect, closeDropdown],
  );

  const handleNavKeyDown = (
    event: KeyboardEvent<HTMLInputElement | HTMLDivElement>,
  ) => {
    const lastIndex = filteredItems.length - 1;
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
        event.preventDefault();
        select(activeIndex);
        break;
      case ' ':
        // In search mode, Space must type a space, not select.
        if (!searchable) {
          event.preventDefault();
          select(activeIndex);
        }
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

  const panelClassName = clsx(
    { 'w-100': block, 'bg-white shadow rounded-4 p-8': !unstyled },
    menuClassName,
    className,
  );

  const activeDescendant =
    filteredItems.length > 0 ? optionId(activeIndex) : undefined;

  return (
    <div
      {...restMenuProps}
      ref={menuRef}
      className={panelClassName}
      style={style}
    >
      {searchable && (
        <div className="pb-8">
          <SearchBar
            isVariant
            clearable
            size="md"
            placeholder={searchPlaceholder}
            value={query}
            autoFocus
            role="combobox"
            aria-expanded
            aria-controls={listboxId}
            aria-activedescendant={activeDescendant}
            onChange={(event) => {
              setQuery(event.target.value);
              onSearch?.(event.target.value);
            }}
            onKeyDown={handleNavKeyDown}
          />
          {query && filteredItems.length === 0 && (
            <p className="body-2 text-gray-700 text-center mt-8 mb-0">
              {noResultsLabel}
            </p>
          )}
        </div>
      )}

      <div
        id={listboxId}
        ref={setListboxEl}
        role="listbox"
        tabIndex={searchable ? -1 : 0}
        aria-label={ariaLabel}
        aria-activedescendant={searchable ? undefined : activeDescendant}
        onKeyDown={searchable ? undefined : handleNavKeyDown}
        style={{ maxHeight, minHeight: 0, overflowY: 'auto' }}
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
            const item = filteredItems[index];
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
    </div>
  );
}

DropdownVirtualizedMenu.displayName = 'Dropdown.VirtualizedMenu';
