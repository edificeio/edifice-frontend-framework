import { Meta, StoryObj } from '@storybook/react';
import { IconAddUser } from '../../modules/icons/components';
import { Button } from '../Button';
import VisuallyHidden, { VisuallyHiddenProps } from './VisuallyHidden';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta = {
  title: 'Components/VisuallyHidden',
  component: VisuallyHidden,
  parameters: {
    docs: {
      description: {
        component:
          'VisuallyHidden component is used to visually hide content while keeping it accessible to screen readers. This is useful for adding additional context or instructions for users who rely on assistive technologies.',
      },
    },
  },
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
} satisfies Meta<typeof VisuallyHidden>;

export default meta;

type Story = StoryObj<typeof VisuallyHidden>;

export const Base: Story = {
  render: (args: VisuallyHiddenProps) => {
    return (
      <Button>
        <IconAddUser />
        <VisuallyHidden>{args.children}</VisuallyHidden>
      </Button>
    );
  },
  args: {
    children: 'Add User',
  },
};
