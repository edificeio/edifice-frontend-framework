import { odeServices } from '@edifice.io/client';
import { queryOptions, useQuery } from '@tanstack/react-query';

export interface CommunitiesModel {
  id: number | string;
  title: string;
  image?: string;
}

interface CommunitiesSearchResponse {
  items: CommunitiesModel[];
}

export function useCommunities() {
  const { data, isLoading, error } = useQuery(
    queryOptions({
      queryKey: ['communities', 'preview'],
      queryFn: async () => {
        const http = odeServices.http();
        const response = await http.get<CommunitiesSearchResponse>(
          '/communities/api/communities?page=1&size=4',
        );

        if (http.isResponseError()) {
          throw new Error(http.latestResponse.statusText);
        }

        return response.items;
      },
    }),
  );

  return { communities: data ?? [], isLoading, error };
}
