import { useHasWorkflow } from 'src/hooks';
import { render, screen } from '~/setup';
import { AlloRegionContainer } from './AlloRegionContainer';

vi.mock('src/hooks', async (importOriginal) => ({
  ...(await importOriginal<typeof import('src/hooks')>()),
  useHasWorkflow: vi.fn(),
}));

describe('AlloRegionContainer', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it.each([
    ['while the rights are loading', undefined],
    ['without the access right', false],
  ])('shows nothing %s', (_, hasAccess) => {
    vi.mocked(useHasWorkflow).mockReturnValue(hasAccess);

    render(<AlloRegionContainer />);

    expect(
      screen.queryByRole('heading', { name: 'Allô Région' }),
    ).not.toBeInTheDocument();
  });

  it('opens Allô Région in the same tab', async () => {
    vi.mocked(useHasWorkflow).mockReturnValue(true);
    const open = vi.spyOn(window, 'open').mockReturnValue(null);
    const { user } = render(<AlloRegionContainer />);

    await user.click(screen.getByRole('button', { name: 'Mes signalements' }));
    await user.click(
      screen.getByRole('button', { name: 'Faire un signalement' }),
    );

    expect(open).toHaveBeenNthCalledWith(1, '/alloregion', '_self');
    expect(open).toHaveBeenNthCalledWith(2, '/alloregion/new', '_self');
  });
});
