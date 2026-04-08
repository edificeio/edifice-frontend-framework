import { Meta, StoryObj } from '@storybook/react';

import MessageFlashList from './MessageFlashList';
import MessageFlashListContainer from './MessageFlashListContainer';

const meta: Meta<typeof MessageFlashList> = {
  title: 'Modules/Homepage/MessageFlashListContainer',
  component: MessageFlashListContainer,
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
          'MessageFlashListContainer call timeline API to get the message flash list and displays them inside MessageFlashList components.',
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof MessageFlashListContainer>;

export const Default: Story = {};
