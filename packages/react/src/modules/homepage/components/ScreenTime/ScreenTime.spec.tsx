import { render, screen } from '~/setup';
import { ScreenTime } from './ScreenTime';
import { ScreenTimeKid } from './types';

const aliceKid: ScreenTimeKid = {
  id: 'alice-id',
  firstName: 'Alice',
  lastName: 'Lindo',
  displayName: 'Alice Lindo',
};

const marcKid: ScreenTimeKid = {
  id: 'marc-id',
  firstName: 'Marc',
  lastName: 'Lindo',
  displayName: 'Marc Lindo',
};

describe('ScreenTime', () => {
  it('calls onFullScreenClick when the header button is clicked', async () => {
    const onFullScreenClick = vi.fn();
    const { user } = render(
      <ScreenTime
        status="default"
        kids={[aliceKid]}
        selectedKidId={aliceKid.id}
        onKidChange={vi.fn()}
        todayMinutes={30}
        yesterdayMinutes={20}
        onFullScreenClick={onFullScreenClick}
      />,
    );

    await user.click(
      screen.getByRole('button', { name: 'Ouvrir en plein écran' }),
    );

    expect(onFullScreenClick).toHaveBeenCalledTimes(1);
  });

  it('does not render the full-screen button in the error status', () => {
    render(
      <ScreenTime
        status="error"
        kids={[aliceKid]}
        selectedKidId={aliceKid.id}
        onKidChange={vi.fn()}
        todayMinutes={0}
        yesterdayMinutes={0}
        onFullScreenClick={vi.fn()}
      />,
    );

    expect(
      screen.queryByRole('button', { name: 'Ouvrir en plein écran' }),
    ).not.toBeInTheDocument();
  });

  it('does not render the kid tab row with a single kid', () => {
    render(
      <ScreenTime
        status="default"
        kids={[aliceKid]}
        selectedKidId={aliceKid.id}
        onKidChange={vi.fn()}
        todayMinutes={30}
        yesterdayMinutes={20}
        onFullScreenClick={vi.fn()}
      />,
    );

    expect(screen.queryAllByRole('tab')).toHaveLength(0);
  });

  it('renders one tab per kid when there are several', () => {
    render(
      <ScreenTime
        status="default"
        kids={[aliceKid, marcKid]}
        selectedKidId={aliceKid.id}
        onKidChange={vi.fn()}
        todayMinutes={30}
        yesterdayMinutes={20}
        onFullScreenClick={vi.fn()}
      />,
    );

    expect(screen.getAllByRole('tab')).toHaveLength(2);
  });

  it('calls onKidChange when clicking an inactive tab', async () => {
    const onKidChange = vi.fn();
    const { user } = render(
      <ScreenTime
        status="default"
        kids={[aliceKid, marcKid]}
        selectedKidId={aliceKid.id}
        onKidChange={onKidChange}
        todayMinutes={30}
        yesterdayMinutes={20}
        onFullScreenClick={vi.fn()}
      />,
    );

    await user.click(screen.getByRole('tab', { name: marcKid.firstName }));

    expect(onKidChange).toHaveBeenCalledWith('marc-id');
  });

  it('renders the loading card while the kids are not known yet', () => {
    render(
      <ScreenTime
        status="loading"
        kids={[]}
        onKidChange={vi.fn()}
        todayMinutes={0}
        yesterdayMinutes={0}
        onFullScreenClick={vi.fn()}
      />,
    );

    expect(screen.getByText("Aujourd'hui")).toBeInTheDocument();
  });

  it('renders the empty message and no durations in the empty status', () => {
    render(
      <ScreenTime
        status="empty"
        kids={[aliceKid]}
        selectedKidId={aliceKid.id}
        onKidChange={vi.fn()}
        todayMinutes={0}
        yesterdayMinutes={0}
        onFullScreenClick={vi.fn()}
      />,
    );

    expect(screen.getByText('Aucune donnée trouvée.')).toBeInTheDocument();
    expect(screen.queryByText(/min/)).not.toBeInTheDocument();
  });

  it('renders formatted durations in the default status', () => {
    render(
      <ScreenTime
        status="default"
        kids={[aliceKid]}
        selectedKidId={aliceKid.id}
        onKidChange={vi.fn()}
        todayMinutes={87}
        yesterdayMinutes={45}
        onFullScreenClick={vi.fn()}
      />,
    );

    expect(screen.getByText('1h27min')).toBeInTheDocument();
    expect(screen.getByText('45min')).toBeInTheDocument();
  });
});
