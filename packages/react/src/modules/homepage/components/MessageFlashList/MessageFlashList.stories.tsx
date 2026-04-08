import { Meta, StoryObj } from '@storybook/react';

import { mockMessages } from '@edifice.io/config';
import MessageFlashList from './MessageFlashList';

// Mock data for flash messages

const meta: Meta<typeof MessageFlashList> = {
  title: 'Modules/Homepage/MessageFlashList',
  component: MessageFlashList,
  decorators: [
    (Story) => (
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '1rem' }}>
        {Story()}
      </div>
    ),
  ],
  parameters: {
    docs: {
      description: {
        component:
          'MessageFlashList displays a vertical list of flash messages (announcements, notifications, alerts). Each message can have different colors, content, and can be dismissed individually.',
      },
    },
  },
  argTypes: {
    messages: {
      description: 'Array of flash messages to display',
      control: 'object',
    },
    onCloseMessage: {
      description: 'Callback function called when a message is closed',
    },
  },
};

export default meta;

type Story = StoryObj<typeof MessageFlashList>;

export const Default: Story = {
  args: {
    messages: mockMessages,
    onCloseMessage: (message) => console.log('closed', message),
  },
  parameters: {
    docs: {
      description: {
        story:
          'Default MessageFlashList with multiple messages of different types and colors.',
      },
    },
  },
};
