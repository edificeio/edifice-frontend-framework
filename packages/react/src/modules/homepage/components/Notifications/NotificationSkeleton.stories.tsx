import type { Meta, StoryObj } from '@storybook/react-vite';
import NotificationSkeleton from './NotificationSkeleton';

const meta = {
  title: 'Modules/Homepage/NotificationSkeleton',
  component: NotificationSkeleton,
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
} satisfies Meta<typeof NotificationSkeleton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
