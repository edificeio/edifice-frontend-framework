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
    {
      name: "@edifice.io/image-resizer",
      packageDir: "packages/image-resizer",
    },
    {
      name: "@edifice-tiptap-extensions/extension-image",
      packageDir: "packages/tiptap/extensions/extension-image",
    },
    {
      name: "@edifice-tiptap-extensions/extension-alert",
      packageDir: "packages/tiptap/extensions/extension-alert",
    },
    {
      name: "@edifice-tiptap-extensions/extension-attachment",
      packageDir: "packages/tiptap/extensions/extension-attachment",
    },
    {
      name: "@edifice-tiptap-extensions/extension-audio",
      packageDir: "packages/tiptap/extensions/extension-audio",
    },
    {
      name: "@edifice-tiptap-extensions/extension-font-size",
      packageDir: "packages/tiptap/extensions/extension-font-size",
    },
    {
      name: "@edifice-tiptap-extensions/extension-heading",
      packageDir: "packages/tiptap/extensions/extension-heading",
    },
    {
      name: "@edifice-tiptap-extensions/extension-highlight",
      packageDir: "packages/tiptap/extensions/extension-highlight",
    },
    {
      name: "@edifice-tiptap-extensions/extension-hyperlink",
      packageDir: "packages/tiptap/extensions/extension-hyperlink",
    },
    {
      name: "@edifice-tiptap-extensions/extension-iframe",
      packageDir: "packages/tiptap/extensions/extension-iframe",
    },
    {
      name: "@edifice-tiptap-extensions/extension-line-height",
      packageDir: "packages/tiptap/extensions/extension-line-height",
    },
    {
      name: "@edifice-tiptap-extensions/extension-mathjax",
      packageDir: "packages/tiptap/extensions/extension-mathjax",
    },
    {
      name: "@edifice-tiptap-extensions/extension-paragraph",
      packageDir: "packages/tiptap/extensions/extension-paragraph",
    },
    {
      name: "@edifice-tiptap-extensions/extension-linker",
      packageDir: "packages/tiptap/extensions/extension-linker",
    },
    {
      name: "@edifice-tiptap-extensions/extension-speechrecognition",
      packageDir: "packages/tiptap/extensions/extension-speechrecognition",
    },
    {
      name: "@edifice-tiptap-extensions/extension-speechsynthesis",
      packageDir: "packages/tiptap/extensions/extension-speechsynthesis",
    },
    {
      name: "@edifice-tiptap-extensions/extension-table-cell",
      packageDir: "packages/tiptap/extensions/extension-table-cell",
    },
    {
      name: "@edifice-tiptap-extensions/extension-video",
      packageDir: "packages/tiptap/extensions/extension-video",
    },
    {
      name: "@edifice-tiptap-extensions/transform",
      packageDir: "packages/tiptap/extensions/transform",
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
