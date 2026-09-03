import { odeServices } from '@edifice.io/client';
import {
  queryOptions,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';

export const USER_PREFERENCES_QUERY_KEY = ['user', 'preferences'];

export function useUserPreferences<
  T extends Record<string, any> = Record<string, any>,
>() {
  const queryClient = useQueryClient();

  const {
    data: preferences,
    isLoading,
    isError,
    refetch,
  } = useQuery(
    queryOptions({
      queryKey: USER_PREFERENCES_QUERY_KEY,
      queryFn: () => odeServices.conf().getUserPreferences<T>(),
      staleTime: 15_000,
    }),
  );

  const mutation = useMutation({
    mutationFn: (preferences: T) =>
      odeServices.conf().saveUserPreferences(preferences),
    onMutate: async (preferences) => {
      queryClient.setQueryData(USER_PREFERENCES_QUERY_KEY, preferences);
    },
    onError: () => {
      queryClient.invalidateQueries({ queryKey: USER_PREFERENCES_QUERY_KEY });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: USER_PREFERENCES_QUERY_KEY });
    },
  });

  return {
    preferences,
    isLoading,
    isError,
    refetch,
    savePreferences: (preferences: T) => mutation.mutateAsync(preferences),
  };
}

export default useUserPreferences;
