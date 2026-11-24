import { Meta, StoryObj } from '@storybook/react-vite';

import { Flex } from '../Flex';
import Switch from './Switch';

const meta = {
  title: 'Forms/Switch',
  component: Switch,
  parameters: {
    docs: {
      description: {
        component:
          'A Switch is a checkbox presented as an on/off toggle. It comes in a single size and always uses the secondary color of the current theme. Its states (checked, pressed, focused, disabled) are driven by the native input, so it works both controlled and uncontrolled. The `size` and `variant` props are deprecated and have no effect.',
      },
    },
  },
  args: {
    label: 'Label',
  },
  argTypes: {
    labelPosition: {
      description: 'Side on which the label is displayed',
      control: 'inline-radio',
      options: ['right', 'left'],
    },
    disabled: {
      description: 'Disabled state',
      control: 'boolean',
    },
    size: {
      table: { disable: true },
    },
    variant: {
      table: { disable: true },
    },
  },
} satisfies Meta<typeof Switch>;

export default meta;
type Story = StoryObj<typeof Switch>;

export const Base: Story = {};

export const Checked: Story = {
  args: {
    defaultChecked: true,
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};

export const DisabledChecked: Story = {
  args: {
    disabled: true,
    defaultChecked: true,
  },
};

export const LabelLeft: Story = {
  args: {
    labelPosition: 'left',
  },
};

export const WithoutLabel: Story = {
  args: {
    'label': undefined,
    'aria-label': 'Switch without label',
  },
};

export const States: Story = {
  render: () => (
    <Flex direction="column" gap="16">
      {(['right', 'left'] as const).map((labelPosition) => (
        <Flex key={labelPosition} gap="24">
          <Switch label="Label" labelPosition={labelPosition} />
          <Switch label="Label" labelPosition={labelPosition} defaultChecked />
          <Switch label="Label" labelPosition={labelPosition} disabled />
          <Switch
            label="Label"
            labelPosition={labelPosition}
            disabled
            defaultChecked
          />
        </Flex>
      ))}
    </Flex>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Off / on, enabled / disabled, with the label on the right (default) or on the left. The pressed state (darker shades and a pale halo) shows while the switch is clicked. Keyboard focus uses the same darker shades with a 2px info ring.',
      },
    },
  },
};
