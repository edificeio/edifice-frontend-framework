import { Meta, StoryObj } from '@storybook/react';
import { Breadcrumb } from './Breadcrumb';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta: Meta<typeof Breadcrumb> = {
  title: 'Layout/Breadcrumb',
  component: Breadcrumb,
  parameters: {
    docs: {
      description: {
        component:
          'Breadcrumb is always composed of the app logo, a primary action button, and in some cases can have a secondary action. The app logo and the name of the app take the app color.',
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
          'If we navigate to a resource page, props `name` should pass the name of the target resource.',
      },
    },
  },
};
