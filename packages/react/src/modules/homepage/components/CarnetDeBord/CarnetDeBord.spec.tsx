import { mockPronoteStructures } from '@edifice.io/config';
import { render, screen } from '~/setup';
import { CarnetDeBord } from './CarnetDeBord';
import { parseEleves } from './utils';

const eleves = parseEleves(mockPronoteStructures, {});
const [alice, , ines] = eleves;

describe('CarnetDeBord', () => {
  it('displays the compact summary of each category', () => {
    render(
      <CarnetDeBord
        status="default"
        eleves={[alice]}
        currentEleveIndex={0}
        onEleveChange={vi.fn()}
      />,
    );

    expect(screen.getByText('le 08/06/2024 - 08:30')).toBeInTheDocument();
    expect(
      screen.getByText('16,00/20 en TECHNOLOGIE le 18/04/2024'),
    ).toBeInTheDocument();
    expect(
      screen.getByText('Nouveau devoir MATHEMATIQUES pour le 12/06/2024'),
    ).toBeInTheDocument();
    expect(
      screen.getByText('Evaluation le 13/06/2024 en MATHEMATIQUES'),
    ).toBeInTheDocument();
    // A single eleve has no tab bar.
    expect(screen.queryByRole('tablist')).not.toBeInTheDocument();
  });

  it('opens the modal on a clicked category', async () => {
    const { user } = render(
      <CarnetDeBord
        status="default"
        eleves={[alice]}
        currentEleveIndex={0}
        onEleveChange={vi.fn()}
        isRelative
      />,
    );

    await user.click(screen.getByTestId('carnet-de-bord-button-grades'));

    expect(
      screen.getByRole('dialog', { name: 'Carnet de bord de Alice' }),
    ).toBeInTheDocument();
    expect(screen.getByText('TECHNOLOGIE')).toBeInTheDocument();
    expect(screen.getByText('16,00/20')).toBeInTheDocument();
  });

  it('opens the modal on the first filled category with "see more"', async () => {
    const { user } = render(
      <CarnetDeBord
        status="default"
        eleves={[alice]}
        currentEleveIndex={0}
        onEleveChange={vi.fn()}
      />,
    );

    await user.click(screen.getByRole('button', { name: 'Voir plus' }));

    // Student view (default): the title omits the student's name.
    expect(
      screen.getByRole('dialog', { name: 'Carnet de bord' }),
    ).toBeInTheDocument();
    expect(
      screen.queryByText('Carnet de bord de Alice'),
    ).not.toBeInTheDocument();
    expect(screen.getByText('Raison médicale')).toBeInTheDocument();
  });

  it('renders empty categories as inert rows', () => {
    render(
      <CarnetDeBord
        status="default"
        eleves={[ines]}
        currentEleveIndex={0}
        onEleveChange={vi.fn()}
      />,
    );

    expect(screen.getByText('Pas de notes')).toBeInTheDocument();
    expect(
      screen.queryByTestId('carnet-de-bord-button-grades'),
    ).not.toBeInTheDocument();
  });

  it('displays the tab of a single kid in parent view', () => {
    render(
      <CarnetDeBord
        status="default"
        eleves={[alice]}
        currentEleveIndex={0}
        onEleveChange={vi.fn()}
        isRelative
      />,
    );

    expect(
      screen.getByRole('tablist', { name: 'Enfants' }),
    ).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Alice' })).toBeInTheDocument();
  });

  it('displays a tab per eleve and notifies the selected index', async () => {
    const onEleveChange = vi.fn();
    const { user } = render(
      <CarnetDeBord
        status="default"
        eleves={eleves}
        currentEleveIndex={0}
        onEleveChange={onEleveChange}
      />,
    );

    expect(
      screen.getByRole('tablist', { name: 'Enfants' }),
    ).toBeInTheDocument();
    await user.click(screen.getByRole('tab', { name: 'Marius' }));
    expect(onEleveChange).toHaveBeenCalledWith(1);
  });

  it('displays the error and empty states', () => {
    const { rerender } = render(
      <CarnetDeBord
        status="error"
        eleves={[]}
        currentEleveIndex={0}
        onEleveChange={vi.fn()}
      />,
    );
    expect(
      screen.getByText(/problème avec le service Pronote/),
    ).toBeInTheDocument();

    rerender(
      <CarnetDeBord
        status="empty"
        eleves={[]}
        currentEleveIndex={0}
        onEleveChange={vi.fn()}
      />,
    );
    expect(screen.getByText('Aucune donnée disponible')).toBeInTheDocument();
  });
});
