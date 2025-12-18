import { defineConfig } from 'vite';
import { resolve } from 'path';
import dts from 'vite-plugin-dts';

export default defineConfig({
  plugins: [
    dts({
      outDir: 'dist/browser',
      insertTypesEntry: true,
      rollupTypes: true
    })
  ],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'RestClientBase',
      fileName: 'index',
      formats: ['es']
    },
    outDir: 'dist/browser',
    rollupOptions: {
      // Bundle all dependencies for react native and browser usage
      output: {
        inlineDynamicImports: true
      }
    }
  },
  resolve: {
    alias: {
      '@decorators/custom-type.decorator': resolve(__dirname, 'src/decorators/custom-type.decorator.browser.ts')
    }
  }
});