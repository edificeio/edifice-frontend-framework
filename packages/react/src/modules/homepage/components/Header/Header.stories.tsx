import { Meta, StoryObj } from '@storybook/react';

import Header from './Header';

const meta: Meta<typeof Header> = {
  title: 'Modules/Homepage/Header',
  component: Header,
  args: {
    src: '/assets',
  },
  parameters: {
    docs: {
      description: {
        component:
          'Header is the main navigation header component for Edifice applications. It provides access to applications, messaging, search, user account, and other core platform features. The header adapts to different screen sizes and includes dropdown menus for mobile navigation. It integrates with user authentication, conversations, help systems, and theme management.',
      },
    },
  },
  decorators: [
    (Story) => (
      <div style={{ minHeight: '100vh' }}>
        <Story />
        {/* Add some content below to see the header in context */}
        <div style={{ padding: '2rem' }}>
          <h1>Sample Page Content</h1>
          <p>
            This content shows how the header looks in a real application
            context.
          </p>
        </div>
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Header>;

/**
 * Default header display with all features enabled.
 * This story demonstrates the header with default theme assets and all navigation features.
 */
export const Default: Story = {};

/**
 * Mobile responsive header demonstration.
 * Shows how the header adapts to mobile viewport sizes.
 */
export const Mobile: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'mobile',
    },
    docs: {
      description: {
        story:
          'On mobile devices, the header navigation collapses into a dropdown menu with touch-friendly interaction.',
      },
    },
  },
};

/**
 * Tablet responsive header demonstration.
 * Shows the header behavior on tablet-sized screens.
 */
export const Tablet: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'tablet',
    },
    docs: {
      description: {
        story:
          'Header adapted for tablet viewports showing the intermediate responsive state.',
      },
    },
  },
};
