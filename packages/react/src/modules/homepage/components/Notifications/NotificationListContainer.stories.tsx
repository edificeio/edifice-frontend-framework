import { timelineHandlers } from '@edifice.io/config';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { http, HttpResponse } from 'msw';
import { Toaster } from 'react-hot-toast';

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

/**
 * The platform answers `lastNotifications` with a non-`ok` status: the list
 * stays empty and an error toast is displayed (top right).
 */
export const LoadingError: Story = {
  decorators: [
    (Story) => (
      <>
        <Story />
        <Toaster />
      </>
    ),
  ],
  parameters: {
    msw: {
      handlers: {
        // The keyed override replaces every global timeline route, so the
        // error route is listed first (first match wins) and the other
        // routes are kept.
        timeline: [
          http.get('/timeline/lastNotifications', () =>
            HttpResponse.json({ status: 'error', number: 0, results: [] }),
          ),
          ...timelineHandlers,
        ],
      },
    },
  },
};
