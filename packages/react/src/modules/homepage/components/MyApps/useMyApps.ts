import { odeServices } from '@edifice.io/client';
import { queryOptions, useQuery } from '@tanstack/react-query';

export function useMyApps() {
  const { data, isLoading, error } = useQuery(
    queryOptions({
      queryKey: [],
      queryFn: async () => {
        const apps = (await odeServices.session().getSession()).bookmarkedApps;
        return apps;
      },
    }),
  );

  return { apps: data, isLoading, error };
}
