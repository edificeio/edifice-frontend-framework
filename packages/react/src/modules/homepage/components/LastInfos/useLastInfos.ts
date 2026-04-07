import { odeServices } from '@edifice.io/client';
import { queryOptions, useQuery } from '@tanstack/react-query';

export interface LastInfosModel {
  modifiedDate: string; // "2021-03-24T16:36:05.398"
  thread: {
    id: number; // 221
    icon: string; // "/workspace/document/36a04526-15a2-4e8f-adb6-cca75630e50d"
    title: string; // "News collège Denis Poisson"
  };
  title: string; // "xx"
  username: string; // "DEVAULX ALAIN"
  id: number; // 597
}

export function useLastInfos() {
  const { data, isLoading, error } = useQuery(
    queryOptions({
      queryKey: ['infos', 'preview', 'last', 6],
      queryFn: async () => {
        const http = odeServices.http();
        const infos = await http.get<LastInfosModel[]>(
          '/actualites/api/v1/infos/preview/last/6',
        );
        if (http.isResponseError()) {
          throw new Error(http.latestResponse.statusText);
        }
        return infos;
      },
    }),
  );

  return { infos: data, isLoading, error };
}
