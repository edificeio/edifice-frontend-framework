import type { StorybookConfig } from "@storybook/react-vite";

const config: StorybookConfig = {
  stories: [
    "../../../packages/react/**/src/**/*.stories.@(js|jsx|ts|tsx)",
    "../../../packages/react/**/src/**/*.mdx",
  ],
  addons: ["@storybook/addon-essentials", "@storybook/addon-interactions"],
  framework: {
    name: "@storybook/react-vite",
    options: {
      builder: {
        viteConfigPath: "vite.config.ts",
      },
    },
  },
  staticDirs: ["../public"],
  typescript: {
    reactDocgen: "react-docgen",
  },
  docs: {
    autodocs: true,
  },
};

export default config;

// To customize your Vite configuration you can use the viteFinal field.
// Check https://storybook.js.org/docs/react/builders/vite#configuration
// and https://nx.dev/recipes/storybook/custom-builder-configs
