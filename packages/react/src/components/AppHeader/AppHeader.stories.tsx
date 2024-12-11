import { Meta, StoryObj } from '@storybook/react';
import Breadcrumb from '../Breadcrumb/Breadcrumb';
import { Button } from '../Button';
import AppHeader from './AppHeader';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta: Meta<typeof AppHeader> = {
  title: 'Layout/AppHeader',
  component: AppHeader,
  parameters: {
    docs: {
      description: {
        component:
          'AppHeader is a layout component that combines a Breadcrumb navigation with action buttons. It provides a consistent header structure for applications, displaying the current location in the navigation hierarchy along with relevant action buttons for that context.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof AppHeader>;

export const Base: Story = {
  name: 'Basic AppHeader with primary action',
  args: {
    children: (
      <Breadcrumb
        app={{
          address: '/blog',
          icon: '',
          name: '',
          scope: [],
          display: false,
          displayName: 'Blog',
          isExternal: false,
        }}
      />
    ),
    render: () => (
      <>
        <Button>Action</Button>
      </>
    ),
  },
};

export const AppHeaderStory3: Story = {
  name: 'AppHeader with primary and secondary action',
  args: {
    children: (
      <Breadcrumb
        app={{
          address: '/blog',
          icon: '',
          name: '',
          scope: [],
          display: false,
          displayName: 'Blog',
          isExternal: false,
        }}
      />
    ),
    render: () => (
      <>
        <Button variant="outline">Button</Button>
        <Button>Action</Button>
      </>
    ),
  },
};

export const AppHeaderStory4: Story = {
  name: 'Current Page Breadcrumb with resource name',
  args: {
    children: (
      <Breadcrumb
        app={{
          address: '/blog',
          icon: '',
          name: '',
          scope: [],
          display: false,
          displayName: 'Blog',
          isExternal: false,
        }}
        name="Mon nouveau blog"
      />
    ),
  },
  parameters: {
    docs: {
      description: {
        story:
          'If we navigate to a resource page, the name property receives the name of the target resource.',
      },
    },
  },
};

export const BreadcrumbStory5: Story = {
  name: 'Current Page Breadcrumb with resource name and possible actions.',
  args: {
    children: (
      <Breadcrumb
        app={{
          address: '/blog',
          icon: '',
          name: '',
          scope: [],
          display: false,
          displayName: 'Blog',
          isExternal: false,
        }}
        name="Mon nouveau blog"
      />
    ),
    render: () => (
      <>
        <Button variant="outline">Button 1</Button>
        <Button>Button 2</Button>
      </>
    ),
  },
};
