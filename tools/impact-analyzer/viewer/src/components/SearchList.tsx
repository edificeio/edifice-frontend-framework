import { useMemo, useState, type ReactNode } from 'react';
import { useDebouncedValue } from '../hooks/useDebouncedValue.js';

export interface SearchListProps<T> {
  /** Already in the desired display order — SearchList only filters by query and caps, it never reorders. */
  items: T[];
  getKey: (item: T) => string;
  isSelected: (item: T) => boolean;
  onSelect: (item: T) => void;
  matches: (item: T, lowerCaseQuery: string) => boolean;
  renderItem: (item: T) => ReactNode;
  placeholder: string;
  /** Must be unique on the page — used for the input's id/label pairing. */
  inputId: string;
  maxItems?: number;
  /** 0 (default) skips debouncing entirely — only worth it for large lists (e.g. 1000+ symbols). */
  debounceMs?: number;
  /** Rendered next to the search input, e.g. SymbolSearch's PackageFilter. */
  extraControl?: ReactNode;
}

/**
 * Shared shell behind SymbolSearch and AppSearch, which were otherwise
 * near-identical (search input + filtered result list of clickable buttons).
 * Package filtering, sorting and per-item rendering stay in the caller —
 * only the parts that were byte-for-byte the same are factored here.
 */
export function SearchList<T>({
  items,
  getKey,
  isSelected,
  onSelect,
  matches,
  renderItem,
  placeholder,
  inputId,
  maxItems,
  debounceMs = 0,
  extraControl,
}: SearchListProps<T>) {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebouncedValue(query, debounceMs);

  const filtered = useMemo(() => {
    const q = debouncedQuery.trim().toLowerCase();
    return q ? items.filter((item) => matches(item, q)) : items;
  }, [items, debouncedQuery, matches]);

  const visible = maxItems ? filtered.slice(0, maxItems) : filtered;

  return (
    <>
      <div className="filter-row">
        <label htmlFor={inputId} className="visually-hidden">
          {placeholder}
        </label>
        <input
          id={inputId}
          className="search-input"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        {extraControl}
      </div>
      <ul className="result-list">
        {visible.map((item) => (
          <li key={getKey(item)}>
            <button
              className={`result-item${isSelected(item) ? ' result-item-selected' : ''}`}
              onClick={() => onSelect(item)}
            >
              {renderItem(item)}
            </button>
          </li>
        ))}
      </ul>
      {maxItems && filtered.length > maxItems && (
        <p className="hint">
          Affinez la recherche — {filtered.length} résultats, {maxItems}{' '}
          affichés.
        </p>
      )}
    </>
  );
}
