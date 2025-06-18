import type { Meta, StoryObj } from '@storybook/react';
import ButtonSkeleton from './ButtonSkeleton';

const meta = {
  title: 'Components/Skeleton/ButtonSkeleton',
  component: ButtonSkeleton,
  argTypes: {
    color: {
      options: ['primary', 'secondary', 'tertiary', 'danger'],
      control: { type: 'select' },
      description: 'The color variant of the button skeleton',
    },
    size: {
      options: ['sm', 'md', 'lg'],
      control: { type: 'select' },
      description: 'The size of the button skeleton',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes to apply',
    },
  },
  args: {
    color: 'tertiary',
    className: 'col-3',
    size: 'md',
  },
  parameters: {
    docs: {
      description: {
        component:
          'The ButtonSkeleton component is a placeholder for the Button component, used to indicate loading states in the UI. It mimics the appearance of a button without any interactive functionality. This is useful for providing visual feedback while content is being loaded or processed.',
      },
    },
  },
} satisfies Meta<typeof ButtonSkeleton>;

export default meta;
type Story = StoryObj<typeof ButtonSkeleton>;

export const Base: Story = {
  args: {
    color: 'tertiary',
    className: 'col-3',
    size: 'md',
  },
};

export const Primary: Story = {
  args: {
    color: 'primary',
    className: 'col-3',
    size: 'md',
  },
};

export const Small: Story = {
  args: {
    color: 'secondary',
    className: 'col-2',
    size: 'sm',
  },
};

export const Large: Story = {
  args: {
    color: 'danger',
    className: 'col-4',
    size: 'lg',
  },
};
