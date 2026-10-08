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
      coverage: {
        provider: 'v8',
        reporter: ['text', 'html', 'lcov'],
        include: ['src/**/*.ts'],
        exclude: ['src/**/*.spec.ts', 'src/**/*.d.ts', 'src/**/index.ts'],
        // Starting thresholds intentionally set below the actual measured
        // baseline (see ENABLING-996) so CI doesn't fail on the current
        // state of the package. Audit target: 30% then 50% within 6 months
        // — raise these floors incrementally as coverage improves, never
        // lower them. This package has very little test coverage today
        // (2 spec files), hence the low floors.
        //
        // Functions/branches floors were re-baselined for Vitest 4: its
        // AST-aware V8 engine (now the only one) also counts functions and
        // branches in files no test imports, which the previous engine
        // ignored. Coverage did not regress — the denominators grew.
        // Measured baseline as of 2026-07-28: lines 3.79%, statements
        // 3.72%, functions 3.37%, branches 2.43%.
        thresholds: {
          lines: 3,
          statements: 3,
          functions: 3,
          branches: 2,
        },
      },
    },
  };
});
