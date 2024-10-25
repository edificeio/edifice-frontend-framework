// .storybook/manager

import { addons } from "@storybook/manager-api";
import { themes } from "@storybook/theming";
import theme from "./theme";

addons.setConfig({
  theme,
});
