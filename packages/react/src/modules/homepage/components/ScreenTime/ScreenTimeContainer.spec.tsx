import {
  mockScreenTimeKidIds,
  mockScreenTimeMinutesPerHour,
} from '@edifice.io/config';
import { render, screen, waitFor, within } from '~/setup';
import { ScreenTimeContainer } from './ScreenTimeContainer';
import { formatDuration } from './utils';

// The MSW screen-time mock (packages/config/src/msw/mocks/screenTime.ts)
// answers with its default data, or an edge case picked by the kid id.

const { useUser } = vi.hoisted(() => ({ useUser: vi.fn() }));

vi.mock('../../../../hooks', async (importOriginal) => ({
  ...(await importOriginal<typeof import('../../../../hooks')>()),
  useUser,
}));

// jsdom has no canvas: the real chart can't render in tests.
vi.mock('./ScreenTimeChart', () => ({
  default: () => <div data-testid="chart" />,
}));

const student = {
  userId: 'student-1',
  firstName: 'Léa',
  lastName: 'Martin',
  children: {},
};

const parent = {
  userId: 'parent-1',
  firstName: 'Sacha',
  lastName: 'Lindo',
  children: {
    'alice-id': { firstName: 'Alice', lastName: 'Lindo' },
    [mockScreenTimeKidIds.empty]: { firstName: 'Marc', lastName: 'Lindo' },
  },
};

const dayTotal = formatDuration(
  mockScreenTimeMinutesPerHour.reduce((a, b) => a + b, 0),
);

describe('ScreenTimeContainer', () => {
  beforeEach(() => {
    useUser.mockReturnValue({ user: student });
  });

  it("shows today's and yesterday's screen time", async () => {
    render(<ScreenTimeContainer />);

    expect(await screen.findAllByText(dayTotal)).toHaveLength(2);
  });

  it("shows the selected kid's screen time when switching tabs", async () => {
    useUser.mockReturnValue({ user: parent });
    const { user } = render(<ScreenTimeContainer />);

    expect(await screen.findAllByText(dayTotal)).toHaveLength(2);

    await user.click(screen.getByRole('tab', { name: 'Marc' }));

    expect(
      await screen.findByText('Aucune donnée trouvée.'),
    ).toBeInTheDocument();
  });

  it('opens and closes the full-screen modal', async () => {
    const { user } = render(<ScreenTimeContainer />);

    await user.click(
      await screen.findByTestId('screen-time-button-fullscreen'),
    );
    const modal = await screen.findByRole('dialog');
    expect(await within(modal).findByTestId('chart')).toBeInTheDocument();

    await user.keyboard('{Escape}');
    await waitFor(() =>
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument(),
    );
  });
});
