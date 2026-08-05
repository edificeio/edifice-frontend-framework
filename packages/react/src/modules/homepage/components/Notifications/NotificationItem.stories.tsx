import { supportNotification, userNotificationForm } from '@edifice.io/config';
import type { Meta, StoryObj } from '@storybook/react-vite';
import NotificationItem from './NotificationItem';

const meta = {
  title: 'Modules/Homepage/Notification',
  component: NotificationItem,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'The `NotificationItem` component renders a single notification from a raw `NotificationModel`. It adapts the model internally and picks one of two display variants: **user** when another user triggered the event (a shared resource, for instance) — the author avatar is then shown; **system** when the event comes from an application — the app icon is shown instead. Callers only pass the model: the variant is inferred, never chosen through a prop.',
      },
    },
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ width: '400px' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof NotificationItem>;

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
