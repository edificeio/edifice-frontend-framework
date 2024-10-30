import { Meta, StoryObj } from "@storybook/react";

import {
  Delete,
  Plus,
  Record,
  RecordVideo,
  Save,
  Write,
} from "@edifice-ui/icons";
import { Dropdown } from "../Dropdown";
import Toolbar from "./Toolbar";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta: Meta<typeof Toolbar> = {
  title: "Components/Toolbar",
  component: Toolbar,
  argTypes: {
    variant: {
      options: ["default", "no-shadow"],
      control: { type: "select" },
    },
    isBlock: { control: "boolean" },
    align: {
      options: ["left", "center", "space", "right"],
      control: { type: "select" },
    },
  },
  args: {
    items: [
      {
        type: "icon",
        name: "record",
        props: {
          icon: <RecordVideo />,
          onClick: () => console.log("on click"),
          disabled: true,
        },
      },
      {
        type: "icon",
        name: "save",
        props: {
          icon: <Save />,
          onClick: () => console.log("on click"),
        },
      },
      {
        type: "divider",
      },
      {
        type: "icon",
        name: "write",
        props: {
          icon: <Write />,
          onClick: () => console.log("on click"),
          disabled: true,
        },
      },
      {
        type: "icon",
        name: "delete",
        props: {
          icon: <Delete />,
          onClick: () => console.log("on click"),
        },
      },
    ],
  },
  parameters: {
    docs: {
      description: {
        component:
          "Toolbar component allows you to create a customizable toolbar with various items such as icons and dividers. Each item can have its own properties and actions, and the toolbar can be aligned in different ways.",
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof Toolbar>;

export const Base: Story = {
  render: (args) => <Toolbar {...args} />,
};

export const Hidden: Story = {
  render: (args) => <Toolbar {...args} />,
  args: {
    items: [
      {
        type: "icon",
        name: "record",
        props: {
          icon: <RecordVideo />,
          onClick: () => console.log("on click"),
        },
        visibility: "hide",
      },
      {
        type: "icon",
        name: "save",
        props: {
          icon: <Save />,
          onClick: () => console.log("on click"),
        },
      },
      {
        type: "divider",
      },
      {
        type: "icon",
        name: "write",
        props: {
          icon: <Write />,
          onClick: () => console.log("on click"),
        },
      },
      {
        type: "icon",
        name: "delete",
        props: {
          icon: <Delete />,
          onClick: () => console.log("on click"),
        },
      },
    ],
  },
  parameters: {
    docs: {
      description: {
        story:
          "If an item's `visibility` property is set to `hide`, it will be hidden from view.",
      },
    },
  },
};

export const WithDivider: Story = {
  render: (args) => <Toolbar {...args} />,
  args: {
    items: [
      {
        type: "icon",
        name: "record",
        props: {
          icon: <RecordVideo />,
          onClick: () => console.log("on click"),
        },
      },
      {
        type: "icon",
        name: "save",
        props: {
          icon: <Save />,
          onClick: () => console.log("on click"),
        },
      },
      {
        type: "divider",
      },
      {
        type: "icon",
        name: "write",
        props: {
          icon: <Write />,
          onClick: () => console.log("on click"),
        },
      },
      {
        type: "icon",
        name: "delete",
        props: {
          icon: <Delete />,
          onClick: () => console.log("on click"),
        },
      },
    ],
  },
  parameters: {
    docs: {
      description: {
        story:
          "To display a divider element, include a data object with only the `type` set to `divider`.",
      },
    },
  },
};

export const WithPrimaryAction: Story = {
  render: (args) => <Toolbar {...args} />,
  args: {
    items: [
      {
        type: "button",
        name: "save",
        props: {
          children: (
            <>
              <Save />
              <span>Delete</span>
            </>
          ),
          onClick: () => console.log("on click"),
        },
      },
      {
        type: "icon",
        name: "delete",
        props: {
          icon: <Delete />,
          onClick: () => console.log("on click"),
        },
      },
      {
        type: "primary",
        name: "plus",
        props: {
          children: (
            <>
              <Plus />
              <span>Add</span>
            </>
          ),
          onClick: () => console.log("on click"),
        },
      },
    ],
  },
  parameters: {
    docs: {
      description: {
        story:
          "A data object with `type` set to `primary` will be treated as a primary action and displayed at the end of the Toolbar. It will accept the same properties as other data objects.",
      },
    },
  },
};

export const WithDropdownAction: Story = {
  render: (args) => <Toolbar {...args} />,
  decorators: [
    (Story) => (
      <div className="m-24" style={{ height: "300px" }}>
        {Story()}
      </div>
    ),
  ],
  args: {
    items: [
      {
        type: "button",
        name: "record",
        props: {
          disabled: false,
          children: (
            <>
              <Record />
              <span>Record</span>
            </>
          ),
          onClick: () => console.log("on click"),
        },
      },
      {
        type: "button",
        name: "save",
        props: {
          disabled: false,
          children: (
            <>
              <Save />
              <span>Delete</span>
            </>
          ),
          onClick: () => console.log("on click"),
        },
      },
      {
        type: "dropdown",
        name: "others",
        props: {
          children: () => (
            <>
              <Dropdown.Trigger variant="ghost" label="More..." />
              <Dropdown.Menu>
                <Dropdown.Item onClick={() => alert("click 1")}>
                  Write something...
                </Dropdown.Item>
                <Dropdown.Item onClick={() => alert("click 2")}>
                  Edit something...
                </Dropdown.Item>
              </Dropdown.Menu>
            </>
          ),
        },
      },
    ],
  },
  parameters: {
    docs: {
      description: {
        story:
          "For items of type `dropdown`, you must provide their children via the `props` attribute.",
      },
    },
  },
};

export const WithoutShadow: Story = {
  render: (args) => <Toolbar {...args} variant="no-shadow" />,
  parameters: {
    docs: {
      description: {
        story:
          "Setting the `variant` prop to `no-shadow` removes the box-shadow from the toolbar.",
      },
    },
  },
};
