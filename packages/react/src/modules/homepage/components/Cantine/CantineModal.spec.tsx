import { School } from '@edifice.io/client';
import { render, screen } from '~/setup';
import CantineModal, { CantineModalProps } from './CantineModal';
import { CantineSection } from './hooks/useCantineMenu';

function makeSchool(id: string, name: string): School {
  return { id, name, UAI: `UAI-${id}`, exports: [], classes: [] } as School;
}

const schools = [
  makeSchool('school-1', 'École Jacques Prévert'),
  makeSchool('school-2', 'École Victor Hugo'),
];

const sections: CantineSection[] = [
  {
    category: 'entree',
    items: [
      {
        id: 'entree-0',
        label: 'Coleslaw',
        vegetarien: true,
        faitmaison: false,
        bio: false,
        local: false,
        allergens: ['gluten'],
      },
    ],
  },
  {
    category: 'dessert',
    items: [
      {
        id: 'dessert-0',
        label: 'Fruits au sirop',
        vegetarien: false,
        faitmaison: false,
        bio: false,
        local: false,
        allergens: [],
      },
    ],
  },
];

function renderModal(overrides: Partial<CantineModalProps> = {}) {
  const props: CantineModalProps = {
    isOpen: true,
    onClose: vi.fn(),
    schools: [schools[0]],
    selectedSchool: schools[0],
    onSchoolChange: vi.fn(),
    hasDinner: false,
    menuType: 'lunch',
    onMenuTypeChange: vi.fn(),
    date: '2026-06-18',
    canGoPrevious: true,
    canGoNext: true,
    onPreviousDay: vi.fn(),
    onNextDay: vi.fn(),
    sections,
    status: 'default',
    ...overrides,
  };

  return { props, ...render(<CantineModal {...props} />) };
}

describe('CantineModal', () => {
  it('hides both selects when there is a single school and no dinner service', () => {
    renderModal();

    expect(screen.queryByText('Établissement')).not.toBeInTheDocument();
    expect(screen.queryByText('Menu')).not.toBeInTheDocument();
  });

  it('shows the school select only when the user belongs to several schools', () => {
    renderModal({ schools });

    expect(screen.getByText('Établissement')).toBeInTheDocument();
    expect(screen.getByText('École Jacques Prévert')).toBeInTheDocument();
  });

  it('shows the menu select only when a dinner menu is served', () => {
    renderModal({ hasDinner: true });

    expect(screen.getByText('Menu')).toBeInTheDocument();
    expect(screen.getByText('Déjeuner')).toBeInTheDocument();
  });

  it('renders the browsed day localized', () => {
    renderModal();

    expect(screen.getByText('jeudi 18 juin')).toBeInTheDocument();
  });

  it('browses to the previous and next day', async () => {
    const { props, user } = renderModal();

    await user.click(screen.getByRole('button', { name: 'Jour précédent' }));
    await user.click(screen.getByRole('button', { name: 'Jour suivant' }));

    expect(props.onPreviousDay).toHaveBeenCalledTimes(1);
    expect(props.onNextDay).toHaveBeenCalledTimes(1);
  });

  it('disables the browsing buttons on the range bounds', () => {
    renderModal({ canGoPrevious: false, canGoNext: false });

    expect(
      screen.getByRole('button', { name: 'Jour précédent' }),
    ).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Jour suivant' })).toBeDisabled();
  });

  it('renders every menu section with its dishes', () => {
    renderModal();

    expect(screen.getByText('Entrée')).toBeInTheDocument();
    expect(screen.getByText('Coleslaw')).toBeInTheDocument();
    expect(screen.getByText('Dessert')).toBeInTheDocument();
    expect(screen.getByText('Fruits au sirop')).toBeInTheDocument();
  });

  it('renders the unavailable message instead of the menu in the empty status', () => {
    renderModal({ status: 'empty', sections: [] });

    expect(
      screen.getByText('Le menu n’est pas disponible pour ce jour'),
    ).toBeInTheDocument();
    expect(screen.queryByText('Coleslaw')).not.toBeInTheDocument();
  });

  it('renders the unavailable message on an API error too', () => {
    renderModal({ status: 'error', sections: [] });

    expect(
      screen.getByText('Le menu n’est pas disponible pour ce jour'),
    ).toBeInTheDocument();
  });

  it('renders the skeleton in the loading status', () => {
    renderModal({ status: 'loading', sections: [] });

    expect(screen.getByTestId('cantine-modal-loading')).toBeInTheDocument();
  });

  it('always renders the legend', () => {
    renderModal();

    expect(screen.getByText('Légende')).toBeInTheDocument();
    expect(screen.getByText('Végétarien')).toBeInTheDocument();
    expect(screen.getByText('Produit local')).toBeInTheDocument();
  });
});
