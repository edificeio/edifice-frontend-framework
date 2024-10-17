import { resolve } from 'path';

import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

import { dependencies, peerDependencies } from './package.json';

export default defineConfig({
  esbuild: {
    minifyIdentifiers: false,
  },
  build: {
    lib: {
      entry: {
        index: resolve(__dirname, 'src/index.ts'),
      },
      formats: ['es'],
    },
    rollupOptions: {
      output: {
        preserveModules: true,
      },
      external: [
        ...Object.keys(dependencies),
        ...Object.keys(peerDependencies),
        'react/jsx-runtime',
        '@edifice.io/ts-client',
        '@edifice.io/icons/nav',
      ],
    },
  },
  plugins: [
    react({
      babel: {
        plugins: ['@babel/plugin-transform-react-pure-annotations'],
      },
    }),
    dts(),
    visualizer(),
  ],
});
