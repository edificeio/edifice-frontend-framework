import { odeServices } from '@edifice.io/client';
import { useQueries } from '@tanstack/react-query';

export const useProfileQueries = (usersIds: string[]) => {
  const results = useQueries({
    queries: usersIds.map((userId) => ({
      queryKey: ['post', userId],
      queryFn: async () => {
        const data = await odeServices.session().getUserProfile({
          params: { id: userId },
        });

        return {
          userId,
          profile: data[0],
        };
      },
      staleTime: Infinity,
      enabled: !!userId,
    })),
    combine: (results) => {
      return {
        data: results.map((result) => result.data),
        isLoading: results.some((result) => result.isLoading),
      };
    },
  });
  return results;
};
