import {
  mockScreenTimeMinutesPerHour,
  mockScreenTimeMinutesPerWeekday,
} from '@edifice.io/config';
import { Meta, StoryObj } from '@storybook/react-vite';
import { ScreenTimeModal } from '../ScreenTimeModal';
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

// Week of Monday 22 June 2026.
const weekOf = (minutesPerWeekday: number[]) =>
  minutesPerWeekday.map((durationMinutes, index) => ({
    date: `2026-06-${22 + index}`,
    durationMinutes,
    schoolUsePercentage: 0,
  }));

const hours = mockScreenTimeMinutesPerHour.map((durationMinutes, hour) => ({
  hour: String(hour).padStart(2, '0'),
  durationMinutes,
  schoolUsePercentage: 0,
}));

const meta: Meta<typeof ScreenTimeModal> = {
  title: 'Modules/Homepage/ScreenTime/Modal',
  component: ScreenTimeModal,
  decorators: [
    (Story) => (
      <>
        <div id="portal" />
        <Story />
      </>
    ),
  ],
  args: {
    isOpen: true,
    onClose: () => {},
    kids: [alice, marc],
    selectedKid: alice,
    onKidChange: () => {},
    view: 'weekly',
    onViewChange: () => {},
    date: '2026-06-24',
    canGoPrevious: true,
    canGoNext: true,
    onPrevious: () => {},
    onNext: () => {},
    days: weekOf(mockScreenTimeMinutesPerWeekday),
    status: 'default',
  },
  parameters: {
    docs: {
      description: {
        component:
          "Modale plein écran du temps d'écran : vue hebdomadaire ou quotidienne, navigation par période dans l'année scolaire en cours.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof ScreenTimeModal>;

export const Weekly: Story = {};

export const WeeklyLow: Story = {
  args: {
    days: weekOf([90, 60, 156, 30, 45, 20, 10]),
  },
};

export const Daily: Story = {
  args: {
    view: 'daily',
    hours,
  },
};

export const NoData: Story = {
  args: {
    days: [],
    status: 'empty',
  },
};

export const ErrorState: Story = {
  name: 'Error',
  args: {
    status: 'error',
  },
};
