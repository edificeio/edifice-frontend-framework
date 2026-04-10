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
  const { searchQuery, setSearchQuery, hasMatches } = useDropdownContext();

  return (
    <div className="px-8 pb-8">
      <SearchBar
        isVariant
        clearable
        size="md"
        placeholder={placeholder}
        value={searchQuery}
        onChange={(e) => {
          setSearchQuery(e.target.value);
          onSearch?.(e.target.value);
        }}
        onKeyDown={(e) => {
          if (['ArrowUp', 'ArrowDown', 'Enter', ' '].includes(e.key)) {
            e.stopPropagation();
          }
        }}
      />
      {searchQuery && !hasMatches && (
        <p className="body-2 text-gray-700 text-center mt-8 mb-0">
          {noResultsLabel}
        </p>
      )}
    </div>
  );
};

DropdownSearchInput.displayName = 'Dropdown.SearchInput';

export default DropdownSearchInput;
