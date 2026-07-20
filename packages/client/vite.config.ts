/// <reference types="vitest/config" />

import { resolve } from 'path';
import { visualizer } from 'rollup-plugin-visualizer';
import { defineConfig, PluginOption } from 'vite';
import dts from 'vite-plugin-dts';

import { dependencies } from './package.json';

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, './src/ts/index.ts'),
      name: '@edifice.io/client',
      fileName: 'index',
      formats: ['cjs', 'es'],
    },
    rollupOptions: {
      external: [...Object.keys(dependencies)],
    },
  },
  plugins: [
    dts({
      tsconfigPath: './tsconfig.build.json',
    }),
    visualizer() as PluginOption,
  ],

  test: {
    watch: false,
    globals: true,
    environment: 'jsdom',
    include: ['src/**/*.spec.ts'],
    setupFiles: ['./vitest.setup.ts'],
    reporters: ['default'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      include: ['src/**/*.ts'],
      exclude: ['src/**/*.spec.ts', 'src/**/*.d.ts', 'src/**/index.ts'],
      // Starting thresholds intentionally set below the actual measured
      // baseline (see ENABLING-996) so CI doesn't fail on the current
      // state of the package. Audit target: 30% then 50% within 6 months
      // — raise these floors incrementally as coverage improves, never
      // lower them. Measured baseline: lines/statements 4.4%, functions
      // 53.9%, branches 65.9% — this package has very little test
      // coverage today (2 spec files), hence the low lines/statements floor.
      thresholds: {
        lines: 3,
        statements: 3,
        functions: 40,
        branches: 55,
      },
    },
  },
});
