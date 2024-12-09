import { Meta, StoryObj } from '@storybook/react';

import Widget from '../Widget/Widget';
import BookmarkedApps from './BookmarkedApps';

const meta: Meta<typeof BookmarkedApps> = {
  title: 'Modules/Widgets/Bookmarked Apps',
  component: BookmarkedApps,
  decorators: [
    (Story) => (
      <div style={{ width: '300px' }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof BookmarkedApps>;

const bookmarkedApps = [
  {
    address: '/blog',
    icon: 'blog',
    name: '',
    scope: [],
    display: false,
    displayName: '',
    isExternal: false,
  },
  {
    address: '/wiki',
    icon: 'wiki',
    name: '',
    scope: [],
    display: false,
    displayName: '',
    isExternal: false,
  },
  {
    address: '/conversation',
    icon: 'conversation',
    name: '',
    scope: [],
    display: false,
    displayName: '',
    isExternal: false,
  },
  {
    address: '/rack',
    icon: 'rack',
    name: '',
    scope: [],
    display: false,
    displayName: '',
    isExternal: false,
  },
  {
    address: '/scrapbook',
    icon: 'scrapbook',
    name: '',
    scope: [],
    display: false,
    displayName: '',
    isExternal: false,
  },
  {
    address: '/workspace',
    icon: 'workspace',
    name: '',
    scope: [],
    display: false,
    displayName: '',
    isExternal: false,
  },
];

export const Base: Story = {
  render: (args) => (
    <Widget>
      <Widget.Body>
        <BookmarkedApps data={bookmarkedApps} />
      </Widget.Body>
    </Widget>
  ),
};

export const Empty: Story = {
  render: (args) => (
    <Widget>
      <Widget.Header>Mes applis</Widget.Header>
      <Widget.Body>
        <BookmarkedApps data={[]} />
      </Widget.Body>
      {[].length > 0 && <Widget.Footer>Plus</Widget.Footer>}
    </Widget>
  ),
};

export const Complete: Story = {
  render: (args) => (
    <Widget>
      <Widget.Header>Mes applis</Widget.Header>
      <Widget.Body>
        <BookmarkedApps data={bookmarkedApps} />
      </Widget.Body>
      {bookmarkedApps.length > 0 && <Widget.Footer>Plus</Widget.Footer>}
    </Widget>
  ),
};
