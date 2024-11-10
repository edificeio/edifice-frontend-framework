// @ts-check

import { fileURLToPath } from "node:url";

export const publishOptions = {
  packages: [
    {
      name: "@edifice.io/cli",
      packageDir: "packages/cli",
    },
    {
      name: "edifice-ts-client",
      packageDir: "packages/client",
    },
    {
      name: "edifice-bootstrap",
      packageDir: "packages/bootstrap",
    },
    {
      name: "@edifice-ui/react",
      packageDir: "packages/react/ui",
    },
    {
      name: "@edifice-ui/editor",
      packageDir: "packages/react/editor",
    },
    {
      name: "@edifice-ui/icons",
      packageDir: "packages/react/icons",
    },
  ],

  branchConfigs: {
    "main": {
      prerelease: false,
    },
    "develop": {
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
