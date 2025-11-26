import { Preview } from '@storybook/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { initialize, mswLoader } from 'msw-storybook-addon';
import { I18nextProvider } from 'react-i18next';
import '../../../packages/bootstrap/dist/index.css';
import {
  EdificeClientProvider,
  EdificeThemeProvider,
} from '../../../packages/react/src/providers';

import i18n from '../i18n';
import React from 'react';

import {
  actualitesHandlers,
  authHandlers,
  blogHandlers,
  commonHandlers,
  directoryHandlers,
  publicConfigHandlers,
  shareHandlers,
  themeHandlers,
  userbookHandlers,
  wikiHandlers,
  workspaceHandlers,
} from '@edifice.io/config';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
});

const preview: Preview = {
  beforeAll: async () => {
    // Initialize MSW
    initialize({
      onUnhandledRequest: 'bypass',
      serviceWorker: {
        url: './mockServiceWorker.js',
      },
    });
  },
  tags: ['autodocs'],
  globalTypes: {
    theme: {
      name: 'theme',
      description: 'Select theming',
      defaultValue: 'one',
      toolbar: {
        icon: 'switchalt',
        items: ['one', 'neo', 'side-by-side'],
      },
    },
    app: {
      defaultValue: 'wiki',
    },
  },
  parameters: {
    viewMode: 'docs',
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
    options: {
      storySort: {
        method: 'alphabetical',
        order: [
          'Introduction',
          ['Welcome', 'Getting Started', '*'],
          'Design System',
          'Components',
          ['Base', '*'],
          'Forms',
          'Hooks',
          'Client',
          'Layout',
          'Modules',
        ],
      },
    },
    msw: {
      handlers: {
        config: publicConfigHandlers,
        userbook: userbookHandlers,
        theme: themeHandlers,
        directory: directoryHandlers,
        workspace: workspaceHandlers,
        common: commonHandlers,
        auth: authHandlers,
        wiki: wikiHandlers,
        blog: blogHandlers,
        share: shareHandlers,
        actualites: actualitesHandlers,
      },
    },
  },
  // Provide the MSW addon loader globally
  loaders: [mswLoader],
  decorators: [
    (Story, context) => {
      /**
       * App value default to "one"
       */
      const theme = context.globals.theme;
      /**
       * App value default to "wiki"
       */
      const app = context.globals.app;

      const MockedPortal = () => <div id="portal" />;

      const StoryTheme = ({ themePath }: { themePath: string }) => {
        return (
          <div data-product={themePath} className="my-12">
            <Story />
            <MockedPortal />
          </div>
        );
      };

      const renderStoryTheme = () => {
        switch (theme) {
          case 'side-by-side': {
            return (
              <>
                <StoryTheme themePath="one" />
                <StoryTheme themePath="neo" />
              </>
            );
          }
          case 'one': {
            return <StoryTheme themePath="one" />;
          }
          case 'neo': {
            return <StoryTheme themePath="neo" />;
          }
          case 'default': {
            return <StoryTheme themePath={theme} />;
          }
        }
      };

      return (
        <QueryClientProvider client={queryClient}>
          <I18nextProvider i18n={i18n}>
            <EdificeClientProvider
              params={{
                app,
              }}
            >
              <EdificeThemeProvider defaultTheme="none">
                {renderStoryTheme()}
              </EdificeThemeProvider>
            </EdificeClientProvider>
          </I18nextProvider>
        </QueryClientProvider>
      );
    },
  ],
};

export default preview;
