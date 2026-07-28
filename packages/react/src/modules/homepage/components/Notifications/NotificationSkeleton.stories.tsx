import type { Meta, StoryObj } from '@storybook/react-vite';
import NotificationSkeleton from './NotificationSkeleton';

const meta = {
  title: 'Modules/Homepage/NotificationSkeleton',
  component: NotificationSkeleton,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'The `NotificationSkeleton` component is the loading placeholder of `NotificationItem`. It mirrors its layout — avatar on the left, text lines and an action block on the right — so the notification list keeps a stable height while data is being fetched, avoiding a layout shift when the real items arrive. It takes no prop beyond the standard `div` attributes and forwards its ref, which makes it usable as a sentinel in an infinite-scroll list.',
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
} satisfies Meta<typeof NotificationSkeleton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
