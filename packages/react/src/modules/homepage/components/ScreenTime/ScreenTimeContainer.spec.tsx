import { mockScreenTimeMinutesPerHour } from '@edifice.io/config';
import { render, screen, waitFor, within } from '~/setup';
import { ScreenTimeContainer } from './ScreenTimeContainer';
import { formatDuration } from './utils';

// The session user has no children: they are the only kid, and the MSW
// screen-time mock (packages/config/src/msw/mocks/screenTime.ts) answers
// with its default data for them.

// jsdom has no canvas: the real chart can't render in tests.
vi.mock('./ScreenTimeChart', () => ({
  default: () => <div data-testid="chart" />,
}));

const dayTotal = formatDuration(
  mockScreenTimeMinutesPerHour.reduce((a, b) => a + b, 0),
);

describe('ScreenTimeContainer', () => {
  it("shows today's and yesterday's screen time", async () => {
    render(<ScreenTimeContainer />);

    expect(await screen.findAllByText(dayTotal)).toHaveLength(2);
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
