import { Meta, StoryObj } from "@storybook/react";

import {
  IconCopy,
  IconCut,
  IconDelete,
  IconEdit,
  IconPrint,
} from "../../../modules/icons/components";
import Dropdown from "../Dropdown";

const meta: Meta<typeof Dropdown> = {
  title: "Components/Dropdown/Dropdown Item",
  component: Dropdown,
  decorators: [(Story) => <div style={{ height: "25em" }}>{Story()}</div>],
  parameters: {
    docs: {
      description: {
        component:
          "The `Dropdown.Item` component represents a clickable menu item within a dropdown menu. Each item can be bound to a specific action and can optionally include an icon. This component is ideal for creating action menus, command menus, or any menu where each item triggers a distinct action when clicked.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Dropdown>;

export const Base: Story = {
  render: (args) => {
    return (
      <Dropdown>
        <Dropdown.Trigger label="Action menu" />
        <Dropdown.Menu>
          <Dropdown.Item icon={<IconEdit />} onClick={() => alert("edit")}>
            Edit
          </Dropdown.Item>
          <Dropdown.Separator />
          <Dropdown.Item icon={<IconCopy />} onClick={() => alert("copy")}>
            Copy
          </Dropdown.Item>
          <Dropdown.Item icon={<IconCut />} onClick={() => alert("cut")}>
            Cut
          </Dropdown.Item>
          <Dropdown.Item icon={<IconPrint />} onClick={() => alert("print")}>
            Print
          </Dropdown.Item>
          <Dropdown.Separator />
          <Dropdown.Item icon={<IconDelete />} onClick={() => alert("delete")}>
            Delete
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    );
  },
};