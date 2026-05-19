import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
import { defineConfig } from 'vitest/config';

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  test: {
    projects: [
      'packages/react/vite.config.ts',
      'packages/client/vite.config.ts',
      {
        plugins: [storybookTest({ configDir: resolve(__dirname, 'apps/docs/.storybook') })],
        test: {
          name: 'storybook',
          browser: {
            enabled: true,
            headless: true,
            provider: 'playwright',
            instances: [{ browser: 'chromium' }],
          },
        },
      },
    ],
  },
});
