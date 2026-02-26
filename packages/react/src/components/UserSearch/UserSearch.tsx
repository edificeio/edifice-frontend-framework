import { type ReactNode, ChangeEvent, useEffect, useState } from 'react';
import { useDebounce } from '../../hooks';
import {
  IconBookmark,
  IconGroupAvatar,
  IconUser,
} from '../../modules/icons/components';
import { Combobox, OptionListItemType } from '../Combobox';
import type { UserSearchProps } from './types/types';
import { Visible, VisibleType } from './types/visible';

/**
 * User search component with combobox UI. Supports users, groups and bookmarks,
 * debounced search, and optional sharing/selection tracking.
 * Loading state is managed internally during getSearchResults calls.
 */
export const UserSearch = ({
  placeholder = 'Rechercher un utilisateur',
  isAdmlcOrAdmc = false,
  bookmarks = [],
  initialSharings = [],
  getSearchResults,
  onSearchResultsChange,
}: UserSearchProps) => {
  // Current list of search results (bookmarks + API results), excluding already shared items
  const [searchResults, setSearchResults] = useState<Visible[]>(bookmarks);
  // Raw input value from the search field
  const [searchInputValue, setSearchInputValue] = useState('');
  // Debounced value used to trigger API calls (500ms delay)
  const debouncedSearchInputValue = useDebounce<string>(searchInputValue, 500);
  // IDs of recipients already selected/shared, used to hide them from the dropdown
  const [sharingsIds, setSharingsIds] = useState<Set<string>>(
    new Set(initialSharings.map((item) => item.recipientId)),
  );
  // Internal loading state: true while getSearchResults is in progress
  const [isLoading, setIsLoading] = useState(false);

  // Minimum characters required before search: 3 for admin contexts, 1 otherwise
  const searchMinLength = isAdmlcOrAdmc ? 3 : 1;

  const getIcon = (type: VisibleType): ReactNode => {
    switch (type) {
      case VisibleType.User:
        return <IconUser />;
      case VisibleType.Group:
      case VisibleType.BroadcastGroup:
        return <IconGroupAvatar />;
      case VisibleType.ShareBookmark:
        return <IconBookmark />;
      default:
        return null;
    }
  };

  // Maps search result items to the format expected by Combobox options
  const searchResultsToOptions = (
    searchResults: Visible[],
  ): OptionListItemType[] => {
    return searchResults.map((result) => ({
      value: result.id,
      label: result.displayName,
      icon: getIcon(result.type),
    }));
  };

  // Removes results that are already in the sharings list from the dropdown
  const filterResults = (results: Visible[]) => {
    return results.filter((result) => !sharingsIds.has(result.id));
  };

  // Fetches search results when debounced input meets minimum length; manages internal loading state
  useEffect(() => {
    let cancelled = false;
    async function getResults() {
      setIsLoading(true);
      try {
        const response = await getSearchResults(debouncedSearchInputValue);
        if (!cancelled) {
          const rawResults = [...bookmarks, ...response.results];
          setSearchResults(filterResults(rawResults));
        }
      } catch {
        if (!cancelled) {
          setSearchResults(filterResults(bookmarks));
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    if (debouncedSearchInputValue.length >= searchMinLength) {
      getResults();
    } else {
      // When search term is too short, show only bookmarks (filtered) to avoid stale API results
      setSearchResults(filterResults(bookmarks));
    }

    return () => {
      cancelled = true;
      setIsLoading(false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearchInputValue]);

  // Updates search input state on every keystroke (debouncing is handled separately)
  const handleSearchInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchInputValue(event.target.value);
  };

  // When user selects an option: add to sharings, remove from list, and notify parent
  const handleSearchResultsChange = (model: Array<string | number>) => {
    const searchResultId = model[0];
    const searchResult = searchResults.find(
      (result) => result.id === searchResultId,
    );
    if (searchResult) {
      setSharingsIds((prev) => new Set([...prev, searchResult.id]));
      setSearchResults((prev) =>
        prev.filter((result) => result.id !== searchResult.id),
      );
      onSearchResultsChange?.(searchResult);
    }
  };

  // Renders the combobox with search state, options derived from results, and min length for search
  return (
    <Combobox
      data-testid="common-user-search-input-search"
      value={searchInputValue}
      placeholder={placeholder}
      isLoading={isLoading}
      noResult={searchResults.length === 0}
      options={searchResultsToOptions(searchResults)}
      searchMinLength={searchMinLength}
      onSearchInputChange={handleSearchInputChange}
      onSearchResultsChange={handleSearchResultsChange}
    />
  );
};
