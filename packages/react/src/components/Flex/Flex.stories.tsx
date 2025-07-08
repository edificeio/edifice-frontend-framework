import type { Meta, StoryObj } from '@storybook/react';
import Flex from './Flex';

const meta: Meta<typeof Flex> = {
  title: 'Layout/Flex',
  component: Flex,
  parameters: {
    docs: {
      description: {
        component: `The Flex component is a layout utility that simplifies the use of Bootstrap's Flexbox utilities in a React-friendly way.
It abstracts repetitive d-flex markup into a reusable component, allowing consistent and declarative alignment, direction, spacing, and wrapping across the app.`,
      },
    },
  },
  argTypes: {
    direction: {
      description:
        'Controls the flex direction: row, column, row-reverse, column-reverse.',
      control: 'select',
      options: ['row', 'row-reverse', 'column', 'column-reverse'],
    },
    align: {
      description:
        'Aligns items on the cross axis using Bootstrap’s align-items utility.',
      control: 'select',
      options: ['start', 'end', 'center', 'baseline', 'stretch'],
    },
    justify: {
      description:
        'Justifies items on the main axis using Bootstrap’s justify-content utility.',
      control: 'select',
      options: ['start', 'end', 'center', 'between', 'around', 'evenly'],
    },
    gap: {
      description:
        'Applies spacing between children using Bootstrap’s gap utility (e.g. "2", "3", "4").',
      control: 'text',
    },
    fill: {
      description:
        'If true, applies the "flex-fill" class to make the container fill available space.',
      control: 'boolean',
    },
    wrap: {
      description: 'Controls if the items wrap: wrap, nowrap, or reverse.',
      control: 'select',
      options: ['wrap', 'nowrap', 'reverse'],
    },
    className: {
      description: 'Additional custom class names to apply to the container.',
      control: 'text',
    },
    children: {
      description: 'Child elements to be rendered inside the Flex container.',
      control: false,
    },
  },
};

export default meta;

type Story = StoryObj<typeof Flex>;

export const Default: Story = {
  render: (args) => (
    <Flex {...args}>
      <div className="p-2 bg-primary text-white">Box 1</div>
      <div className="p-2 bg-secondary text-white">Box 2</div>
    </Flex>
  ),
};

export const FillDirection: Story = {
  render: (args) => (
    <Flex {...args} direction="fill" className="bg-light p-3 border">
      <div className="flex-grow-1 p-2 bg-primary text-white">Box 1</div>
      <div className="flex-grow-1 p-2 bg-secondary text-white">Box 2</div>
    </Flex>
  ),
};
