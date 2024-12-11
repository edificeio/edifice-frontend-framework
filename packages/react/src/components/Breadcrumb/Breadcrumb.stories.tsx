import { Meta, StoryObj } from '@storybook/react';
import Breadcrumb from './Breadcrumb';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta: Meta<typeof Breadcrumb> = {
  title: 'Layout/Breadcrumb',
  component: Breadcrumb,
  parameters: {
    docs: {
      description: {
        component:
          "The Breadcrumb component provides navigation context by displaying the current location within an application's hierarchy. It consists of the app logo which serves as a home link, followed by the current page or resource name. The component inherits the app's theme color for visual consistency. Optional primary and secondary action buttons can be included for common operations. This helps users understand their location and enables quick navigation back to previous levels.",
      },
    },
  },
  args: {
    app: {
      address: '/blog',
      icon: '',
      name: '',
      scope: [],
      display: false,
      displayName: 'Blog',
      isExternal: false,
    },
  },
};

export default meta;
type Story = StoryObj<typeof Breadcrumb>;

export const Base: Story = {};

export const BreadcrumbStory: Story = {
  name: 'Current Page Breadcrumb with resource name',
  args: {
    name: 'Mon nouveau blog',
  },
  parameters: {
    docs: {
      description: {
        story:
          "When navigating to a resource page, the `name` prop should be set to display the resource's name in the breadcrumb. This helps users understand their current location within the application hierarchy. For example, when viewing a blog post, the name would show the post's title.",
      },
    },
  },
};
