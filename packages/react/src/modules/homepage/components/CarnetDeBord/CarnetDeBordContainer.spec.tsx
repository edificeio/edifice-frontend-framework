import { render, screen } from '~/setup';
import { CarnetDeBordContainer } from './CarnetDeBordContainer';
import * as queries from './services/queries/carnetDeBord';

// The MSW Pronote mock (packages/config/src/msw/mocks/carnetDeBord.ts)
// answers with its default data. The query hook is wrapped so that a test
// can replace its result without waiting for the query retries.
const { usePronoteStructures } = vi.hoisted(() => ({
  usePronoteStructures: vi.fn(),
}));

vi.mock('./services/queries/carnetDeBord', async (importOriginal) => ({
  ...(await importOriginal<typeof queries>()),
  usePronoteStructures,
}));

describe('CarnetDeBordContainer', () => {
  beforeEach(async () => {
    const actual = await vi.importActual<typeof queries>(
      './services/queries/carnetDeBord',
    );
    usePronoteStructures.mockImplementation(actual.usePronoteStructures);
  });

  it('loads the Pronote logbook and opens the detail modal', async () => {
    const { user } = render(<CarnetDeBordContainer />);

    const grades = await screen.findByTestId('carnet-de-bord-button-grades');
    await user.click(grades);

    // The mocked session user is not a parent: student view.
    expect(
      await screen.findByRole('dialog', { name: 'Carnet de bord' }),
    ).toBeInTheDocument();
    expect(screen.getByText('TECHNOLOGIE')).toBeInTheDocument();
    expect(screen.getByText('16,00/20')).toBeInTheDocument();
  });

  it('displays the error state when Pronote is unavailable', () => {
    usePronoteStructures.mockReturnValueOnce({
      data: undefined,
      isPending: false,
      isError: true,
    });

    render(<CarnetDeBordContainer />);

    expect(
      screen.getByText(/problème avec le service Pronote/),
    ).toBeInTheDocument();
  });
});
