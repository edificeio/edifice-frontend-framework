import { odeServices } from '@edifice.io/client';
import { queryOptions, useQuery } from '@tanstack/react-query';

export interface CommunitiesModel {
  id: number | string;
  title: string;
  image?: string;
}

// Max number of items the preview list can display (see `.communities-list`).
export const COMMUNITIES_PREVIEW_SIZE = 6;

interface CommunitiesSearchResponse {
  items: CommunitiesModel[];
}

export function useCommunities({ enabled = true }: { enabled?: boolean } = {}) {
  const { data, isLoading, error } = useQuery(
    queryOptions({
      queryKey: ['communities', 'preview'],
      queryFn: async () => {
        const http = odeServices.http();
        const response = await http.get<CommunitiesSearchResponse>(
          `/communities/api/communities?page=1&size=${COMMUNITIES_PREVIEW_SIZE}`,
        );

        if (http.isResponseError()) {
          throw new Error(http.latestResponse.statusText);
        }

        return response.items;
      },
      enabled,
    }),
  );

  return { communities: data ?? [], isLoading, error };
}
