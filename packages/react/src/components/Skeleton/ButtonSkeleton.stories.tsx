import type { Meta, StoryObj } from '@storybook/react-vite';
import ButtonSkeleton from './ButtonSkeleton';

const meta = {
  title: 'Components/Skeleton/ButtonSkeleton (deprecated)',
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
          '⚠️ **Deprecated — use the `Skeleton` primitive instead** (`<Skeleton variant="pill" width={…} height={…} />`). This component is kept only for backward compatibility and will be removed in a future version. It renders a disabled `Button`, which puts a purely decorative placeholder into the accessibility tree, and its grey comes from the legacy `gray-400` scale rather than the `grey-300` design token.\n\nThe ButtonSkeleton component is a placeholder for the Button component, used to indicate loading states in the UI. It mimics the appearance of a button without any interactive functionality.',
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
