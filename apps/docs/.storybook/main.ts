import type { StorybookConfig } from "@storybook/react-vite";
import { dirname, join } from "path";
const config: StorybookConfig = {
  stories: [
    "../../../packages/**/**/src/**/*.stories.@(js|jsx|ts|tsx)",
    "../../../packages/**/**/src/**/*.mdx",
    "../../../docs/**/*.mdx",
  ],
  staticDirs: ["../public"],
  addons: [
    getAbsolutePath("@storybook/addon-a11y"),
    getAbsolutePath("@storybook/addon-links"),
    getAbsolutePath("@storybook/addon-essentials"),
    getAbsolutePath("@storybook/addon-interactions"),
    "@chromatic-com/storybook",
  ],
  typescript: {
    reactDocgen: "react-docgen",
  },
  framework: {
    name: getAbsolutePath("@storybook/react-vite"),
    options: { strictMode: false },
  },
};
export default config;

function getAbsolutePath(value: string): any {
  return dirname(require.resolve(join(value, "package.json")));
}
