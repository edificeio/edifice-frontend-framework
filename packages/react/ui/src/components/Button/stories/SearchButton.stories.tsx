import { Search, UserSearch } from "@edifice-ui/icons";
import { Meta, StoryObj } from "@storybook/react";

import SearchButton from "../SearchButton";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta: Meta<typeof SearchButton> = {
  title: "Components/Buttons/SearchButton",
  component: SearchButton,
  args: {
    "aria-label": "search",
    type: "button",
    disabled: false,
    icon: <Search />,
  },
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
};

export default meta;
type Story = StoryObj<typeof SearchButton>;

export const Base: Story = {};

export const WithCustomIcon: Story = {
  args: {
    icon: <UserSearch />,
  },
};
