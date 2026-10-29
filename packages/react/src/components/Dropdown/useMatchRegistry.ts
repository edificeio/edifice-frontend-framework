import { useCallback, useRef, useState } from 'react';

/**
 * Tracks which searchable items match the current search query.
 * Used by the Dropdown root (empty state) and by menu groups (hide empty groups).
 *
 * @returns `hasMatches`      – true when at least one item matches, or when no item is searchable
 * @returns `reportMatch`     – registers or updates the match state of an item
 * @returns `unregisterMatch` – removes an item from the registry
 */
export const useMatchRegistry = () => {
  const [hasMatches, setHasMatches] = useState(true);
  const matchMapRef = useRef<Map<string, boolean>>(new Map());

  const reportMatch = useCallback((id: string, isMatch: boolean) => {
    matchMapRef.current.set(id, isMatch);
    const next = [...matchMapRef.current.values()].some(Boolean);
    setHasMatches((prev) => (prev !== next ? next : prev));
  }, []);

  const unregisterMatch = useCallback((id: string) => {
    matchMapRef.current.delete(id);
    const next =
      matchMapRef.current.size === 0 ||
      [...matchMapRef.current.values()].some(Boolean);
    setHasMatches((prev) => (prev !== next ? next : prev));
  }, []);

  return { hasMatches, reportMatch, unregisterMatch };
};
