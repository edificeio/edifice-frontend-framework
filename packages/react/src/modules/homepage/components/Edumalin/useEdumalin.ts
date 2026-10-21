import { odeServices } from '@edifice.io/client';
import { queryOptions, useQuery } from '@tanstack/react-query';
import { useUserSchools } from '../../hooks/useUserSchools';
import { buildGarLink } from './buildGarLink';
import { EdumalinError, EdumalinItem, EdumalinStatus } from './types';
import { EDUMALIN_UNAUTHORIZED, parseEdumalinError } from './utils';

const EDUMALIN_MAX_ITEMS = 3;

interface EdumalinFeed {
  data?: EdumalinItem[];
}

export const edumalinQueryOptions = queryOptions<EdumalinItem[], EdumalinError>(
  {
    queryKey: ['edumalin'],
    // Failures are deterministic (missing credentials, Édumalin down):
    // retrying only delays the error state.
    retry: false,
    queryFn: async () => {
      const http = odeServices.http();
      try {
        const feed = await http.get<EdumalinFeed>(
          '/appregistry/edumalin/widget',
        );
        return feed.data ?? [];
      } catch (body) {
        // HttpService rejects with the response body; the status is only
        // available on the latest response.
        throw parseEdumalinError(body, http.latestResponse);
      }
    },
  },
);

/**
 * Loads the Édumalin contents of the user's profile (first 3, in the order
 * sent by Édumalin) and the GAR link of the selected school.
 */
export function useEdumalin() {
  const { selectedSchool } = useUserSchools();
  const { data, isLoading, error } = useQuery(edumalinQueryOptions);

  const items = (data ?? []).slice(0, EDUMALIN_MAX_ITEMS);

  const status: EdumalinStatus = error
    ? error.message === EDUMALIN_UNAUTHORIZED
      ? 'connectionError'
      : 'loadError'
    : isLoading
      ? 'loading'
      : items.length > 0
        ? 'default'
        : 'empty';

  return {
    status,
    items,
    error,
    edumalinUrl: buildGarLink(selectedSchool),
  };
}
