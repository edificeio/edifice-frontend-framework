import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    sourcemap: false,
    rollupOptions: {
      external: [
        "@edifice-ui/icons",
        "@edifice-ui/icons/nav",
        "@edifice-ui/icons/audience",
      ],
    },
  },
});
