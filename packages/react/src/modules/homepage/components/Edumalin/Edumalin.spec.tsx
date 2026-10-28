import { render, screen } from '~/setup';
import Edumalin, { EdumalinProps } from './Edumalin';
import { EdumalinItem } from './types';

const webinar: EdumalinItem = {
  title: 'Préparer le brevet',
  description: 'Un webinaire pour accompagner vos élèves.',
  picture: 'https://edumalin.fr/webinar.png',
  type: { name: 'Webinaire' },
};

const renderEdumalin = (props: Partial<EdumalinProps> = {}) =>
  render(
    <Edumalin
      status="default"
      items={[webinar]}
      onItemClick={vi.fn()}
      onEdumalinClick={vi.fn()}
      {...props}
    />,
  );

describe('Edumalin', () => {
  it('opens the details of the clicked item', async () => {
    const onItemClick = vi.fn();
    const { user } = renderEdumalin({ onItemClick });

    await user.click(
      screen.getByRole('button', { name: /Préparer le brevet/ }),
    );

    expect(onItemClick).toHaveBeenCalledWith(webinar);
  });

  it('opens Édumalin from the header, whatever the state', async () => {
    const onEdumalinClick = vi.fn();
    const { user } = renderEdumalin({ status: 'loading', onEdumalinClick });

    await user.click(
      screen.getByRole('button', { name: 'Accéder à Édumalin' }),
    );

    expect(onEdumalinClick).toHaveBeenCalled();
  });

  it('matches type names ignoring accents, and falls back to "Autre"', () => {
    renderEdumalin({
      items: [
        { ...webinar, title: 'A', type: { name: 'Temoignage' } },
        { ...webinar, title: 'B', type: { name: 'Conférence' } },
      ],
    });

    expect(screen.getByText('Témoignage')).toBeInTheDocument();
    expect(screen.getByText('Autre')).toBeInTheDocument();
  });

  it('shows the Édumalin logo when the item has no valid picture', () => {
    renderEdumalin({
      items: [
        { ...webinar, title: 'A' },
        { ...webinar, title: 'B', picture: 'not-an-url' },
      ],
    });

    const [picture, fallback] = screen.getAllByTestId('edumalin-item-picture');
    expect(picture).toHaveAttribute('src', webinar.picture);
    expect(fallback.getAttribute('src')).toContain('illu-edumalin');
  });

  it('tells a connection error apart from a load error, with the API error', () => {
    const error = { code: 400, message: 'edumalin.widget.missing' };
    const { rerender } = renderEdumalin({ status: 'connectionError', error });

    expect(
      screen.getByText('Impossible d’établir une connexion avec Édumalin.'),
    ).toBeInTheDocument();
    expect(
      screen.getByText('Erreur 400 : edumalin.widget.missing'),
    ).toBeInTheDocument();

    rerender(
      <Edumalin
        status="loadError"
        error={error}
        items={[]}
        onItemClick={vi.fn()}
        onEdumalinClick={vi.fn()}
      />,
    );

    expect(
      screen.getByText('Impossible de récupérer les informations Édumalin.'),
    ).toBeInTheDocument();
  });
});
