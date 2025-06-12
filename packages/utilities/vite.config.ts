import { resolve } from 'path';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

// uncomment if you add external dependencies
// import { dependencies } from "./package.json";

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, './src/index.ts'),
      name: 'utilities',
      fileName: 'index',
      formats: ['cjs', 'es'],
    },
    rollupOptions: {
      output: [
        {
          preserveModules: true,
          preserveModulesRoot: 'src',
          entryFileNames: ({ name: fileName }) => {
            return `${fileName}.js`;
          },
        },
        {
          preserveModules: true,
          preserveModulesRoot: 'src',
          format: 'cjs',
          entryFileNames: ({ name: fileName }) => {
            return `${fileName}.cjs`;
          },
        },
      ],
      // uncomment if you add external dependencies
      // external: [...Object.keys(dependencies)],
    },
  },
  plugins: [dts()],
});
