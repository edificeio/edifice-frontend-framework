import { queryOptions, useQuery } from '@tanstack/react-query';
import { useSession } from 'src/hooks/useSession';
import { mediacentreService } from '../services/mediacentreService';

const STALE_TIME = 5 * 60 * 1000;

export const mediacentreQueryKeys = {
  all: () => ['mediacentre'] as const,
  favorites: () => [...mediacentreQueryKeys.all(), 'favorites'] as const,
};

export const mediacentreQueryOptions = {
  getFavorites() {
    return queryOptions({
      queryKey: mediacentreQueryKeys.favorites(),
      queryFn: () => mediacentreService.getFavorites(),
      staleTime: STALE_TIME,
    });
  },
};

export function useMediacentre() {
  const { data: session } = useSession();
  const favoritesQuery = useQuery(mediacentreQueryOptions.getFavorites());

  return {
    resources: favoritesQuery.data ?? [],
    isLoading: favoritesQuery.isLoading,
    isError: favoritesQuery.isError,
    uai: session?.userDescription?.schools?.[0]?.UAI,
  };
}
