import { createContext, type ReactNode } from 'react';

import {
  App,
  IGetConf,
  IGetSession,
  IUserDescription,
  IUserInfo,
  IWebApp,
  UserProfile,
} from '@edifice.io/client';
import { UseQueryResult } from '@tanstack/react-query';

export interface EdificeClientParams {
  alternativeApp?: boolean;
  app: App;
  cdnDomain?: string | null;
  version?: string | null;
}

export interface EdificeClientProviderProps {
  children: ReactNode;
  params: EdificeClientParams;
}

export interface EdificeClientContextProps {
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

export const EdificeClientContext =
  createContext<EdificeClientContextProps | null>(null!);
