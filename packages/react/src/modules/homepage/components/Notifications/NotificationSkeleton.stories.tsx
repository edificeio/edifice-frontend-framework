import { userNotificationForm } from '@edifice.io/config';
import type { Meta, StoryObj } from '@storybook/react-vite';
import NotificationItem from './NotificationItem';
import NotificationSkeleton from './NotificationSkeleton';

const meta = {
  title: 'Modules/Homepage/NotificationSkeleton',
  component: NotificationSkeleton,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Loading placeholder for a single notification row.\n\nIt reuses the wrappers, classes and gaps of `CommonNotificationItem` and swaps each content slot for a `Skeleton` block. Every dimension is derived from `_notification-item.scss` rather than measured on the mockup: the avatar keeps the sizing class of the component itself, the chip is 28 high because its 20px icon sits in 2px of icon padding inside 2px of chip padding, and the timestamp is 18 high because that is the caption line height. The two message lines are 20 high with a 4 gap, which adds up to the 44 of two real 22px line boxes.',
      },
    },
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="skeleton-overlay-frame">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof NotificationSkeleton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const AboveTheLoadedRow: Story = {
  render: () => (
    <div className="skeleton-overlay-stack">
      <NotificationSkeleton />
      <NotificationItem notification={userNotificationForm} />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'The skeleton stacked directly on top of the loaded row it stands for. Both occupy the same width, so any difference in height between the two is the layout shift the user would see when the data arrives.',
      },
    },
  },
};

export const SuperimposedOnTheLoadedRow: Story = {
  render: () => (
    <div className="skeleton-overlay">
      <NotificationItem notification={userNotificationForm} />
      <div className="skeleton-overlay-top">
        <NotificationSkeleton lines={3} />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'The same two rows superimposed at partial opacity. Each grey block should sit over the content it replaces: the circle over the avatar, the lines over the message, the pill over the application chip, the last line over the timestamp. Anything sticking out is a mismatch between the skeleton and the component.\n\nThis mock message wraps onto three lines at 400px, so the story passes `lines={3}`. Compare with `Superimposed With The Default Line Count` to see the drift caused by guessing wrong.',
      },
    },
  },
};

export const SuperimposedWithTheDefaultLineCount: Story = {
  render: () => (
    <div className="skeleton-overlay">
      <NotificationItem notification={userNotificationForm} />
      <div className="skeleton-overlay-top">
        <NotificationSkeleton />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'The same overlay left at the default two lines, against a message that actually wraps onto three. Everything above the message still lines up, and everything below it is off by exactly one 22px line box. This is the layout shift a skeleton produces when the line count is guessed rather than known, and the reason `lines` is a prop rather than a constant.',
      },
    },
  },
};
