/// <reference types="vitest/config" />

import { resolve } from 'path';
import Sonda from 'sonda/vite';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

import { dependencies } from './package.json';

export default defineConfig(({ mode }) => {
  const isAnalyze = mode === 'analyze';

  return {
    build: {
      sourcemap: isAnalyze,
      lib: {
        entry: resolve(__dirname, './src/ts/index.ts'),
        name: '@edifice.io/client',
        fileName: 'index',
        formats: ['cjs', 'es'],
      },
      rolldownOptions: {
        external: [...Object.keys(dependencies)],
      },
    },
    plugins: [
      dts({
        tsconfigPath: './tsconfig.build.json',
      }),
      isAnalyze && Sonda(),
    ].filter(Boolean),

    test: {
      watch: false,
      globals: true,
      environment: 'jsdom',
      include: ['src/**/*.spec.ts'],
      setupFiles: ['./vitest.setup.ts'],
      reporters: ['default'],
    },
  };
});
