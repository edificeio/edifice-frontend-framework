import { resolve } from "path";

import react from "@vitejs/plugin-react";
import { visualizer } from "rollup-plugin-visualizer";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

import { PluginPure } from "rollup-plugin-pure";
import { PluginOption } from "vite";
import { removeDsn } from "../../plugins/remove-display-name";
import { dependencies, peerDependencies } from "./package.json";

export default defineConfig({
  esbuild: {
    minifyIdentifiers: false,
  },
  build: {
    lib: {
      entry: {
        "audience": resolve(__dirname, "src/modules/audience/index.ts"),
        "comments": resolve(__dirname, "src/modules/comments/index.ts"),
        "editor": resolve(__dirname, "src/modules/editor/index.ts"),
        "icons": resolve(__dirname, "src/modules/icons/components/index.ts"),
        "icons-nav": resolve(
          __dirname,
          "src/modules/icons/components/nav/index.ts",
        ),
        "icons-apps": resolve(
          __dirname,
          "src/modules/icons/components/apps/index.ts",
        ),
        "icons-audience": resolve(
          __dirname,
          "src/modules/icons/components/audience/index.ts",
        ),
        "modals": resolve(__dirname, "src/modules/modals/index.ts"),
        "multimedia": resolve(__dirname, "src/modules/multimedia/index.ts"),
        "index": resolve(__dirname, "src/index.ts"),
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
        "react/jsx-runtime",
        "@edifice.io/ts-client",
        /^@edifice\.io\/tiptap-extensions\/.*/,
        /^dayjs\/plugin\/.+\.js$/,
        /^dayjs\/locale\/.+\.js$/,
        /^swiper\/.*/,
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
    }) as PluginOption,
    visualizer() as PluginOption,
  ],
});
