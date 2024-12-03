// @ts-check

import { fileURLToPath } from "node:url";

export const publishOptions = {
  packages: [
    {
      name: "edifice-ts-client",
      packageDir: "packages/client",
    },
    {
      name: "edifice-bootstrap",
      packageDir: "packages/bootstrap",
    },
    {
      name: "@edifice.io/react",
      packageDir: "packages/react/ui",
    },
    {
      name: "@edifice.io/image-resizer",
      packageDir: "packages/image-resizer",
    },
    {
      name: "@edifice.io/tiptap-extensions",
      packageDir: "packages/tiptap/extensions",
    },
  ],

  branchConfigs: {
    "main": {
      prerelease: false,
    },
    "develop": {
      prerelease: true,
    },
    "develop-hotfix": {
      prerelease: true,
    },
    "develop-b2school": {
      prerelease: true,
    },
    "develop-pedago": {
      prerelease: true,
    },
    "develop-mozo": {
      prerelease: true,
    },
    "develop-integration": {
      prerelease: true,
    },
  },

  // eslint-disable-next-line no-undef
  ghToken: process.env.GH_TOKEN,

  rootDir: fileURLToPath(new URL(".", import.meta.url)),
};
