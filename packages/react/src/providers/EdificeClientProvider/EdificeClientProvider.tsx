import { useEffect, useMemo, type ReactNode } from "react";

import {
  App,
  IGetConf,
  IGetSession,
  IUserDescription,
  IUserInfo,
  IWebApp,
  UserProfile,
} from "@edifice.io/ts-client";
import { UseQueryResult } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { useConf, useSession } from "../../hooks";
import { EdificeClientContext } from "./EdificeClientProvider.context";

export interface OdeProviderParams {
  alternativeApp?: boolean;
  app: App;
  cdnDomain?: string | null;
  version?: string | null;
}

export interface OdeClientProps {
  children: ReactNode;
  params: OdeProviderParams;
}

export interface OdeContextProps {
  appCode: App;
  applications: IWebApp[] | undefined;
  confQuery: UseQueryResult<IGetConf>;
  currentApp: IWebApp | undefined;
  currentLanguage: string | undefined;
  init: boolean;
  sessionQuery: UseQueryResult<IGetSession>;
  user: IUserInfo | undefined;
  userDescription: Partial<IUserDescription> | undefined;
  userProfile: UserProfile | undefined;
}

export function EdificeClientProvider({ children, params }: OdeClientProps) {
  const appCode = params.app;

  const { t } = useTranslation();
  const translatedAppCode = t(appCode);

  const sessionQuery = useSession();
  const confQuery = useConf({ appCode });

  const init = confQuery?.isSuccess && sessionQuery?.isSuccess;

  const currentLanguage = sessionQuery?.data?.currentLanguage ?? "fr";

  useEffect(() => {
    const attributes = [
      {
        data: "html",
        value: currentLanguage,
      },
      // #WB-3137 Disable the translation of the content of the page which provoced issues
      {
        data: "translate",
        value: "no",
      },
    ];

    attributes.forEach((attribute) => {
      return document
        .querySelector("html")
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
