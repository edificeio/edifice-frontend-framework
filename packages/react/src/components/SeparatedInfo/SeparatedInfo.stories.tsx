import { Meta, StoryObj } from '@storybook/react';

import { SeparatedInfo } from './SeparatedInfo';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta: Meta<typeof SeparatedInfo> = {
  title: 'Components/SeparatedInfo',
  component: SeparatedInfo,
  decorators: [(Story) => <div className="p-16">{Story()}</div>],
  parameters: {
    docs: {
      description: {
        component:
          'Component to display information separated by a vertical line on large screens and stacked on smaller screens.',
      },
    },
  },
} as Meta<typeof SeparatedInfo>;

export default meta;
type Story = StoryObj<typeof SeparatedInfo>;

export const Base: Story = {
  render: () => (
    <SeparatedInfo>
      <div>John Doe</div>
      <div>ADML</div>
    </SeparatedInfo>
  ),
};
