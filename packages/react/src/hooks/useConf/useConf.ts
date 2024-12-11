import { App, IGetConf, odeServices } from '@edifice.io/client';
import { useQuery } from '@tanstack/react-query';

export default function useConf({ appCode }: { appCode: App }) {
  return useQuery<IGetConf>({
    queryKey: ['conf'],
    queryFn: async () => await odeServices.conf().getConf(appCode),
  });
}
