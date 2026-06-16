import url from '@rollup/plugin-url';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { PluginPure } from 'rollup-plugin-pure';
import { visualizer } from 'rollup-plugin-visualizer';
import dts from 'vite-plugin-dts';
import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';
import type { PluginOption } from 'vite';
import { removeDsn } from '../../plugins/remove-display-name';

export default defineConfig(({ mode }) => {
  const isTest = mode === 'test';
  const isAnalyze = mode === 'analyze';

  return {
    esbuild: {
      minifyIdentifiers: false,
    },
    rollupOptions: {
      plugins: [
        url({ limit: Infinity }) as PluginOption,
      ],
      output: {
        preserveModules: true,
        preserveModulesRoot: 'src',
      },
      external: [
        //...Object.keys(dependencies),
        //...Object.keys(peerDependencies),
        //'react/jsx-runtime',
        //'@edifice.io/client',
        ///^@edifice\.io\/tiptap-extensions\/.*/,
        ///^@edifice\.io\/bootstrap\/(?!dist\/images\/).*/,
        ///^dayjs\/plugin\/.+\.js$/,
        ///^dayjs\/locale\/.+\.js$/,
        ///^antd\/locale\/.+/,
        ///^swiper\/.*/,
        ///^@edifice-ui\/icons\/.*/,
      ],
    },
    plugins: [
      react({
        babel: {
          plugins: ['@babel/plugin-transform-react-pure-annotations'],
        },
      }),

      tsconfigPaths(),

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

      !isTest &&
        PluginPure({
          functions: ['Object.assign'],
        }),

      isAnalyze && visualizer(),
    ].filter(Boolean),

    build: {
      lib: {
        entry: {
          'audience': resolve(__dirname, 'src/modules/audience/index.ts'),
          'comments': resolve(__dirname, 'src/modules/comments/index.ts'),
          'editor': resolve(__dirname, 'src/modules/editor/index.ts'),
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

      rollupOptions: {
        external: [
          // Singletons React partagés via l'import map
          'react',
          'react-dom',
          'react-dom/client',
          'react/jsx-runtime',

          // PeerDependencies à état partagé (Provider singleton)
          // → entrées correspondantes dans recette/assets/importmap.json
          '@react-spring/web',
          '@tanstack/react-query',
          'react-hook-form',
          'react-i18next',

          // Autres paquets EFF servis via l'import map
          '@edifice.io/client',
          /^@edifice\.io\/client\/.*/,
          '@edifice.io/bootstrap',
          /^@edifice\.io\/bootstrap\/(?!dist\/images\/).*/,

          // @edifice.io/tiptap-extensions est tightly couplé à l'éditeur EFF
          // et n'a pas vocation à être consommé indépendamment par les apps :
          // on le BUNDLE dans le dist d'EFF (pas d'entrée dans l'import map).

          // Tout le reste (clsx, dayjs, antd, tiptap, swiper, pixi, etc.)
          // est volontairement BUNDLÉ dans le dist d'EFF.
        ],
        plugins: [
          url({ limit: Infinity }) as PluginOption,
        ],
        output: {
          preserveModules: false,
        },
      },
    },

    test: {
      environment: 'jsdom',
      globals: true,
      include: ['src/**/*.spec.tsx'],
      setupFiles: ['./vitest.setup.ts'],
      watch: false,
      clearMocks: true,
      restoreMocks: true,
    },
  };
});

export const reactEsmConfig = defineConfig({
  build: {
    emptyOutDir: false,
    lib: {
      entry: {
        'react': resolve(__dirname, 'src/shims/react.ts'),
        'jsx-runtime': resolve(__dirname, 'src/shims/jsx-runtime.ts'),
      },
      formats: ['es'],
      fileName: (_, entryName) => `${entryName}.js`,
    },
    outDir: 'dist/react-esm',
    rollupOptions: {
      external: [],
      output: {
        preserveModules: false,
      },
    },
  },
  plugins: [
    react({
      babel: {
        plugins: ['@babel/plugin-transform-react-pure-annotations'],
      },
    }),
  ],
});

export const reactDomEsmConfig = defineConfig({
  build: {
    emptyOutDir: false,
    lib: {
      entry: {
        'react-dom': resolve(__dirname, 'src/shims/react-dom.ts'),
        'react-dom/client': resolve(__dirname, 'src/shims/react-dom-client.ts'),
      },
      formats: ['es'],
      fileName: (_, entryName) => `${entryName}.js`,
    },
    outDir: 'dist/react-esm',
    rollupOptions: {
      external: [],
      output: {
        preserveModules: false,
      },
    },
  },
  plugins: [
    react({
      babel: {
        plugins: ['@babel/plugin-transform-react-pure-annotations'],
      },
    }),
  ],
});

// Bundle des peer dependencies à état partagé (Provider singleton).
// Chaque shim produit un bundle ESM self-contained (transitives inlinées)
// que recette sert via l'import map sous /assets/js/edifice-react/react-esm/.
// React/react-dom/jsx-runtime restent external pour préserver le singleton.
export const peerDepsEsmConfig = defineConfig({
  build: {
    emptyOutDir: false,
    lib: {
      entry: {
        'react-hook-form': resolve(__dirname, 'src/shims/react-hook-form.ts'),
        'react-i18next': resolve(__dirname, 'src/shims/react-i18next.ts'),
        'tanstack-react-query': resolve(
          __dirname,
          'src/shims/tanstack-react-query.ts',
        ),
        'react-spring-web': resolve(
          __dirname,
          'src/shims/react-spring-web.ts',
        ),
        // ode-explorer est servi via le shim EFF pour inliner ses transitives
        // (notamment @dnd-kit/*) sans les ajouter à l'import map.
        'ode-explorer': resolve(__dirname, 'src/shims/ode-explorer.ts'),
      },
      formats: ['es'],
      fileName: (_, entryName) => `${entryName}.js`,
    },
    outDir: 'dist/react-esm',
    rollupOptions: {
      // Externals étendus pour éviter la circularité quand on bundle ode-explorer :
      // ses propres imports de @edifice.io/* doivent rester external pour utiliser
      // les bundles principaux servis sur /assets/js/edifice-*.
      external: [
        'react',
        'react-dom',
        'react/jsx-runtime',
        '@edifice.io/react',
        /^@edifice\.io\/react\/.*/,
        '@edifice.io/client',
        /^@edifice\.io\/client\/.*/,
        '@edifice.io/bootstrap',
        /^@edifice\.io\/bootstrap\/.*/,
      ],
      output: {
        preserveModules: false,
      },
    },
  },
  plugins: [
    react({
      babel: {
        plugins: ['@babel/plugin-transform-react-pure-annotations'],
      },
    }),
  ],
});
