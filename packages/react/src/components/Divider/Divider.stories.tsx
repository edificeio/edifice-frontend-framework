import { Meta, StoryObj } from '@storybook/react';
import Divider from './Divider';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta: Meta<typeof Divider> = {
  title: 'Components/Divider',
  component: Divider,
  decorators: [(Story) => <div className="p-16">{Story()}</div>],
  parameters: {
    argTypes: {
      vertical: {
        control: 'boolean',
      },
      className: {
        control: 'text',
      },
    },
    docs: {
      description: {
        component:
          'A divider displays an horizontal line with some content in the middle.',
      },
    },
  },
} as Meta<typeof Divider>;

export default meta;
type Story = StoryObj<typeof Divider>;

export const Base: Story = {
  args: {
    children: <span key="1">Content to display</span>,
  },
};
export const WithMultipleChildren: Story = {
  args: {
    children: (
      <>
        <span key="1">Content to display 1</span>,
        <span key="2">Content to display 2</span>,
      </>
    ),
  },
};
export const WithCustomColor: Story = {
  args: {
    children: <span key="1">Content to display</span>,
    className: 'border-primary',
  },
};
export const Vertical: Story = {
  render: (args) => (
    <div>
      Content to display
      <Divider {...args} />
      With a vertical divider
    </div>
  ),
  args: {
    vertical: true,
  },
};
