import { useState } from 'react';

import { Meta, StoryObj } from '@storybook/react';

import SegmentedControl from './SegmentedControl';

const meta: Meta<typeof SegmentedControl> = {
  title: 'Forms/SegmentedControl',
  component: SegmentedControl,
  argTypes: {
    options: {
      description: `Array of options to display in the segmented control. Each option must be an object with:
- \`label\` (string): The text displayed for this option
- \`value\` (string): The value associated with this option`,
      control: { type: 'object' },
      table: {
        type: { summary: 'SegmentedOption[]' },
        category: 'Props',
      },
    },
    value: {
      description:
        'The currently selected value (string). Use this for controlled components. Must match one of the option values.',
      control: { type: 'text' },
      table: {
        type: { summary: 'string' },
        category: 'Props',
      },
    },
    onChange: {
      description:
        'Callback function called when the selected value changes. Receives the new value (string) as parameter.',
      action: 'changed',
      table: {
        type: { summary: '(value: string) => void' },
        category: 'Props',
      },
    },
  },
  args: {
    options: [
      { label: 'Publié 3', value: 'published' },
      { label: 'À valider 1', value: 'to_validate' },
      { label: 'Brouillon 2', value: 'draft' },
    ],
    value: 'published',
  },
  parameters: {
    docs: {
      description: {
        component:
          'SegmentedControl component for creating segmented button groups. Simple interface with options (label/value), value, and onChange. The component provides a clean way to switch between multiple related options.',
      },
    },
  },
} as Meta<typeof SegmentedControl>;

export default meta;
type Story = StoryObj<typeof SegmentedControl>;

export const Default: Story = {
  render: (args) => {
    const [value, setValue] = useState<string>(args.value || 'list');

    return (
      <SegmentedControl
        {...args}
        value={value}
        data-testid="segmented-control-news"
        onChange={(val) => {
          setValue(val);
          args.onChange?.(val);
        }}
      />
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          'Use the controls below to modify the component properties and see how they affect the SegmentedControl. You can change the options array, the selected value, and see the onChange callback in the Actions panel.',
      },
    },
  },
};
