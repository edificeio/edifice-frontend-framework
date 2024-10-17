import { useEffect, useState } from 'react';

import { odeServices } from '@edifice.io/ts-client';

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
  const [messages, setMessages] = useState<number>(0);
  const [msgLink, setMsgLink] = useState<string>('');
  /**
   * Get message count for zimbra or chat app
   */
  const queryParams = { unread: true, _: new Date().getTime() };

  const refreshMails = async () => {
    const url = zimbraWorkflow
      ? '/zimbra/count/INBOX'
      : '/conversation/count/INBOX';

    try {
      const { count } = await odeServices.http().get(url, { queryParams });

      setMessages(count ?? 0);
    } catch (error) {
      console.error(error);
      setMessages(0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  };

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  };

  useEffect(() => {
    refreshMails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    goToMessagerie();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { messages, msgLink, zimbraWorkflow } as const;
};

export default useConversation;
