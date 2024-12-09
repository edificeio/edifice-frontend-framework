import type { StorybookConfig } from '@storybook/react-vite';
import { dirname, join, resolve } from 'path';

const config: StorybookConfig = {
  stories: [
    '../../../packages/**/src/**/*.stories.@(js|jsx|ts|tsx)',
    '../../../packages/**/src/**/*.mdx',
    '../src/stories/**/*.stories.@(js|jsx|ts|tsx)',
    '../src/stories/**/*.mdx',
  ],
  staticDirs: ['../public'],
  addons: [
    getAbsolutePath('@storybook/addon-a11y'),
    getAbsolutePath('@storybook/addon-links'),
    getAbsolutePath('@storybook/addon-essentials'),
    getAbsolutePath('@storybook/addon-interactions'),
    getAbsolutePath('@chromatic-com/storybook'),
  ],
  typescript: {
    reactDocgen: 'react-docgen',
  },
  framework: {
    name: getAbsolutePath('@storybook/react-vite'),
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
            __dirname,
            'node_modules/@edifice.io/bootstrap/dist/images',
          ),
        },
      },
    });
  },
};
export default config;

function getAbsolutePath(value: string): any {
  return dirname(require.resolve(join(value, 'package.json')));
}
