// @ts-check

import { fileURLToPath } from 'node:url';

export const publishOptions = {
  packages: [
    {
      name: '@edifice.io/client',
      packageDir: 'packages/client',
    },
    {
      name: '@edifice.io/bootstrap',
      packageDir: 'packages/bootstrap',
    },
    {
      name: '@edifice.io/react',
      packageDir: 'packages/react',
    },
    {
      name: '@edifice.io/utilities',
      packageDir: 'packages/utilities',
    },
    {
      name: '@edifice.io/tiptap-extensions',
      packageDir: 'packages/extensions',
    },
  ],

  branchConfigs: {
    'main': {
      prerelease: false,
    },
    'develop': {
      prerelease: true,
    },
    'develop-hotfix': {
      prerelease: true,
    },
    'develop-enabling': {
      prerelease: true,
    },
    'develop-rc': {
      prerelease: true,
    },
    'develop-b2school': {
      prerelease: true,
    },
    'develop-pedago': {
      prerelease: true,
    },
    'develop-mozo': {
      prerelease: true,
    },
    'develop-integration': {
      prerelease: true,
    },
  },

  // eslint-disable-next-line no-undef
  ghToken: process.env.GH_TOKEN,

  rootDir: fileURLToPath(new URL('.', import.meta.url)),
};
