import { useEffect, useState } from 'react';

import { odeServices } from '@edifice.io/client';

import { useQuery } from '@tanstack/react-query';
import { useHasWorkflow } from '../useHasWorkflow';

const useConversation = () => {
  const zimbraWorkflow = useHasWorkflow(
    'fr.openent.zimbra.controllers.ZimbraController|view',
  );
  const zimbraPreauth = useHasWorkflow(
    'fr.openent.zimbra.controllers.ZimbraController|preauth',
  );

  /**
   * Count conversation app
   */
  const [msgLink, setMsgLink] = useState<string>('');
  /**
   * Get message count for zimbra or chat app
   */
  const queryParams = {
    unread: true,
    _: new Date().getTime(),
  };

  if (!zimbraWorkflow) {
    queryParams['queryparam_token'] = new Date().getTime();
    // To force backend cache to refresh
  }

  const { data: messages } = useQuery({
    queryKey: ['folder', 'count', 'inbox'],
    queryFn: async () => {
      return await odeServices
        .http()
        .get(
          zimbraWorkflow ? '/zimbra/count/INBOX' : '/conversation/count/inbox',
          { queryParams },
        );
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const goToMessagerie = async () => {
    const defaultLink = '/zimbra/zimbra';

    try {
      const { preference } = await odeServices
        .http()
        .get('/userbook/preference/zimbra');
      const isExpertMode = preference
        ? JSON.parse(preference).modeExpert
        : false;
      setMsgLink(
        isExpertMode && zimbraPreauth
          ? '/zimbra/preauth'
          : window.location.origin + defaultLink,
      );
    } catch (error) {
      console.error(error);
      setMsgLink(window.location.origin + defaultLink);
    }
  };

  useEffect(() => {
    goToMessagerie();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    messages: messages ? messages.count : 0,
    msgLink,
    zimbraWorkflow,
  } as const;
};

export default useConversation;
