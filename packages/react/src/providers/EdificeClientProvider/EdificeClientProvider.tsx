import { useEffect, useMemo } from 'react';

import { App } from '@edifice.io/client';
import { useTranslation } from 'react-i18next';
import { useConf } from '../../hooks/useConf';
import { useSession } from '../../hooks/useSession';
import {
  EdificeClientContext,
  EdificeClientProviderProps,
} from './EdificeClientProvider.context';

export interface OdeProviderParams {
  alternativeApp?: boolean;
  app: App;
  cdnDomain?: string | null;
  version?: string | null;
}

export function EdificeClientProvider({
  children,
  params,
}: EdificeClientProviderProps) {
  const appCode = params.app;

  const { t } = useTranslation();
  const translatedAppCode = t(appCode);

  const sessionQuery = useSession();
  const confQuery = useConf({ appCode });

  const init = confQuery?.isSuccess && sessionQuery?.isSuccess;

  const currentLanguage = sessionQuery?.data?.currentLanguage ?? 'fr';

  useEffect(() => {
    const attributes = [
      {
        data: 'html',
        value: currentLanguage,
      },
      // #WB-3137 Disable the translation of the content of the page which provoced issues
      {
        data: 'translate',
        value: 'no',
      },
    ];

    attributes.forEach((attribute) => {
      return document
        .querySelector('html')
        ?.setAttribute(attribute.data, attribute.value as string);
    });
  }, [currentLanguage, sessionQuery.data]);

  useEffect(() => {
    document.title = `${translatedAppCode}`;
  }, [appCode, sessionQuery.data, translatedAppCode]);

  const values = useMemo(
    () => ({
      appCode,
      applications: confQuery?.data?.applications,
      confQuery,
      currentApp: confQuery?.data?.currentApp,
      currentLanguage,
      init,
      sessionQuery,
      user: sessionQuery?.data?.user,
      userDescription: sessionQuery?.data?.userDescription,
      userProfile: sessionQuery?.data?.userProfile,
    }),
    [appCode, confQuery, currentLanguage, init, sessionQuery],
  );

  return (
    <EdificeClientContext.Provider value={values}>
      {children}
    </EdificeClientContext.Provider>
  );
}
