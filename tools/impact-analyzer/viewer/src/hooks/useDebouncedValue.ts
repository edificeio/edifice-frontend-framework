import { useEffect, useState } from 'react';

/**
 * Delays reflecting `value` until it stops changing for `delayMs` — used to
 * avoid re-filtering/re-sorting a large list (e.g. 1000+ symbols) on every
 * single keystroke while the user is still typing.
 */
export function useDebouncedValue<T>(value: T, delayMs: number): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(timer);
  }, [value, delayMs]);

  return debounced;
}
