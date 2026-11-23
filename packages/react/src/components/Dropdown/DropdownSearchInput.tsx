import { useCallback } from 'react';
import { createPortal } from 'react-dom';

import { SearchBar } from '../SearchBar';
import { useDropdownContext } from './DropdownContext';

export interface DropdownSearchInputProps {
  /**
   * Placeholder text for the search input
   */
  placeholder?: string;
  /**
   * Label shown when no items match the search query
   */
  noResultsLabel?: string;
  /**
   * Called whenever the search query changes.
   * Useful to track the current query outside the Dropdown context.
   */
  onSearch?: (query: string) => void;
}

const DropdownSearchInput = ({
  placeholder = 'Rechercher...',
  noResultsLabel = 'Pas de résultat',
  onSearch,
}: DropdownSearchInputProps) => {
  const {
    searchQuery,
    setSearchQuery,
    hasMatches,
    searchInputRef,
    setHasSearchInput,
    rootElement,
    itemProps,
  } = useDropdownContext();

  // SearchBar does not forward refs: register its input from the wrapper.
  const registerSearchInput = useCallback(
    (node: HTMLDivElement | null) => {
      searchInputRef.current = node?.querySelector('input') ?? null;
      setHasSearchInput(!!node);
    },
    [searchInputRef, setHasSearchInput],
  );

  // While the menu is open, the trigger turns into the search input:
  // it is displayed over the trigger, the list stays below.
  const searchInput = (
    <div ref={registerSearchInput} className="dropdown-search">
      <SearchBar
        isVariant
        clearable
        size="md"
        className="dropdown-search-bar"
        data-testid="dropdown-search-input"
        placeholder={placeholder}
        value={searchQuery}
        onChange={(e) => {
          setSearchQuery(e.target.value);
          onSearch?.(e.target.value);
        }}
        onKeyDown={(e) => {
          if (
            e.key === 'ArrowDown' ||
            e.key === 'Escape' ||
            (e.key === 'Tab' && e.shiftKey)
          ) {
            itemProps.onMenuItemKeyDown(e);
          }
          if (['ArrowUp', 'ArrowDown', 'Enter', ' '].includes(e.key)) {
            e.stopPropagation();
          }
        }}
      />
    </div>
  );

  return (
    <>
      {rootElement && createPortal(searchInput, rootElement)}
      {searchQuery && !hasMatches && (
        <p className="dropdown-no-results" data-testid="dropdown-no-results">
          {noResultsLabel}
        </p>
      )}
    </>
  );
};

DropdownSearchInput.displayName = 'Dropdown.SearchInput';

export default DropdownSearchInput;
