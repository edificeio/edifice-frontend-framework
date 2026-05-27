import { IWidgetPreferences, odeServices } from '@edifice.io/client';
import {
  queryOptions,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';

const WIDGETS_QUERY_KEY = ['widgets', 'system'];
const PREFERENCES_QUERY_KEY = ['widgets', 'preferences'];

export function useWidgetPreferences() {
  const queryClient = useQueryClient();

  const { data: widgets } = useQuery(
    queryOptions({
      queryKey: WIDGETS_QUERY_KEY,
      queryFn: () => odeServices.widget().getSystemWidgets(),
    }),
  );

  const { data: preferences } = useQuery(
    queryOptions({
      queryKey: PREFERENCES_QUERY_KEY,
      queryFn: () => odeServices.widget().getPreferences(),
    }),
  );

  const preferencesMutation = useMutation({
    mutationFn: (prefs: IWidgetPreferences) =>
      odeServices.widget().setPreferences(prefs),
    onMutate: async (prefs) => {
      // Optimistic update
      queryClient.setQueryData(PREFERENCES_QUERY_KEY, () => prefs);
    },
    onError() {
      queryClient.invalidateQueries({ queryKey: PREFERENCES_QUERY_KEY });
    },
  });

  return {
    widgets,
    preferences,
    savePreferences: (prefs: IWidgetPreferences) =>
      preferencesMutation.mutateAsync(prefs),
  };
}
