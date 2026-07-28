import {
  mockMessageAlert,
  mockMessageDefault,
  mockMessageInfo,
  mockMessageSuccess,
  mockMessageWarning,
} from '@edifice.io/config';
import type { Meta, StoryObj } from '@storybook/react-vite';
import MessageFlash from './MessageFlash';

const meta = {
  title: 'Modules/Homepage/MessageFlash',
  component: MessageFlash,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          "The `MessageFlash` component renders a single flash message pushed by the platform (an `IFlashMessageModel` from `@edifice.io/client`) on the homepage. It picks the content matching the user's current language, falls back to French, then to the first non-empty translation available. Long messages are truncated to two lines with a toggle to expand them, and the message can be dismissed through the `onCloseMessage` callback — persisting that dismissal is the caller's responsibility. The visual style (info, warning, alert…) follows the message model itself, not a prop.",
      },
    },
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
