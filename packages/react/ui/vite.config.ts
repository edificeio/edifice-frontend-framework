import { resolve } from "path";

import react from "@vitejs/plugin-react";
import { visualizer } from "rollup-plugin-visualizer";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

import { PluginPure } from "rollup-plugin-pure";
import { removeDsn } from "../../../plugins/remove-display-name";
import { dependencies, peerDependencies } from "./package.json";

export default defineConfig({
  esbuild: {
    minifyIdentifiers: false,
  },
  build: {
    lib: {
      entry: {
        index: resolve(__dirname, "src/index.ts"),
        comments: resolve(__dirname, "src/modules/comments/index.ts"),
      },
      formats: ["es"],
    },
    rollupOptions: {
      external: [
        ...Object.keys(dependencies),
        ...Object.keys(peerDependencies),
        "dayjs/plugin/customParseFormat",
        "dayjs/plugin/relativeTime",
        "dayjs/locale/de",
        "dayjs/locale/es",
        "dayjs/locale/pt",
        "dayjs/locale/fr",
        "dayjs/locale/it",
        "swiper/react",
        "swiper/modules",
        "react/jsx-runtime",
        "edifice-ts-client",
        "@edifice-ui/icons/nav",
        "@edifice-ui/icons/audience",
      ],
    },
  },
  plugins: [
    react({
      babel: {
        plugins: ["@babel/plugin-transform-react-pure-annotations"],
      },
    }),
    removeDsn({
      includeExtensions: [".ts", ".tsx"],
      excludeExtensions: [".stories.tsx"],
    }),
    dts({
      tsconfigPath: "./tsconfig.build.json",
      compilerOptions: {
        baseUrl: ".",
        paths: {
          "@tanstack/react-query": ["node_modules/@tanstack/react-query"],
        },
      },
    }),
    PluginPure({
      functions: ["Object.assign"],
    }),
    visualizer(),
  ],
});
