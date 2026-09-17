import { render, screen } from '~/setup';
import Cantine from './Cantine';
import { CantineDish, CantineSection } from './hooks/useCantineMenu';

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
});
