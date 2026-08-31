import { odeServices } from '@edifice.io/client';
import { queryOptions, useQuery } from '@tanstack/react-query';

export interface CommunityStats {
  totalMembers: string;
  memberCount: string;
  adminCount: string;
  communityId: number;
}

export interface CommunitiesModel {
  id: number | string;
  title: string;
  image?: string;
  stats?: CommunityStats;
}

interface CommunitiesApiResponse {
  items: CommunitiesModel[];
  meta: {
    currentPage: number;
    itemCount: number;
    totalItems: number;
    totalPages: number;
    itemsPerPage: number;
  };
}

export function useCommunities() {
  const { data, isLoading, error } = useQuery(
    queryOptions({
      queryKey: ['communities', 'preview'],
      queryFn: async () => {
        const http = odeServices.http();
        const response = await http.get<CommunitiesApiResponse>(
          '/communities/api/communities?page=1&size=5&fields=stats',
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
