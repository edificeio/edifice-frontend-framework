import { supportNotification, userNotificationForm } from '@edifice.io/config';
import type { Meta, StoryObj } from '@storybook/react-vite';
import Notification from './Notification';

const meta = {
  title: 'Modules/Homepage/Notification',
  component: Notification,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ width: '400px' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Notification>;

export default meta;
type Story = StoryObj<typeof meta>;

export const UserNotificationForm: Story = {
  args: {
    notification: userNotificationForm,
  },
};

export const SystemNotification: Story = {
  args: {
    notification: supportNotification,
  },
};
