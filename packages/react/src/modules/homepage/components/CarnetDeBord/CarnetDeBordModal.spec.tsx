import { mockPronoteStructures } from '@edifice.io/config';
import { render, screen } from '~/setup';
import { CarnetDeBordModal } from './CarnetDeBordModal';
import { ContentTitle } from './types';
import { computeContentTypes, parseEleves } from './utils';

const [alice, , ines] = parseEleves(mockPronoteStructures, {});

const renderModal = (activeTab: ContentTitle, eleve = alice) =>
  render(
    <CarnetDeBordModal
      isOpen
      onClose={vi.fn()}
      studentName={eleve.name}
      contentTypes={computeContentTypes(eleve)}
      activeTab={activeTab}
      onTabChange={vi.fn()}
      address={eleve.address}
    />,
  );

describe('CarnetDeBordModal', () => {
  it('lists the latenesses and absences', () => {
    renderModal('retards-absences');

    expect(screen.getByText('Carnet de bord de Alice')).toBeInTheDocument();
    expect(screen.getByText('Retard')).toBeInTheDocument();
    expect(screen.getByText('Absence')).toBeInTheDocument();
    expect(
      screen.getByText('du 27/05/2024 - 08:00 au 27/05/2024 - 12:00'),
    ).toBeInTheDocument();
    expect(screen.getByText('Raison médicale')).toBeInTheDocument();
  });

  it('lists one row per homework', () => {
    renderModal('diary');

    expect(screen.getByText('MATHEMATIQUES')).toBeInTheDocument();
    expect(screen.getByText('Exercices 4 et 5 page 112')).toBeInTheDocument();
    expect(screen.getByText('HISTOIRE-GEOGRAPHIE')).toBeInTheDocument();
    expect(screen.getByText('Pas de description')).toBeInTheDocument();
  });

  it('splits the skill value into date, subject and status', () => {
    renderModal('skills');

    expect(screen.getByText('13/06/2024')).toBeInTheDocument();
    expect(screen.getByText('MATHEMATIQUES')).toBeInTheDocument();
    expect(screen.getByText('Evaluation')).toBeInTheDocument();
    expect(
      screen.getByText('Compétence : Résoudre des problèmes'),
    ).toBeInTheDocument();
  });

  it('displays the empty message of an empty category', () => {
    renderModal('skills', ines);

    expect(screen.getByText('Pas de compétences évaluées')).toBeInTheDocument();
  });

  it('omits the student name from the title in student view', () => {
    const eleve = alice;
    render(
      <CarnetDeBordModal
        isOpen
        onClose={vi.fn()}
        contentTypes={computeContentTypes(eleve)}
        activeTab="grades"
        onTabChange={vi.fn()}
        address={eleve.address}
      />,
    );

    expect(
      screen.getByRole('dialog', { name: 'Carnet de bord' }),
    ).toBeInTheDocument();
    expect(screen.queryByText(/Carnet de bord de/)).not.toBeInTheDocument();
  });

  it('opens Pronote in a new tab', async () => {
    const open = vi.spyOn(window, 'open').mockImplementation(() => null);
    const { user } = renderModal('grades');

    await user.click(screen.getByRole('button', { name: 'Voir sur Pronote' }));

    expect(open).toHaveBeenCalledWith(
      'https://pronote.example.com/',
      '_blank',
      'noopener,noreferrer',
    );
    open.mockRestore();
  });
});
