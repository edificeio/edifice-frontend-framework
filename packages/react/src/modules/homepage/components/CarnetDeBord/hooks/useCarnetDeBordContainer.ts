import { useMemo, useState } from 'react';
import { useUser } from '../../../../../hooks';
import { usePronoteStructures } from '../services/queries/carnetDeBord';
import { CarnetDeBordStatus, ParsedEleve } from '../types';
import { parseEleves, UserChild } from '../utils';

export interface UseCarnetDeBordContainerReturn {
  status: CarnetDeBordStatus;
  eleves: ParsedEleve[];
  currentEleveIndex: number;
  onEleveChange: (index: number) => void;
  /** True when the user is a parent ("Relative"), false for a student. */
  isRelative: boolean;
}

/**
 * Custom hook that provides the students ("eleves") parsed from the Pronote
 * exports of the user's structures.
 */
export const useCarnetDeBordContainer = (): UseCarnetDeBordContainerReturn => {
  const { user } = useUser();
  const { data, isPending, isError } = usePronoteStructures();
  const [currentEleveIndex, setCurrentEleveIndex] = useState(0);

  const eleves = useMemo(() => {
    if (!data) return [];
    return parseEleves(
      data,
      (user?.children as Record<string, UserChild>) ?? {},
    );
  }, [data, user?.children]);

  let status: CarnetDeBordStatus = 'default';
  if (isError) status = 'error';
  else if (isPending) status = 'loading';
  else if (eleves.length === 0) status = 'empty';

  return {
    status,
    eleves,
    currentEleveIndex,
    onEleveChange: setCurrentEleveIndex,
    isRelative: user?.type === 'PERSRELELEVE',
  };
};
