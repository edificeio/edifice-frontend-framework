import { resolve } from "path";

import react from "@vitejs/plugin-react";
import { visualizer } from "rollup-plugin-visualizer";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

import { PluginOption } from "vite";
import { dependencies, peerDependencies } from "./package.json";

export default defineConfig({
  esbuild: {
    minifyIdentifiers: false,
  },
  build: {
    lib: {
      entry: {
        index: resolve(__dirname, "src/index.ts"),
      },
      formats: ["es"],
    },
    rollupOptions: {
      output: {
        preserveModules: true,
        preserveModulesRoot: "src",
      },
      external: [
        ...Object.keys(dependencies),
        ...Object.keys(peerDependencies),
        /^@edifice\.io\/tiptap-extensions\/.*/,
        "react/jsx-runtime",
        "edifice-ts-client",
        /^@edifice-ui\/icons\/.*/,
      ],
    },
  },
  plugins: [
    react({
      babel: {
        plugins: ["@babel/plugin-transform-react-pure-annotations"],
      },
    }),
    dts(),
    visualizer() as PluginOption,
  ],
});
