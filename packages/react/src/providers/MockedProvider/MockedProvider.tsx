import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode } from 'react';
import { EdificeClientProvider } from '../EdificeClientProvider/EdificeClientProvider';
import { EdificeThemeContext } from '../EdificeThemeProvider/EdificeThemeProvider.context';

const queryClient = new QueryClient();

const Providers = ({ children }: { children: ReactNode }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <EdificeClientProvider
        params={{
          app: 'wiki',
        }}
      >
        {children}
      </EdificeClientProvider>
    </QueryClientProvider>
  );
};

export const MockedProvider = ({ children }: { children: ReactNode }) => {
  const themeContextValue = {
    theme: 'default',
    setTheme: vi.fn(),
  } as any;

  return (
    <Providers>
      <EdificeThemeContext.Provider value={themeContextValue}>
        {children}
      </EdificeThemeContext.Provider>
    </Providers>
  );
};
