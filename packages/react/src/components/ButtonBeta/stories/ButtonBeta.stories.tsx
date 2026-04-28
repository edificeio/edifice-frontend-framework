import { Meta, StoryObj } from '@storybook/react';

import {
  IconAddUser,
  IconClose,
  IconRafterLeft,
  IconRafterRight,
} from '../../../modules/icons/components';
import ButtonBeta, { ButtonBetaProps } from '../ButtonBeta';

const meta: Meta<typeof ButtonBeta> = {
  title: 'Components/Buttons/ButtonBeta',
  component: ButtonBeta,
  argTypes: {
    color: {
      options: ['default', 'destructive', 'secondary', 'tertiary'],
      control: { type: 'select' },
    },
    type: {
      options: ['button', 'submit', 'reset'],
      control: { type: 'select' },
    },
  },
  args: {
    color: 'default',
    disabled: false,
  },
  parameters: {
    docs: {
      description: {
        component:
          'ButtonBeta is the next-generation button component following the new Figma design system. It supports multiple colors (default, destructive, secondary, tertiary) and states (default, disabled, loading). Icons can be placed on the left or right of the label.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof ButtonBeta>;

export const Base: Story = {
  args: {
    color: 'default',
    children: 'Label',
    type: 'button',
    disabled: false,
  },
};

export const Disabled: Story = {
  args: {
    color: 'default',
    children: 'Label',
    type: 'button',
    disabled: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Add the disabled prop to the button to disable it.',
      },
    },
  },
};

export const Destructive: Story = {
  args: {
    color: 'destructive',
    children: 'Delete',
    type: 'button',
    disabled: false,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Used for destructive actions that warn the user of an important or irreversible action.',
      },
    },
  },
};

export const WithIconLeft: Story = {
  args: {
    color: 'default',
    children: 'New user',
    type: 'button',
    leftIcon: <IconAddUser title="Add User" />,
  },
};

export const WithIconRight: Story = {
  args: {
    color: 'default',
    children: 'Close',
    type: 'button',
    rightIcon: <IconClose title="Close" />,
  },
};

export const WithBothIcons: Story = {
  args: {
    color: 'default',
    children: 'Navigate',
    type: 'button',
    leftIcon: <IconRafterLeft title="Chevron Left" />,
    rightIcon: <IconRafterRight title="Chevron Right" />,
  },
};

export const IconOnly: Story = {
  args: {
    color: 'default',
    type: 'button',
    leftIcon: <IconAddUser title="Add User" />,
  },
  parameters: {
    docs: {
      description: {
        story:
          'When no children are provided, the btn-beta--icon-only class is applied for square padding.',
      },
    },
  },
};

export const Loading: Story = {
  args: {
    color: 'default',
    children: 'Loading...',
    type: 'button',
    isLoading: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Loading state disables pointer events and shows a loading indicator.',
      },
    },
  },
};

export const ButtonGroup: Story = {
  render: (args: ButtonBetaProps) => {
    return (
      <div className="d-flex align-items-center gap-8">
        <ButtonBeta {...args} color="default">
          Cancel
        </ButtonBeta>
        <ButtonBeta {...args} color="destructive">
          Delete
        </ButtonBeta>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          'Primary action always on the right, secondary action on its left.',
      },
    },
  },
};
