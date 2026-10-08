import { resolve } from "path";

import dts from "vite-plugin-dts";
import { defineConfig } from "vitest/config";

import { peerDependencies } from "./package.json";

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
      // Rollup's `external` only matches an id exactly - subpath imports like
      // `@tiptap/pm/state` wouldn't match a bare `@tiptap/pm` entry and would
      // get bundled (pulling in prosemirror-* transitively). Match subpaths too.
      external: (id) =>
        Object.keys(peerDependencies).some(
          (dep) => id === dep || id.startsWith(`${dep}/`),
        ),
    },
  },
  plugins: [
    dts({
      tsconfigPath: "./tsconfig.json",
    }),
  ],
  test: {
    environment: "jsdom",
    globals: true,
    include: ["src/**/*.spec.ts"],
  },
});
