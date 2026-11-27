import type { School } from '@edifice.io/client';
import { render, screen } from '~/setup';
import Cantine from './Cantine';
import { CantineDish, CantineSection } from './types';

function makeDish(overrides: Partial<CantineDish> = {}): CantineDish {
  return {
    id: 'entree-0',
    label: 'Coleslaw',
    vegetarien: false,
    faitmaison: false,
    bio: false,
    local: false,
    allergens: [],
    ...overrides,
  };
}

const sections: CantineSection[] = [
  { category: 'entree', items: [makeDish()] },
];

function makeSchool(id: string, name: string): School {
  return { id, name, UAI: `UAI-${id}`, exports: [], classes: [] } as School;
}

const schools = [
  makeSchool('school-1', 'École Jacques Prévert'),
  makeSchool('school-2', 'École Victor Hugo'),
];

describe('Cantine', () => {
  it('calls handleFullScreenClick when the header button is clicked', async () => {
    const handleFullScreenClick = vi.fn();
    const { user } = render(
      <Cantine
        status="default"
        sections={sections}
        handleFullScreenClick={handleFullScreenClick}
      />,
    );

    await user.click(
      screen.getByRole('button', { name: 'Ouvrir en plein écran' }),
    );

    expect(handleFullScreenClick).toHaveBeenCalledTimes(1);
  });

  it('does not render the full-screen button in the error status', () => {
    render(
      <Cantine status="error" sections={[]} handleFullScreenClick={vi.fn()} />,
    );

    expect(
      screen.queryByRole('button', { name: 'Ouvrir en plein écran' }),
    ).not.toBeInTheDocument();
  });

  it('renders the "voir plus" button only in the empty status', () => {
    const { rerender } = render(
      <Cantine
        status="default"
        sections={sections}
        handleFullScreenClick={vi.fn()}
      />,
    );

    expect(
      screen.queryByRole('button', { name: 'voir plus' }),
    ).not.toBeInTheDocument();

    rerender(
      <Cantine status="empty" sections={[]} handleFullScreenClick={vi.fn()} />,
    );

    expect(
      screen.getByRole('button', { name: 'voir plus' }),
    ).toBeInTheDocument();
  });

  it('does not render an allergens line for a dish without allergens', () => {
    render(
      <Cantine
        status="default"
        sections={[
          { category: 'entree', items: [makeDish({ allergens: [] })] },
        ]}
        handleFullScreenClick={vi.fn()}
      />,
    );

    expect(screen.getByText('Coleslaw')).toBeInTheDocument();
    expect(screen.queryByText(/gluten/)).not.toBeInTheDocument();
  });

  it('renders a comma-joined allergens line for a dish with allergens', () => {
    render(
      <Cantine
        status="default"
        sections={[
          {
            category: 'entree',
            items: [
              makeDish({ allergens: ['gluten', 'oeuf', 'fruits a coque'] }),
            ],
          },
        ]}
        handleFullScreenClick={vi.fn()}
      />,
    );

    expect(
      screen.getByText('gluten, oeuf, fruits a coque'),
    ).toBeInTheDocument();
  });

  it('renders one quality tag image per truthy flag on a dish', () => {
    render(
      <Cantine
        status="default"
        sections={[
          {
            category: 'entree',
            items: [
              makeDish({ vegetarien: true, faitmaison: true, bio: true }),
            ],
          },
        ]}
        handleFullScreenClick={vi.fn()}
      />,
    );

    expect(screen.getByAltText('Végétarien')).toBeInTheDocument();
    expect(screen.getByAltText('Fait maison')).toBeInTheDocument();
    expect(screen.getByAltText('Agriculture biologique')).toBeInTheDocument();
    expect(screen.queryByAltText('Produit local')).not.toBeInTheDocument();
  });

  it('shows the loading skeleton only in the loading status', () => {
    render(
      <Cantine
        status="loading"
        sections={[]}
        handleFullScreenClick={vi.fn()}
      />,
    );

    expect(screen.getByTestId('cantine-loading')).toBeInTheDocument();
  });

  it('shows the school select on the selected school when the user belongs to several schools', () => {
    render(
      <Cantine
        status="default"
        sections={sections}
        handleFullScreenClick={vi.fn()}
        schools={schools}
        selectedSchool={schools[1]}
        onSelectedSchoolChange={vi.fn()}
      />,
    );

    expect(screen.getByText('Établissement')).toBeInTheDocument();
    expect(screen.getByText('École Victor Hugo')).toBeInTheDocument();
  });

  it('hides the school select when the user belongs to a single school', () => {
    render(
      <Cantine
        status="default"
        sections={sections}
        handleFullScreenClick={vi.fn()}
        schools={[schools[0]]}
        selectedSchool={schools[0]}
        onSelectedSchoolChange={vi.fn()}
      />,
    );

    expect(screen.queryByText('Établissement')).not.toBeInTheDocument();
  });

  it('keeps the school select in the error status to switch to another school', () => {
    render(
      <Cantine
        status="error"
        sections={[]}
        handleFullScreenClick={vi.fn()}
        schools={schools}
        selectedSchool={schools[0]}
        onSelectedSchoolChange={vi.fn()}
      />,
    );

    expect(screen.getByText('Établissement')).toBeInTheDocument();
  });
});
