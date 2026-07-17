import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode, useState } from 'react';
import { EdificeClientContext } from '../EdificeClientProvider/EdificeClientProvider.context';
import { EdificeThemeContext } from '../EdificeThemeProvider/EdificeThemeProvider.context';
import { mockConf, mockQueryResult, mockSession } from './MockedProvider.mocks';

export const MockedProvider = ({ children }: { children: ReactNode }) => {
  // One QueryClient per mount (not a module-level singleton), so each
  // render() call in a test gets its own isolated query cache instead of
  // leaking cached data into other tests in the same file.
  const [queryClient] = useState(() => new QueryClient());

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
