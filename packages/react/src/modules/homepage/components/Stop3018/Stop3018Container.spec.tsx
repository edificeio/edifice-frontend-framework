import { useUser } from '../../../../hooks';
import { render, screen } from '~/setup';
import { Stop3018Container } from './Stop3018Container';

vi.mock('../../../../hooks', async (importOriginal) => ({
  ...(await importOriginal<typeof import('../../../../hooks')>()),
  useUser: vi.fn(),
}));

const mockProfile = (profile?: string) =>
  vi.mocked(useUser).mockReturnValue({
    user: undefined,
    avatar: '',
    userDescription: profile ? { profiles: [profile] } : undefined,
  } as ReturnType<typeof useUser>);

describe('Stop3018Container', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it.each([undefined, 'Teacher', 'Personnel'])(
    'shows nothing to the %s profile',
    (profile) => {
      mockProfile(profile);

      render(<Stop3018Container />);

      expect(
        screen.queryByRole('heading', { name: '3018 - stop au harcèlement !' }),
      ).not.toBeInTheDocument();
    },
  );

  it('opens the e-Enfance resources in a new tab', async () => {
    mockProfile('Student');
    const open = vi.spyOn(window, 'open').mockReturnValue(null);
    const { user } = render(<Stop3018Container />);

    await user.click(screen.getByRole('button', { name: 'Suis-je harcelé ?' }));

    expect(open).toHaveBeenCalledWith(
      'https://e-enfance.org/harcelometre/',
      '_blank',
      'noopener,noreferrer',
    );
  });

  it('opens the modal on "En savoir plus"', async () => {
    mockProfile('Relative');
    const { user } = render(<Stop3018Container />);

    await user.click(screen.getByRole('button', { name: 'En savoir plus' }));

    expect(
      await screen.findByRole('button', {
        name: 'FAQ conseils pour les parents',
      }),
    ).toBeInTheDocument();
  });
});
