import type { Meta, StoryObj } from '@storybook/react-vite';
import Communities, { CommunitiesProps } from './Communities';
import CommunitiesMeta from './Communities.stories';
import CommunitiesSkeleton from './CommunitiesSkeleton';

const sixCommunitiesArgs = CommunitiesMeta.args as CommunitiesProps;
const fourCommunitiesArgs = {
  ...sixCommunitiesArgs,
  communitiesList: sixCommunitiesArgs.communitiesList?.slice(0, 4),
};

const meta = {
  title: 'Modules/Homepage/CommunitiesSkeleton',
  component: CommunitiesSkeleton,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ minWidth: '720px' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof CommunitiesSkeleton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const AboveTheLoadedCard: Story = {
  render: () => (
    <div className="skeleton-overlay-stack">
      <CommunitiesSkeleton />
      <Communities {...fourCommunitiesArgs} />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'The skeleton stacked on top of the loaded card. Any difference in height between the two is the layout shift the user would see when the data arrives.',
      },
    },
  },
};

export const SuperimposedOnTheLoadedCard: Story = {
  render: () => (
    <div className="skeleton-overlay">
      <Communities {...fourCommunitiesArgs} />
      <div className="skeleton-overlay-top">
        <CommunitiesSkeleton />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'The skeleton superimposed on a loaded card of four communities, at partial opacity. Each grey block should sit over the content it replaces; anything sticking out is a mismatch between the skeleton and the component.',
      },
    },
  },
};

export const SuperimposedOnSixCommunities: Story = {
  render: () => (
    <div className="skeleton-overlay">
      <Communities {...sixCommunitiesArgs} />
      <div className="skeleton-overlay-top">
        <CommunitiesSkeleton />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'The same overlay against six communities. The list only adds a column when an item fills it, so on a container wider than four items allow, the loaded card lays out more and narrower columns than the four-item skeleton. The item count is unknown while loading: four is the minimum column count, which matches every user with up to four communities.',
      },
    },
  },
};
