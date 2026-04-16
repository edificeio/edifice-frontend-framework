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
 * Header with custom theme source for branding and styling.
 * Configure the src prop to point to custom theme assets.
 */
export const CustomTheme: Story = {
  args: {
    src: '/theme/custom',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Header configured with a custom theme source to demonstrate how different visual themes can be applied.',
      },
    },
  },
};

/**
 * Header with production theme assets.
 * Uses production-like theme configuration.
 */
export const ProductionTheme: Story = {
  args: {
    src: '/theme/one',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Header configured with production theme assets showing the standard Edifice ONE appearance.',
      },
    },
  },
};

/**
 * Header without theme source for testing edge cases.
 * When src is undefined, the header should gracefully handle missing assets.
 */
export const NoThemeSource: Story = {
  args: {
    src: undefined,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Header with no theme source specified to test how the component handles missing assets.',
      },
    },
  },
};

/**
 * Mobile responsive header demonstration.
 * Shows how the header adapts to mobile viewport sizes.
 */
export const Mobile: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
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
