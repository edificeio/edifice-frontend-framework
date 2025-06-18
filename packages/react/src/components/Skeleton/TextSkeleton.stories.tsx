import type { Meta, StoryObj } from '@storybook/react';
import TextSkeleton from './TextSkeleton';

const meta = {
  title: 'Components/Skeleton/TextSkeleton',
  component: TextSkeleton,
  argTypes: {
    className: {
      control: 'text',
      description: 'Additional CSS classes to apply',
    },
    size: {
      options: ['xs', 'sm', 'md', 'lg'],
      control: { type: 'select' },
      description: 'The size of the text skeleton',
    },
  },
  args: {
    className: 'col-3',
    size: 'md',
  },
  parameters: {
    docs: {
      description: {
        component:
          'The TextSkeleton component is a placeholder for text content, used to indicate loading states in the UI. It mimics the appearance of text without any interactive functionality. This is useful for providing visual feedback while content is being loaded or processed.',
      },
    },
  },
} satisfies Meta<typeof TextSkeleton>;

export default meta;
type Story = StoryObj<typeof TextSkeleton>;

export const Base: Story = {
  args: {
    className: 'col-3',
  },
};

export const ExtraSmall: Story = {
  args: {
    className: 'col-1',
    size: 'xs',
  },
};

export const Small: Story = {
  args: {
    className: 'col-2',
    size: 'sm',
  },
};

export const Large: Story = {
  args: {
    className: 'col-4',
    size: 'lg',
  },
};
