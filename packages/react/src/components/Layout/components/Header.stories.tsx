import { Meta, StoryObj } from '@storybook/react-vite';
import { http, HttpResponse } from 'msw';

import Header from './Header';

const meta: Meta<typeof Header> = {
  title: 'Layout/Header',
  component: Header,
  args: {
    src: '/assets',
    is1d: false,
  },
  argTypes: {
    is1d: {
      control: 'boolean',
      description:
        'Switches between the 2nd degree (default) and 1st degree header layouts.',
    },
    src: {
      control: 'text',
      description: 'Base path used to resolve theme assets (logo, etc.).',
    },
  },
  parameters: {
    docs: {
      description: {
        component:
          'Legacy portal header. It renders the main navigation (home, applications, messaging, community, help, account) and adapts its layout to the school level through the `is1d` prop: the 2nd degree (default) layout uses a single navbar, while the 1st degree layout (`is1d`) displays a dedicated secondary navbar. Messaging, community, search and help entries are gated by the user workflows.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Header>;

/**
 * Default header for 2nd degree (collège / lycée).
 */
export const Default: Story = {};

/**
 * First degree (école) layout, enabled through the `is1d` prop.
 * Displays the dedicated secondary navbar.
 */
export const FirstDegree: Story = {
  args: {
    is1d: true,
  },
  // The 1st degree layout relies on a `one` theme-specific override, so force
  // `data-product="one"` on the parent regardless of the theme picked in the
  // Storybook toolbar — otherwise the wrong theme is rendered.
  decorators: [
    (Story) => (
      <div data-product="one">
        <Story />
      </div>
    ),
  ],
  parameters: {
    msw: {
      // Keyed object form so Storybook deep-merges with the global handlers
      // instead of replacing them — keeps the `auth` handler that provides the
      // conversation workflow right gating the messaging icon.
      handlers: {
        conversation: [
          http.get('/conversation/api/count/inbox', () =>
            HttpResponse.json({ count: 3 }),
          ),
        ],
      },
    },
    docs: {
      description: {
        story:
          "When `is1d` is true, the header switches to the 1st degree layout with a secondary navbar (what's new, class members, my apps). The messaging icon shows the unread messages badge.",
      },
    },
  },
};

/**
 * Header with 3 unread messages badge on the messaging icon.
 */
export const WithMessages: Story = {
  parameters: {
    msw: {
      // Keyed object form so Storybook deep-merges with the global handlers
      // instead of replacing them — keeps the `auth` handler that provides the
      // conversation workflow right gating the messaging icon.
      handlers: {
        conversation: [
          http.get('/conversation/api/count/inbox', () =>
            HttpResponse.json({ count: 3 }),
          ),
        ],
      },
    },
  },
};

/**
 * Mobile responsive header demonstration.
 */
export const Mobile: Story = {
  globals: {
    viewport: { value: 'mobile' },
  },
  parameters: {
    docs: {
      description: {
        story:
          'On mobile devices, the navigation collapses into a dropdown menu.',
      },
    },
  },
};
