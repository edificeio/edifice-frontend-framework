import type { Meta, StoryObj } from '@storybook/react-vite';

import NotificationList from './NotificationList';
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

export const Default: Story = {
  args: {},
};

export const WithCloseAction: Story = {
  args: {
    onCloseNotifications: () => {
      alert('Close Notification List Container ');
    },
  },
};

export const IsLoading: Story = {
  render: () => <NotificationList isLoading={true} />,
};

export const IsEmpty: Story = {
  render: () => <NotificationList notifications={[]} />,
};
