import { Meta, StoryObj } from '@storybook/react';

import { AppIcon } from '../../../../components';
import { InternalLinker } from './InternalLinker';

const meta: Meta<typeof InternalLinker> = {
  title: 'Modules/Multimedia/InternalLinker',
  component: InternalLinker,
  args: {
    appCode: 'wiki',
    applicationList: [
      {
        application: 'wiki',
        displayName: 'Wiki',
        icon: <AppIcon app="wiki" size="24" />,
      },
      {
        application: 'blog',
        displayName: 'Blog',
        icon: <AppIcon app="blog" size="24" />,
      },
    ],
  },
  parameters: {
    docs: {
      description: {
        component:
          '`InternalLinker` component is used to link to internal resources.',
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof InternalLinker>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
export const Base: Story = {
  render: (args: any) => {
    return <InternalLinker {...args} />;
  },
};

/* <InternalLinker
          appCode="wiki"
          defaultAppCode="wiki"
          applicationList={[{ application: appCode, displayName: 'Wiki' }]}
          multiple={false}
          resourceList={filteredWikis?.map((wiki) => ({
            ...wiki,
            path: `/wiki/id:${wiki.id}`,
          }))}
          onSelect={onSelectDestinationWiki}
          showApplicationSelector={false}
        /> */

export const SingleChoice: Story = {
  render: (args: any) => {
    return <InternalLinker {...args} />;
  },
  parameters: {
    docs: {
      description: {
        story:
          'When `multiple` is set to `false`, only one resource can be selected.',
      },
    },
  },
  args: {
    multiple: false,
    defaultAppCode: 'wiki',
  },
};

export const SingleApplication: Story = {
  render: (args: any) => {
    return <InternalLinker {...args} />;
  },
  parameters: {
    docs: {
      description: {
        story:
          'When `showApplicationSelector` is set to `false`, the application selector is not displayed.',
      },
    },
  },
  args: {
    multiple: false,
    appCode: 'wiki',
    applicationList: [{ application: 'wiki', displayName: 'Wiki' }],
    defaultAppCode: 'wiki',
    showApplicationSelector: false,
  },
};

export const CustomResources: Story = {
  render: (args: any) => {
    return <InternalLinker {...args} />;
  },
  parameters: {
    docs: {
      description: {
        story: 'You can pass custom resources when `resourceList` is provided.',
      },
    },
  },
  args: {
    multiple: false,
    appCode: 'wiki',
    applicationList: [{ application: 'wiki', displayName: 'Wiki' }],
    defaultAppCode: 'wiki',
    resourceList: [
      {
        id: 'resource1',
        assetId: '1',
        name: 'Resource One',
        path: '/resources/1',
        application: 'wiki',
        thumbnail: '',
        updatedAt: '2023-10-03T15:00:00Z',
        trashed: false,
        rights: [],
        creatorId: 'creator123',
        creatorName: 'John Doe',
        createdAt: '2023-10-01T00:00:00Z',
        modifiedAt: '2023-10-02T12:00:00Z',
        modifierId: 'modifier123',
        modifierName: 'Jane Doe',
        description: 'A sample resource',
      },
      {
        id: 'resource2',
        assetId: '2',
        name: 'Resource Two',
        path: '/resources/2',
        application: 'wiki',
        thumbnail: '',
        updatedAt: '2023-10-04T10:30:00Z',
        trashed: false,
        rights: [],
        creatorId: 'creator124',
        creatorName: 'Alice Smith',
        createdAt: '2023-10-02T08:00:00Z',
        modifiedAt: '2023-10-03T14:20:00Z',
        modifierId: 'modifier124',
        modifierName: 'Bob Johnson',
        description: 'Another sample resource',
      },
      {
        id: 'resource3',
        assetId: '3',
        name: 'Resource Three',
        path: '/resources/3',
        application: 'wiki',
        thumbnail: '',
        updatedAt: '2023-10-05T09:15:00Z',
        trashed: false,
        rights: [],
        creatorId: 'creator125',
        creatorName: 'Charlie Brown',
        createdAt: '2023-10-03T07:45:00Z',
        modifiedAt: '2023-10-04T11:30:00Z',
        modifierId: 'modifier125',
        modifierName: 'Daisy Ridley',
        description: 'Yet another sample resource',
      },
      {
        id: 'resource4',
        assetId: '4',
        name: 'Resource Four',
        path: '/resources/4',
        application: 'wiki',
        thumbnail: '',
        updatedAt: '2023-10-06T12:00:00Z',
        trashed: false,
        rights: [],
        creatorId: 'creator126',
        creatorName: 'Ethan Hunt',
        createdAt: '2023-10-04T06:30:00Z',
        modifiedAt: '2023-10-05T13:45:00Z',
        modifierId: 'modifier126',
        modifierName: 'Fiona Gallagher',
        description: 'Fourth sample resource',
      },
      {
        id: 'resource5',
        assetId: '5',
        name: 'Resource Five',
        path: '/resources/5',
        application: 'wiki',
        thumbnail: '',
        updatedAt: '2023-10-07T14:25:00Z',
        trashed: false,
        rights: [],
        creatorId: 'creator127',
        creatorName: 'George Wilson',
        createdAt: '2023-10-05T05:15:00Z',
        modifiedAt: '2023-10-06T16:50:00Z',
        modifierId: 'modifier127',
        modifierName: 'Hannah Montana',
        description: 'Fifth sample resource',
      },
    ],
    showApplicationSelector: false,
  },
};

export const NoResourceFound: Story = {
  render: (args: any) => {
    return <InternalLinker {...args} />;
  },
  parameters: {
    docs: {
      description: {
        story: 'When no resource is found, the component displays a message.',
      },
    },
  },
  args: {
    multiple: false,
    defaultAppCode: 'blog',
  },
};
