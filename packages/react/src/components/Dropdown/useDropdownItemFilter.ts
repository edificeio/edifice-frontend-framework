import { useId, useLayoutEffect } from 'react';

import { useDropdownContext } from './DropdownContext';

/**
 * Shared filtering logic for Dropdown item components.
 * Computes whether the item is hidden by the current search query,
 * and keeps the match registry in sync via reportMatch/unregisterMatch.
 *
 * @returns `id`        – stable element id to spread on the DOM node and itemRefs
 * @returns `isFiltered` – true when the item should be hidden
 */
export const useDropdownItemFilter = (searchValue: string | undefined) => {
  const { searchQuery, reportMatch, unregisterMatch } = useDropdownContext();
  const id = useId();

  const isFiltered =
    searchValue !== undefined &&
    searchQuery !== '' &&
    !searchValue.toLowerCase().includes(searchQuery.toLowerCase());

  useLayoutEffect(() => {
    if (searchValue === undefined) return;
    reportMatch(id, !isFiltered);
    return () => unregisterMatch(id);
  }, [id, isFiltered, searchValue, reportMatch, unregisterMatch]);

  return { id, isFiltered };
};
