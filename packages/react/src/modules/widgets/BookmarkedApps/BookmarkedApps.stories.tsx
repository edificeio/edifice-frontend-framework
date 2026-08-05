import { Meta, StoryObj } from '@storybook/react-vite';

import Widget from '../Widget/Widget';
import BookmarkedApps from './BookmarkedApps';

const meta: Meta<typeof BookmarkedApps> = {
  title: 'Modules/Widgets/Bookmarked Apps',
  component: BookmarkedApps,
  parameters: {
    docs: {
      description: {
        component:
          "The `BookmarkedApps` component is the homepage widget listing the user's favourite applications as clickable icons linking to each app. It renders **at most the first six** entries of the `data` array it receives — the caller decides the ordering. When the list is empty, it falls back to a link inviting the user to pick their favourite apps. It is a pure display component: it neither fetches nor persists the bookmarks.",
      },
    },
  },
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
  render: () => (
    <Widget>
      <Widget.Body>
        <BookmarkedApps data={bookmarkedApps} />
      </Widget.Body>
    </Widget>
  ),
};

export const Empty: Story = {
  render: () => (
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
  render: () => (
    <Widget>
      <Widget.Header>Mes applis</Widget.Header>
      <Widget.Body>
        <BookmarkedApps data={bookmarkedApps} />
      </Widget.Body>
      {bookmarkedApps.length > 0 && <Widget.Footer>Plus</Widget.Footer>}
    </Widget>
  ),
};
