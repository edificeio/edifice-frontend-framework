import { defineConfig } from 'vite';
import { resolve } from 'path';
import dts from 'vite-plugin-dts';

export default defineConfig({
  plugins: [
    dts({
      outDir: 'dist/node',
      insertTypesEntry: true,
      rollupTypes: true
    })
  ],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'RestClientBase',
      fileName: 'index',
      formats: ['es', 'cjs']
    },
    outDir: 'dist/node',
    rollupOptions: {
      // no need to bundle deps for node usage
      external: ['@nestjs/swagger'],
      output: {
        globals: {
          '@nestjs/swagger': 'NestSwagger'
        }
      }
    }
  },
  resolve: {
    alias: {
      '@decorators/custom-type.decorator': resolve(__dirname, 'src/decorators/custom-type.decorator.node.ts')
    }
  }
});