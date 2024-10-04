import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  type ReactNode,
} from "react";

import { UseQueryResult } from "@tanstack/react-query";
import {
  App,
  IGetConf,
  IGetSession,
  IUserDescription,
  IUserInfo,
  IWebApp,
  UserProfile,
} from "edifice-ts-client";
import { useTranslation } from "react-i18next";

import { useConf } from "../useConf";
import { useSession } from "../useSession";

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

export const OdeClientContext = createContext<OdeContextProps | null>(null!);

export function OdeClientProvider({ children, params }: OdeClientProps) {
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
    <OdeClientContext.Provider value={values}>
      {children}
    </OdeClientContext.Provider>
  );
}

export function useOdeClient() {
  const context = useContext(OdeClientContext);

  if (!context) {
    throw new Error(`Cannot be used outside of OdeClientProvider`);
  }
  return context;
}
