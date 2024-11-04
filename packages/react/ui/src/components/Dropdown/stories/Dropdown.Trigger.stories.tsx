import { Meta, StoryObj } from "@storybook/react";

import { Edit, Filter } from "@edifice-ui/icons";
import { RefAttributes } from "react";
import { JSX } from "react/jsx-runtime";
import IconButton, { IconButtonProps } from "../../Button/IconButton";
import Dropdown from "../Dropdown";
import DropdownTrigger from "../DropdownTrigger";

const meta: Meta<typeof DropdownTrigger> = {
  title: "Components/Dropdown/Dropdown Trigger",
  component: DropdownTrigger,
  args: {
    label: "",
    icon: undefined,
    badgeContent: 0,
    disabled: false,
  },
  parameters: {
    docs: {
      description: {
        component:
          "The `Dropdown.Trigger` component serves as the clickable element that toggles the dropdown menu. It can be customized with a label, icon, and badge content. The trigger supports both button and icon button variants, and can be disabled when needed. Key features include:\n\n- Optional label text\n- Optional icon support\n- Badge content display\n- Disabled state\n- Keyboard accessibility\n- ARIA attributes for screen readers",
      },
    },
  },
  decorators: [(Story) => <div style={{ height: "400px" }}>{Story()}</div>],
};

export default meta;
type Story = StoryObj<typeof DropdownTrigger>;

export const Base: Story = {
  render: (args) => {
    return (
      <Dropdown>
        <Dropdown.Trigger {...args} />
        <Dropdown.Menu>
          <Dropdown.Item>Dropdown Item</Dropdown.Item>
          <Dropdown.Item>Dropdown Item</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    );
  },
};

export const WithIcon: Story = {
  render: (args) => {
    return (
      <Dropdown>
        <Dropdown.Trigger icon={<Filter />} />
        <Dropdown.Menu>
          <Dropdown.Item>Dropdown Item</Dropdown.Item>
          <Dropdown.Item>Dropdown Item</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    );
  },
  parameters: {
    docs: {
      description: {
        story: "`Dropdown.Trigger` accepts a prop `icon`",
      },
    },
  },
};

export const WithLabel: Story = {
  render: (args) => {
    return (
      <Dropdown>
        <Dropdown.Trigger label="Dropdown Trigger" />
        <Dropdown.Menu>
          <Dropdown.Item>Dropdown Item</Dropdown.Item>
          <Dropdown.Item>Dropdown Item</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    );
  },
  parameters: {
    docs: {
      description: {
        story: "`Dropdown.Trigger` accepts a prop `label` to display a text",
      },
    },
  },
};

export const Disabled: Story = {
  render: (args) => {
    return (
      <Dropdown>
        <Dropdown.Trigger label="Dropdown Trigger" disabled />
        <Dropdown.Menu>
          <Dropdown.Item>Dropdown Item</Dropdown.Item>
          <Dropdown.Item>Dropdown Item</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    );
  },
  parameters: {
    docs: {
      description: {
        story: "`Dropdown.Trigger` accepts a prop `label` to display a text",
      },
    },
  },
};

export const Size: Story = {
  render: (args) => {
    return (
      <div className="d-flex flex-column gap-24">
        <Dropdown>
          <Dropdown.Trigger label="Dropdown" size="sm" />
          <Dropdown.Menu>
            <Dropdown.Item>Dropdown Item</Dropdown.Item>
            <Dropdown.Item>Dropdown Item</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
        <Dropdown>
          <Dropdown.Trigger label="Dropdown" size="md" />
          <Dropdown.Menu>
            <Dropdown.Item>Dropdown Item</Dropdown.Item>
            <Dropdown.Item>Dropdown Item</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
        <Dropdown>
          <Dropdown.Trigger label="Dropdown" size="lg" />
          <Dropdown.Menu>
            <Dropdown.Item>Dropdown Item</Dropdown.Item>
            <Dropdown.Item>Dropdown Item</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          "`Dropdown.Trigger` exists in 3 sizes controlled by `size` prop with `sm | md | lg` as value",
      },
    },
  },
};

export const GhostVariant: Story = {
  render: (args) => {
    return (
      <Dropdown>
        <Dropdown.Trigger label="Dropdown" variant="ghost" />
        <Dropdown.Menu>
          <Dropdown.Item>Dropdown Item</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    );
  },
  parameters: {
    docs: {
      description: {
        story: "`Dropdown.Trigger` accepts a prop `variant`",
      },
    },
  },
};

export const CustomTrigger: Story = {
  render: (args) => {
    return (
      <Dropdown>
        {(
          triggerProps: JSX.IntrinsicAttributes &
            Omit<IconButtonProps, "ref"> &
            RefAttributes<HTMLButtonElement>,
        ) => (
          <>
            <IconButton
              {...triggerProps}
              type="button"
              aria-label="label"
              color="tertiary"
              variant="ghost"
              icon={<Edit />}
            />

            <Dropdown.Menu>
              <Dropdown.Item>Dropdown Item</Dropdown.Item>
              <Dropdown.Item>Dropdown Item</Dropdown.Item>
            </Dropdown.Menu>
          </>
        )}
      </Dropdown>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          "Any component can be used as a custom trigger when use as a function as children (render prop). It can access `triggerProps` to get required a11y attributes.",
      },
    },
  },
};
