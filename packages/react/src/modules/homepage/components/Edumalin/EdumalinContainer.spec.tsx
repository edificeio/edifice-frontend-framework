import { render, screen, within } from '~/setup';
import { EdumalinContainer } from './EdumalinContainer';

// Data comes from the MSW mock of /appregistry/edumalin/widget
// (packages/config/src/msw/mocks/edumalin.ts), which returns 4 contents.

describe('EdumalinContainer', () => {
  it('shows the first 3 Édumalin contents only', async () => {
    render(<EdumalinContainer />);

    expect(
      await screen.findByText('Préparer le brevet avec Édumalin'),
    ).toBeInTheDocument();
    expect(screen.getAllByRole('listitem')).toHaveLength(3);
    expect(
      screen.queryByText('Quatrième contenu, au-delà de la limite d’affichage'),
    ).not.toBeInTheDocument();
  });

  it('opens the details of a content, then its link in a new tab', async () => {
    const open = vi.spyOn(window, 'open').mockReturnValue(null);
    const { user } = render(<EdumalinContainer />);

    await user.click(
      await screen.findByRole('button', {
        name: /Préparer le brevet avec Édumalin/,
      }),
    );
    const modal = await screen.findByRole('dialog');
    await user.click(within(modal).getByRole('button', { name: 'S’inscrire' }));

    expect(open).toHaveBeenCalledWith(
      'https://edumalin.fr/webinaires/brevet',
      '_blank',
      'noopener,noreferrer',
    );
  });
});
