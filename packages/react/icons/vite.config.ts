import { resolve } from "path";

import react from "@vitejs/plugin-react";
import { visualizer } from "rollup-plugin-visualizer";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

import { peerDependencies } from "./package.json";

export default defineConfig({
  esbuild: {
    minifyIdentifiers: false,
  },
  build: {
    lib: {
      entry: {
        index: resolve(__dirname, "src/index.ts"),
        nav: resolve(__dirname, "src/nav/index.ts"),
        audience: resolve(__dirname, "src/audience/index.ts"),
      },
      formats: ["es"],
    },
    rollupOptions: {
      external: [...Object.keys(peerDependencies), "react/jsx-runtime"],
    },
  },
  plugins: [react(), dts(), visualizer()],
});
