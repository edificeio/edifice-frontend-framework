import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import Sonda from 'sonda/vite';
import dts from 'vite-plugin-dts';
import { defineConfig } from 'vitest/config';
import { removeDsn } from '../../plugins/remove-display-name';
import { dependencies, peerDependencies } from './package.json';

export default defineConfig(({ mode }) => {
  const isTest = mode === 'test';
  const isAnalyze = mode === 'analyze';

  return {
    plugins: [
      react({
        babel: {
          plugins: ['@babel/plugin-transform-react-pure-annotations'],
        },
      }),

      // Pas utile en test
      !isTest &&
        removeDsn({
          includeExtensions: ['.ts', '.tsx'],
          excludeExtensions: ['.stories.tsx'],
        }),

      !isTest &&
        dts({
          tsconfigPath: './tsconfig.build.json',
        }),

      isAnalyze && Sonda(),
    ].filter(Boolean),

    resolve: {
      tsconfigPaths: true,
    },

    build: {
      sourcemap: isAnalyze,
      lib: {
        entry: {
          'audience': resolve(__dirname, 'src/modules/audience/index.ts'),
          'comments': resolve(__dirname, 'src/modules/comments/index.ts'),
          'editor': resolve(__dirname, 'src/modules/editor/index.ts'),
          'homepage': resolve(__dirname, 'src/modules/homepage/index.ts'),
          'icons': resolve(__dirname, 'src/modules/icons/components/index.ts'),
          'icons-nav': resolve(
            __dirname,
            'src/modules/icons/components/nav/index.ts',
          ),
          'icons-apps': resolve(
            __dirname,
            'src/modules/icons/components/apps/index.ts',
          ),
          'icons-audience': resolve(
            __dirname,
            'src/modules/icons/components/audience/index.ts',
          ),
          'modals': resolve(__dirname, 'src/modules/modals/index.ts'),
          'multimedia': resolve(__dirname, 'src/modules/multimedia/index.ts'),
          'index': resolve(__dirname, 'src/index.ts'),
        },
        formats: ['es'],
      },

      rolldownOptions: {
        external: [
          ...Object.keys(dependencies ?? {}),
          ...Object.keys(peerDependencies ?? {}),
          'react/jsx-runtime',
          '@edifice.io/client',
          /^@edifice\.io\/tiptap-extensions\/.*/,
          /^@edifice\.io\/bootstrap\/.*/,
          /^dayjs\/plugin\/.+(\.js)?$/,
          /^dayjs\/locale\/.+(\.js)?$/,
          /^antd\/locale\/.+/,
          /^swiper\/.*/,
          /^@edifice-ui\/icons\/.*/,
        ],
        output: {
          preserveModules: true,
          preserveModulesRoot: 'src',
          minify: { mangle: false },
        },
        treeshake: {
          manualPureFunctions: ['Object.assign'],
        },
      },
    },

    test: {
      environment: 'jsdom',
      globals: true,
      include: ['src/**/*.spec.{ts,tsx}'],
      setupFiles: ['./vitest.setup.ts'],
      watch: false,
      clearMocks: true,
      restoreMocks: true,
      coverage: {
        provider: 'v8',
        reporter: ['text', 'html', 'lcov'],
        include: ['src/**/*.{ts,tsx}'],
        exclude: [
          'src/**/*.stories.tsx',
          'src/**/*.spec.{ts,tsx}',
          'src/**/*.d.ts',
          'src/**/index.ts',
          'src/modules/icons/components/**',
          'src/types/**',
          'src/modules/editor/test-utils/**',
        ],
        // Starting thresholds intentionally set below the actual measured
        // baseline (see ENABLING-996) so CI doesn't fail on the current
        // state of the package. Audit target: 30% then 50% within 6 months
        // — raise these floors incrementally as coverage improves, never
        // lower them.
        //
        // Functions/branches floors were re-baselined for Vitest 4: its
        // AST-aware V8 engine (now the only one) also counts functions and
        // branches in files no test imports, which the previous engine
        // ignored. Coverage did not regress — the denominators grew.
        // Measured baseline as of 2026-08-06: lines 87.48%, statements
        // 87.3%, functions 84.99%, branches 84.13%.
        thresholds: {
          lines: 84,
          statements: 84,
          functions: 82,
          branches: 81,
        },
      },
    },
  };
});
