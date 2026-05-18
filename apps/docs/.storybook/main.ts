import type { StorybookConfig } from '@storybook/react-vite';
import { dirname, resolve } from 'path';
import remarkGfm from 'remark-gfm';
import { fileURLToPath } from 'url';

const config: StorybookConfig = {
  stories: [
    '../../../packages/react/src/**/*.stories.@(js|jsx|ts|tsx)',
    '../../../packages/react/src/**/*.mdx',
    '../src/stories/**/*.stories.@(js|jsx|ts|tsx)',
    '../src/stories/**/*.mdx',
  ],
  staticDirs: ['../public'],
  addons: [
    '@storybook/addon-a11y',
    {
      name: '@storybook/addon-docs',
      options: {
        mdxPluginOptions: {
          mdxCompileOptions: {
            providerImportSource: '@mdx-js/react',
            // Enable GitHub Flavored Markdown (tables, strikethrough, etc.) in MDX docs.
            remarkPlugins: [remarkGfm],
          },
        },
      },
    },
    '@chromatic-com/storybook',
    '@storybook/addon-vitest',
    '@github-ui/storybook-addon-performance-panel',
  ],
  typescript: {
    reactDocgen: 'react-docgen',
  },
  framework: {
    name: '@storybook/react-vite',
    options: { strictMode: false },
  },
  docs: {},
  async viteFinal(config) {
    // Merge custom configuration into the default config
    const { mergeConfig } = await import('vite');

    return mergeConfig(config, {
      oxc: {
        jsx: 'automatic',
      },
      resolve: {
        alias: {
          // Mermaid renderer used by MDX docs pages (e.g. UserRightsList guide).
          '@docs/Mermaid': resolve(
            dirname(fileURLToPath(import.meta.url)),
            'Mermaid.tsx',
          ),
        },
      },
      optimizeDeps: {
        include: [
          'react',
          'react-dom',
          'react/jsx-runtime',
          'react-i18next',
          'i18next',
          '@tanstack/react-query',
          'msw-storybook-addon',
        ],
        rolldownOptions: {
          sourcemap: false,
        },
      },
    });
  },
};
export default config;
