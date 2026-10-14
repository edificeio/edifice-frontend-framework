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

const leoKid: ScreenTimeKid = {
  id: 'leo-id',
  firstName: 'Léo',
  lastName: 'Lindo',
  displayName: 'Léo Lindo',
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

  it('shows the full first name on the active tab and the short label on inactive tabs', () => {
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

    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.getByText('M.')).toBeInTheDocument();
    expect(screen.queryByText('Marc')).not.toBeInTheDocument();
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

    await user.click(screen.getByRole('tab', { name: marcKid.displayName }));

    expect(onKidChange).toHaveBeenCalledWith('marc-id');
  });

  it('moves selection and focus to the next tab on ArrowRight', async () => {
    const onKidChange = vi.fn();
    const { user } = render(
      <ScreenTime
        status="default"
        kids={[aliceKid, marcKid, leoKid]}
        selectedKidId={aliceKid.id}
        onKidChange={onKidChange}
        todayMinutes={30}
        yesterdayMinutes={20}
        onFullScreenClick={vi.fn()}
      />,
    );

    screen.getByRole('tab', { name: aliceKid.displayName }).focus();
    await user.keyboard('{ArrowRight}');

    expect(onKidChange).toHaveBeenCalledWith('marc-id');
    expect(screen.getByRole('tab', { name: marcKid.displayName })).toBe(
      document.activeElement,
    );
  });

  it('wraps around to the first tab on ArrowRight from the last tab', async () => {
    const onKidChange = vi.fn();
    const { user } = render(
      <ScreenTime
        status="default"
        kids={[aliceKid, marcKid, leoKid]}
        selectedKidId={leoKid.id}
        onKidChange={onKidChange}
        todayMinutes={30}
        yesterdayMinutes={20}
        onFullScreenClick={vi.fn()}
      />,
    );

    screen.getByRole('tab', { name: leoKid.displayName }).focus();
    await user.keyboard('{ArrowRight}');

    expect(onKidChange).toHaveBeenCalledWith('alice-id');
    expect(screen.getByRole('tab', { name: aliceKid.displayName })).toBe(
      document.activeElement,
    );
  });

  it('wraps around to the last tab on ArrowLeft from the first tab', async () => {
    const onKidChange = vi.fn();
    const { user } = render(
      <ScreenTime
        status="default"
        kids={[aliceKid, marcKid, leoKid]}
        selectedKidId={aliceKid.id}
        onKidChange={onKidChange}
        todayMinutes={30}
        yesterdayMinutes={20}
        onFullScreenClick={vi.fn()}
      />,
    );

    screen.getByRole('tab', { name: aliceKid.displayName }).focus();
    await user.keyboard('{ArrowLeft}');

    expect(onKidChange).toHaveBeenCalledWith('leo-id');
    expect(screen.getByRole('tab', { name: leoKid.displayName })).toBe(
      document.activeElement,
    );
  });

  it('keeps exactly one tab reachable via Tab (tabIndex 0) when a kid is selected', () => {
    render(
      <ScreenTime
        status="default"
        kids={[aliceKid, marcKid, leoKid]}
        selectedKidId={marcKid.id}
        onKidChange={vi.fn()}
        todayMinutes={30}
        yesterdayMinutes={20}
        onFullScreenClick={vi.fn()}
      />,
    );

    const rovingTabs = screen
      .getAllByRole('tab')
      .filter((tab) => tab.getAttribute('tabindex') === '0');

    expect(rovingTabs).toHaveLength(1);
    expect(rovingTabs[0]).toBe(
      screen.getByRole('tab', { name: marcKid.displayName }),
    );
  });

  it('falls back to the first tab as the sole tabIndex-0 tab when no kid matches selectedKidId', () => {
    render(
      <ScreenTime
        status="default"
        kids={[aliceKid, marcKid, leoKid]}
        selectedKidId="unknown-id"
        onKidChange={vi.fn()}
        todayMinutes={30}
        yesterdayMinutes={20}
        onFullScreenClick={vi.fn()}
      />,
    );

    const rovingTabs = screen
      .getAllByRole('tab')
      .filter((tab) => tab.getAttribute('tabindex') === '0');

    expect(rovingTabs).toHaveLength(1);
    expect(rovingTabs[0]).toBe(
      screen.getByRole('tab', { name: aliceKid.displayName }),
    );
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
