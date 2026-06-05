import {
  mockMessageAlert,
  mockMessageDefault,
  mockMessageInfo,
  mockMessageSuccess,
  mockMessageWarning,
} from '@edifice.io/config';
import type { Meta, StoryObj } from '@storybook/react';
import MessageFlash from './MessageFlash';

const meta = {
  title: 'Modules/Homepage/MessageFlash',
  component: MessageFlash,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof MessageFlash>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    message: mockMessageDefault,
    onCloseMessage: (message) => {
      console.log('Message closed:', message);
    },
  },
};

export const Alert: Story = {
  args: {
    message: mockMessageAlert,
  },
};

export const Warning: Story = {
  args: {
    message: mockMessageWarning,
  },
};

export const Info: Story = {
  args: {
    message: mockMessageInfo,
  },
};

export const Success: Story = {
  args: {
    message: mockMessageSuccess,
  },
};
