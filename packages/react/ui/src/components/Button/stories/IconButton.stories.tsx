import { Meta } from "@storybook/react";

import IconButton from "../IconButton";
import { AddUser, Block, Hourglass } from "@edifice-ui/icons";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta: Meta<typeof IconButton> = {
  title: "Components/Buttons/Icon Button",
  component: IconButton,
  argTypes: {
    color: {
      options: ["primary", "secondary", "tertiary", "danger"],
      control: { type: "select" },
    },
    variant: {
      options: ["filled", "outline", "ghost"],
      control: { type: "select" },
    },
    type: {
      options: ["button", "submit", "reset"],
      control: { type: "select" },
    },
  },
  args: {
    "aria-label": "",
    color: "primary",
    variant: "filled",
    disabled: false,
  },
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
};

export default meta;

export const Base = {
  args: {
    "aria-label": "Add User",
    color: "primary",
    variant: "filled",
    type: "button",
    disabled: false,
    icon: <AddUser />,
  },
};

export const IconWithAriaLabel = {
  args: {
    "aria-label": "Add User",
    color: "primary",
    variant: "filled",
    type: "button",
    disabled: false,
    icon: <AddUser title="Add User" />,
  },

  parameters: {
    docs: {
      description: {
        story:
          "When using an Icon Button, please provide a text to the aria-label attribute with ariaLabel props to make it accessible.",
      },
    },
  },
};

export const LoadingIconButton = {
  args: {
    "aria-label": "Loading",
    color: "primary",
    variant: "filled",
    type: "button",
    isLoading: true,
  },

  parameters: {
    docs: {
      description: {
        story:
          "When loading, please provide a text to the aria-label attribute to make it accessible.",
      },
    },
  },
};

export const LoadingIconButtonWithCustomIcon = {
  args: {
    "aria-label": "Loading",
    color: "primary",
    variant: "filled",
    type: "button",
    isLoading: true,
    loadingIcon: <Hourglass title="Loading" />,
  },

  parameters: {
    docs: {
      description: {
        story:
          "You can override the default loading icon with a custom one using `loadingIcon` props.",
      },
    },
  },
};

export const DisabledIconButton = {
  args: {
    "aria-label": "Add User",
    color: "primary",
    variant: "filled",
    type: "button",
    disabled: true,
    icon: <Block title="Add User" />,
  },
};
