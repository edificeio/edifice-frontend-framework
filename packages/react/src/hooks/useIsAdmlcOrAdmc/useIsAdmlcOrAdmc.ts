import { useMemo } from 'react';

import { useIsAdml } from '../useIsAdml';
import { useIsAdmc } from '../useIsAdmc';

export default function useIsAdmlcOrAdmc() {
  const { isAdml } = useIsAdml();
  const { isAdmc } = useIsAdmc();

  const isAdmlcOrAdmc = useMemo(
    () => Boolean(isAdml || isAdmc),
    [isAdml, isAdmc],
  );

  return {
    isAdmlcOrAdmc,
  };
}
