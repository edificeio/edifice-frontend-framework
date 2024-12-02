import React, { StrictMode } from 'react';

import { EdificeClientProvider, EdificeThemeProvider } from '@edifice-ui/react';
import {
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ERROR_CODE } from 'edifice-ts-client';
import { createRoot } from 'react-dom/client';

import 'edifice-bootstrap/dist/index.css';
import Playground from './components/Playground';
import './i18n';

const rootElement = document.getElementById('root');
const root = createRoot(rootElement!);

if (process.env.NODE_ENV !== 'production') {
  import('@axe-core/react').then((axe) => {
    axe.default(React, root, 1000);
  });
}

const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error) => {
      if (typeof error === 'string') {
        if (error === ERROR_CODE.NOT_LOGGED_IN)
          window.location.replace('/auth/login');
      }
    },
  }),
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
});

root.render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <EdificeClientProvider
        params={{
          app: 'blog',
        }}
      >
        <EdificeThemeProvider>
          <Playground />
        </EdificeThemeProvider>
      </EdificeClientProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </StrictMode>,
);
