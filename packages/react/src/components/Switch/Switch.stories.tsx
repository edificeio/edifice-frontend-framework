import { Meta, StoryObj } from '@storybook/react';

import Switch from './Switch';

const meta = {
  title: 'Forms/Switch',
  component: Switch,
  parameters: {
    docs: {
      description: {
        component:
          'A Switch is a component that allows users to toggle between two states.',
      },
    },
  },
  args: {
    label: 'Switch label',
  },
  argTypes: {
    size: {
      description: 'Size of the switch',
      control: 'select',
      options: ['sm', 'md'],
    },
    disabled: {
      description: 'Disabled state',
      control: 'boolean',
    },
  },
} satisfies Meta<typeof Switch>;

export default meta;
type Story = StoryObj<typeof Switch>;

export const Base: Story = {
  args: {
    label: 'Base Switch',
  },
};

export const Small: Story = {
  args: {
    label: 'Small Switch',
    size: 'sm',
  },
};

export const Disabled: Story = {
  args: {
    label: 'Disabled Switch',
    disabled: true,
  },
};

export const Checked: Story = {
  args: {
    label: 'Checked Switch',
    defaultChecked: true,
  },
};

export const DisabledChecked: Story = {
  args: {
    label: 'Disabled Checked Switch',
    disabled: true,
    defaultChecked: true,
  },
};

export const WithoutLabel: Story = {
  args: {
    'aria-label': 'Switch without label',
  },
};

export const Group = {
  render: () => {
    return (
      <div className="d-flex flex-column gap-8">
        <Switch label="First Switch" />
        <Switch label="Second Switch" defaultChecked />
        <Switch label="Disabled Switch" disabled />
        <Switch label="Disabled Checked Switch" disabled defaultChecked />
      </div>
    );
  },
};

export const Sizes = {
  render: () => {
    return (
      <div className="d-flex flex-column gap-8">
        <Switch size="sm" label="Small Switch" />
        <Switch size="md" label="Medium Switch" />
      </div>
    );
  },
};
