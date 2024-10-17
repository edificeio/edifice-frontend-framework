import react from '@vitejs/plugin-react-swc';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    sourcemap: false,
    rollupOptions: {
      external: [
        '@edifice.io/icons',
        '@edifice.io/icons/nav',
        '@edifice.io/icons/audience',
      ],
    },
  },
});
