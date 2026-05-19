import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode } from 'react';
import { EdificeClientContext } from '../EdificeClientProvider/EdificeClientProvider.context';
import { EdificeThemeContext } from '../EdificeThemeProvider/EdificeThemeProvider.context';
import { mockConf, mockQueryResult, mockSession } from './MockedProvider.mocks';

const queryClient = new QueryClient();

export const MockedProvider = ({ children }: { children: ReactNode }) => {
  const themeContextValue = {
    theme: 'default',
    setTheme: vi.fn(),
  } as any;

  const clientContextValue = {
    appCode: 'wiki' as const,
    applications: mockConf.applications,
    confQuery: mockQueryResult(mockConf),
    currentApp: mockConf.currentApp,
    currentLanguage: mockSession.currentLanguage,
    init: true,
    sessionQuery: mockQueryResult(mockSession),
    user: mockSession.user,
    userDescription: mockSession.userDescription,
    userProfile: mockSession.userProfile,
  };

  return (
    <QueryClientProvider client={queryClient}>
      <EdificeClientContext.Provider value={clientContextValue}>
        <EdificeThemeContext.Provider value={themeContextValue}>
          {children}
        </EdificeThemeContext.Provider>
      </EdificeClientContext.Provider>
    </QueryClientProvider>
  );
};
