import { odeServices } from '@edifice.io/client';

import { useQuery } from '@tanstack/react-query';
import { useHasWorkflow } from '../useHasWorkflow';

const CARBONIO_PREAUTH_WORKFLOW =
  'org.entcore.auth.controllers.CarbonioPreauthController|preauth';

const useCarbonioUnread = () => {
  const hasCarbonioWorkflow =
    useHasWorkflow(CARBONIO_PREAUTH_WORKFLOW) || false;

  const { data } = useQuery({
    queryKey: ['carbonio', 'unread', 'count'],
    queryFn: () =>
      odeServices.http().get<{ count: number }>('/auth/carbonio/unread', {
        disableNotifications: true,
      }),
    enabled: hasCarbonioWorkflow,
    staleTime: 5 * 60 * 1000,
    // Each call queries the Carbonio server: a failure means no badge, not another try.
    retry: false,
  });

  return {
    hasCarbonioWorkflow,
    unreadCount: data?.count ?? 0,
  } as const;
};

export default useCarbonioUnread;
