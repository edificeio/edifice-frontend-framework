import React, { useEffect, useRef } from 'react';

import { LAYER_NAME, odeServices } from '@edifice.io/client';
import { useTranslation } from 'react-i18next';

import { useToast } from '../..';
import { CustomToastOptions } from '../../hooks/useToast/useToast';

const useHttpErrorToast = (options?: CustomToastOptions) => {
  const message = useRef<string>();
  const toast = useToast();
  const { t } = useTranslation();

  useEffect(() => {
    const subscription = odeServices
      .notify()
      .events()
      .subscribe(LAYER_NAME.TRANSPORT, (event) => {
        if (!event?.data) return;
        const { response } = event.data;
        const i18nKey =
          // The payload may include the i18n key of the error message to show,
          event.data.payload?.error ||
          // otherwise, try showing the translation of some known HTTP error code.
          ([400, 401, 403, 404, 408, 413, 500, 504].includes(response?.status)
            ? `e${event.data.response.status}`
            : undefined) ||
          // otherwise try showing the statusText (may be technical, in english),
          response?.statusText;
        // Do not display empty toasts
        if (typeof i18nKey !== 'string') return;
        message.current = t(i18nKey);
        toast.error(
          React.createElement('div', { children: [message.current] }),
          options,
        );
      });

    return () => subscription.revoke();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [t, toast]);

  return message.current;
};

export default useHttpErrorToast;
