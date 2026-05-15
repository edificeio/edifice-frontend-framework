import { App, odeServices } from '@edifice.io/client';
import { useQuery } from '@tanstack/react-query';

export default function usePublicConf<T>(appCode: App) {
  return useQuery<T>({
    queryKey: ['publicConf', appCode],
    queryFn: () => odeServices.conf().getPublicConf<T>(appCode),
    staleTime: Infinity,
  });
}
