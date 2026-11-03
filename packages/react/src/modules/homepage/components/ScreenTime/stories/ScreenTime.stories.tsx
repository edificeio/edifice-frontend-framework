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
