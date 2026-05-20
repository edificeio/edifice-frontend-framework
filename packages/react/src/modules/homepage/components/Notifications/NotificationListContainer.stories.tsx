import type { Meta, StoryObj } from '@storybook/react-vite';

import NotificationListContainer from './NotificationListContainer';

const meta: Meta<typeof NotificationListContainer> = {
  title: 'Modules/Homepage/NotificationListContainer',
  component: NotificationListContainer,
  decorators: [
    (Story) => (
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '1rem' }}>
        <Story />
      </div>
    ),
  ],
  parameters: {
    docs: {
      description: {
        component:
          'NotificationListContainer fetches the latest user notifications and renders them through NotificationList.',
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof NotificationListContainer>;

export const Default: Story = {};
