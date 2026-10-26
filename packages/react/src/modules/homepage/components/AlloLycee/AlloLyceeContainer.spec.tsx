import { useHasWorkflow } from 'src/hooks';
import { render, screen } from '~/setup';
import { AlloLyceeContainer } from './AlloLyceeContainer';

vi.mock('src/hooks', async (importOriginal) => ({
  ...(await importOriginal<typeof import('src/hooks')>()),
  useHasWorkflow: vi.fn(),
}));

describe('AlloLyceeContainer', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it.each([
    ['while the rights are loading', undefined],
    ['without the access right', false],
  ])('shows nothing %s', (_, hasAccess) => {
    vi.mocked(useHasWorkflow).mockReturnValue(hasAccess);

    render(<AlloLyceeContainer />);

    expect(
      screen.queryByRole('heading', { name: 'Allô Lycée' }),
    ).not.toBeInTheDocument();
  });

  it('opens Allô Lycée in the same tab', async () => {
    vi.mocked(useHasWorkflow).mockReturnValue(true);
    const open = vi.spyOn(window, 'open').mockReturnValue(null);
    const { user } = render(<AlloLyceeContainer />);

    await user.click(screen.getByRole('button', { name: 'Mes demandes' }));
    await user.click(screen.getByRole('button', { name: 'Faire une demande' }));

    expect(open).toHaveBeenNthCalledWith(1, '/allolycee', '_self');
    expect(open).toHaveBeenNthCalledWith(2, '/allolycee/new', '_self');
  });
});
