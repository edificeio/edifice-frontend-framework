import { Meta, StoryObj } from '@storybook/react-vite';
import { ScreenTime } from '../ScreenTime';
import { ScreenTimeKid } from '../types';

const alice: ScreenTimeKid = {
  id: 'alice-id',
  firstName: 'Alice',
  lastName: 'Lindo',
  displayName: 'Alice Lindo',
};

const marc: ScreenTimeKid = {
  id: 'marc-id',
  firstName: 'Marc',
  lastName: 'Lindo',
  displayName: 'Marc Lindo',
};

const ines: ScreenTimeKid = {
  id: 'ines-id',
  firstName: 'Inès',
  lastName: 'Lindo',
  displayName: 'Inès Lindo',
};

const multiKids = [alice, marc, ines];
const singleKid = [alice];

const meta: Meta<typeof ScreenTime> = {
  title: 'Modules/Homepage/ScreenTime/Widget',
  component: ScreenTime,
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 397 }}>
        <div id="portal" />
        <Story />
      </div>
    ),
  ],
  parameters: {
    docs: {
      description: {
        component:
          "Temps d'écran quotidien/hebdomadaire d'un ou plusieurs enfants. Le bouton plein écran ouvre la modale de navigation avec vue hebdomadaire ou quotidienne.",
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof ScreenTime>;

export const WithContentMultiKids: Story = {
  args: {
    status: 'default',
    kids: multiKids,
    selectedKidId: alice.id,
    onKidChange: () => {},
    todayMinutes: 87,
    yesterdayMinutes: 45,
    onFullScreenClick: () => {},
  },
};

export const WithContentSingleKid: Story = {
  args: {
    ...WithContentMultiKids.args,
    kids: singleKid,
  },
};

export const NoContentMultiKids: Story = {
  args: {
    status: 'empty',
    kids: multiKids,
    selectedKidId: alice.id,
    onKidChange: () => {},
    todayMinutes: 0,
    yesterdayMinutes: 0,
    onFullScreenClick: () => {},
  },
};

export const NoContentSingleKid: Story = {
  args: {
    ...NoContentMultiKids.args,
    kids: singleKid,
  },
};

export const ErrorState: Story = {
  name: 'Error',
  args: {
    status: 'error',
    kids: singleKid,
    selectedKidId: alice.id,
    onKidChange: () => {},
    todayMinutes: 0,
    yesterdayMinutes: 0,
    onFullScreenClick: () => {},
  },
};

export const Loading: Story = {
  args: {
    status: 'loading',
    kids: singleKid,
    selectedKidId: alice.id,
    onKidChange: () => {},
    todayMinutes: 0,
    yesterdayMinutes: 0,
    onFullScreenClick: () => {},
  },
};

export const Skeleton: Story = {
  args: { ...WithContentMultiKids.args, isLoading: true },
};

export const SkeletonAboveTheLoadedCard: Story = {
  args: WithContentMultiKids.args,
  render: (args) => (
    <div className="skeleton-overlay-stack">
      <ScreenTime {...args} isLoading />
      <ScreenTime {...args} />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'The skeleton card shown while the widget loads, stacked on top of the loaded card. Its content block is sized to this loaded card, so any difference in height is the layout shift the user would see.',
      },
    },
  },
};

export const SkeletonSuperimposedOnTheLoadedCard: Story = {
  args: WithContentMultiKids.args,
  render: (args) => (
    <div className="skeleton-overlay">
      <ScreenTime {...args} />
      <div className="skeleton-overlay-top">
        <ScreenTime {...args} isLoading />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'The skeleton card superimposed on the loaded card, at partial opacity. The header and the content block should cover the loaded header and content exactly.',
      },
    },
  },
};
