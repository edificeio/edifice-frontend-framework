import { resolve } from "path";

import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

import { dependencies } from "./package.json";

export default defineConfig({
  build: {
    sourcemap: true,
    lib: {
      entry: {
        index: resolve(__dirname, "src/index.ts"),
      },
    },
    rolldownOptions: {
      output: [
        {
          preserveModules: true,
          preserveModulesRoot: "src",
          entryFileNames: ({ name: fileName }) => {
            return `${fileName}.js`;
          },
          minify: { mangle: false },
        },
        {
          preserveModules: true,
          preserveModulesRoot: "src",
          format: "cjs",
          entryFileNames: ({ name: fileName }) => {
            return `${fileName}.cjs`;
          },
          minify: { mangle: false },
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
