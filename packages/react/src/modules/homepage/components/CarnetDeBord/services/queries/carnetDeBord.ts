import { queryOptions, useQuery } from '@tanstack/react-query';
import { carnetDeBordService } from '../api';

const STALE_TIME = 5 * 60 * 1000;

export const carnetDeBordQueryKeys = {
  all: () => ['carnet-de-bord'] as const,
};

export const carnetDeBordQueryOptions = {
  getStructures() {
    return queryOptions({
      queryKey: carnetDeBordQueryKeys.all(),
      queryFn: () => carnetDeBordService.getStructures(),
      staleTime: STALE_TIME,
    });
  },
};

export const usePronoteStructures = () =>
  useQuery(carnetDeBordQueryOptions.getStructures());
