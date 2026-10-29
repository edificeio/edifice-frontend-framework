import { useCallback, useRef, useState } from 'react';

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
