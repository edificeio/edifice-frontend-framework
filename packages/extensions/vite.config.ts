import { resolve } from "path";

import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

import { dependencies } from "./package.json";

export default defineConfig({
  esbuild: {
    minifyIdentifiers: false,
  },
  build: {
    sourcemap: true,
    lib: {
      entry: {
        index: resolve(__dirname, "src/index.ts"),
      },
    },
    rollupOptions: {
      output: [
        {
          preserveModules: true,
          preserveModulesRoot: "src",
          entryFileNames: ({ name: fileName }) => {
            return `${fileName}.js`;
          },
        },
        {
          preserveModules: true,
          preserveModulesRoot: "src",
          format: "cjs",
          entryFileNames: ({ name: fileName }) => {
            return `${fileName}.cjs`;
          },
        },
      ],
      external: [...Object.keys(dependencies)],
    },
  },
  plugins: [
    dts({
      tsconfigPath: "./tsconfig.json",
    }),
  ],
});
