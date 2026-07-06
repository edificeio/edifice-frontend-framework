import { useCallback, useState } from 'react';

function readParams(): URLSearchParams {
  return new URLSearchParams(window.location.search);
}

/**
 * Syncs one URL query param with React state, so the current view (tab,
 * branch, selected symbol/app/diff) is always a shareable link — the point
 * of a tool meant to be shown dev <-> QA, not just consulted by its author.
 * Uses replaceState rather than pushState: every selection would otherwise
 * spam the back-button history with one entry per click.
 */
export function useUrlParam(
  key: string,
): [string | null, (value: string | null) => void] {
  const [value, setValue] = useState<string | null>(() =>
    readParams().get(key),
  );

  const update = useCallback(
    (next: string | null) => {
      setValue(next);
      const params = readParams();
      if (next === null || next === '') params.delete(key);
      else params.set(key, next);
      const query = params.toString();
      const url = `${window.location.pathname}${query ? `?${query}` : ''}${window.location.hash}`;
      window.history.replaceState(null, '', url);
    },
    [key],
  );

  return [value, update];
}
