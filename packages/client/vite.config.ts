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
  plugins: [dts(), visualizer() as PluginOption],
});
