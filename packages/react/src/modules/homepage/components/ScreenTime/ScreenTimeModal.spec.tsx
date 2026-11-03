import { render, screen } from '~/setup';
import { ScreenTimeModal, ScreenTimeModalProps } from './ScreenTimeModal';
import { ScreenTimeKid } from './types';
import { SCREEN_TIME_LEARN_MORE_URL } from './utils';

// jsdom has no canvas: the real chart can't render in tests, so it's
// replaced by a probe exposing the props that matter for the axis.
vi.mock('./ScreenTimeChart', () => ({
  default: (props: {
    axisMax: number;
    axisStep: number;
    axisTitle: string;
    labelStep: number;
  }) => (
    <div
      data-testid="chart"
      data-max={props.axisMax}
      data-step={props.axisStep}
      data-title={props.axisTitle}
      data-label-step={props.labelStep}
    />
  ),
}));

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

function renderModal(overrides: Partial<ScreenTimeModalProps> = {}) {
  const props: ScreenTimeModalProps = {
    isOpen: true,
    onClose: vi.fn(),
    kids: [aliceKid],
    selectedKid: aliceKid,
    onKidChange: vi.fn(),
    view: 'weekly',
    onViewChange: vi.fn(),
    date: '2026-06-24',
    canGoPrevious: true,
    canGoNext: true,
    onPrevious: vi.fn(),
    onNext: vi.fn(),
    status: 'default',
    ...overrides,
  };

  return { props, ...render(<ScreenTimeModal {...props} />) };
}

describe('ScreenTimeModal', () => {
  it('hides the student label and select with a single kid', async () => {
    renderModal();

    await screen.findByTestId('chart');
    expect(screen.queryByText('Collégien :')).not.toBeInTheDocument();
  });

  it('shows the student label and select with several kids', async () => {
    renderModal({ kids: [aliceKid, marcKid] });

    await screen.findByTestId('chart');
    expect(screen.getByText('Collégien :')).toBeInTheDocument();
    expect(screen.getByText(aliceKid.displayName)).toBeInTheDocument();
  });

  it('shows the weekly period label', async () => {
    renderModal({ view: 'weekly', date: '2026-06-24' });

    await screen.findByTestId('chart');
    expect(
      screen.getByText('semaine du 22 juin au 28 juin'),
    ).toBeInTheDocument();
  });

  it('shows the daily period label', async () => {
    renderModal({ view: 'daily', date: '2026-06-24' });

    await screen.findByTestId('chart');
    expect(screen.getByText('le mercredi 24 juin')).toBeInTheDocument();
  });

  it('calls onPrevious and onNext from the browsing buttons', async () => {
    const { props, user } = renderModal();
    await screen.findByTestId('chart');

    await user.click(
      screen.getByRole('button', { name: 'Période précédente' }),
    );
    await user.click(screen.getByRole('button', { name: 'Période suivante' }));

    expect(props.onPrevious).toHaveBeenCalledTimes(1);
    expect(props.onNext).toHaveBeenCalledTimes(1);
  });

  it('disables the browsing buttons on the range bounds', async () => {
    renderModal({ canGoPrevious: false, canGoNext: false });
    await screen.findByTestId('chart');

    expect(
      screen.getByRole('button', { name: 'Période précédente' }),
    ).toBeDisabled();
    expect(
      screen.getByRole('button', { name: 'Période suivante' }),
    ).toBeDisabled();
  });

  it('switches to the daily view from the segmented control', async () => {
    const { props, user } = renderModal();
    await screen.findByTestId('chart');

    await user.click(screen.getByText('Vue quotidienne'));

    expect(props.onViewChange).toHaveBeenCalledWith('daily');
  });

  it('shows "Pas de données" only in the empty status', async () => {
    renderModal({ status: 'empty' });

    await screen.findByTestId('chart');
    expect(screen.getByText('Pas de données')).toBeInTheDocument();
  });

  it('does not show "Pas de données" in the default status', async () => {
    renderModal({ status: 'default' });

    await screen.findByTestId('chart');
    expect(screen.queryByText('Pas de données')).not.toBeInTheDocument();
  });

  it('shows the error message and no chart in the error status', () => {
    renderModal({ status: 'error' });

    expect(document.body.textContent).toContain(
      'Problème de connexion avec le service.',
    );
    expect(screen.queryByTestId('chart')).not.toBeInTheDocument();
  });

  it('feeds the chart with the weekly axis, sized on the busiest day', async () => {
    renderModal({
      view: 'weekly',
      days: [
        { date: '2026-06-23', durationMinutes: 540, schoolUsePercentage: 0 },
      ],
    });

    const chart = await screen.findByTestId('chart');
    expect(chart).toHaveAttribute('data-max', '9');
    expect(chart).toHaveAttribute('data-step', '1');
    expect(chart).toHaveAttribute('data-title', 'Heures');
    expect(chart).toHaveAttribute('data-label-step', '2');
  });

  it('feeds the chart with the default daily axis when there is no data', async () => {
    renderModal({ view: 'daily' });

    const chart = await screen.findByTestId('chart');
    expect(chart).toHaveAttribute('data-max', '30');
    expect(chart).toHaveAttribute('data-step', '5');
    expect(chart).toHaveAttribute('data-title', 'Minutes');
    expect(chart).toHaveAttribute('data-label-step', '5');
  });

  it('opens the learn-more link in a new tab', async () => {
    const openSpy = vi.spyOn(window, 'open').mockImplementation(() => null);
    const { user } = renderModal();
    await screen.findByTestId('chart');

    await user.click(screen.getByRole('button', { name: 'En savoir plus' }));

    expect(openSpy).toHaveBeenCalledWith(
      SCREEN_TIME_LEARN_MORE_URL,
      '_blank',
      'noopener,noreferrer',
    );
  });
});
