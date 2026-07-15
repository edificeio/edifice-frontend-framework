import { odeServices } from '@edifice.io/client';
import { queryOptions, useQuery } from '@tanstack/react-query';

export interface CommunitiesModel {
  id: number | string;
  title: string;
  communityImage?: string;
  icon?: string;
  nbNotifications?: number;
  notifications?: number;
}

export function useCommunities() {
  const { data, isLoading, error } = useQuery(
    queryOptions({
      queryKey: ['communities', 'preview'],
      queryFn: async () => {
        const http = odeServices.http();
        const communities = await http.get<CommunitiesModel[]>(
          '/community/api/v1/communities',
        );

        if (http.isResponseError()) {
          throw new Error(http.latestResponse.statusText);
        }

        return communities;
      },
    }),
  );

  return { communities: data ?? [], isLoading, error };
}
