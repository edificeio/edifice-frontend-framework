import type { StorybookConfig } from '@storybook/react-vite';
import { dirname, join, resolve } from 'path';
import { fileURLToPath } from 'url';

const config: StorybookConfig = {
  stories: [
    '../../../packages/**/src/**/*.stories.@(js|jsx|ts|tsx)',
    '../../../packages/**/src/**/*.mdx',
    '../src/stories/**/*.stories.@(js|jsx|ts|tsx)',
    '../src/stories/**/*.mdx',
  ],
  staticDirs: ['../public'],
  addons: [
    '@storybook/addon-a11y',
    '@storybook/addon-links',
    '@storybook/addon-docs',
    '@chromatic-com/storybook',
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
      // Add dependencies to pre-optimization
      resolve: {
        alias: {
          '@images': resolve(
            dirname(fileURLToPath(import.meta.url)),
            '../node_modules/@edifice.io/bootstrap/dist/images',
          ),
        },
      },
    });
  },
};
export default config;
