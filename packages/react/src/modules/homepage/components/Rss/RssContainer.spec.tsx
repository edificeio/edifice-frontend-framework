import { render, screen, waitFor, within } from '~/setup';
import { RssContainer } from './RssContainer';

// The MSW mock for /rss (packages/config/src/msw/mocks/rss.ts) seeds 6 feeds
// (Le Monde, Le Parisien, Eduscol, Flux invalide, France Info, Le Figaro) in
// an in-memory store shared across tests in this file. Each test below
// claims a distinct feed, found by name, so tests stay order-independent.

const openManageModal = async (user: ReturnType<typeof render>['user']) => {
  await user.click(await screen.findByTestId('rss-button-edit'));
  return screen.findByRole('dialog', { name: 'Gérer les flux RSS' });
};

describe('RssContainer', () => {
  it('affiche au plus 3 articles du premier flux', async () => {
    render(<RssContainer />);

    expect(
      await screen.findByText(
        'Face aux Etats-Unis, l’Iran parie sur une guerre d’usure',
      ),
    ).toBeInTheDocument();
    expect(screen.getAllByTestId(/^rss-link-article-/)).toHaveLength(3);
    expect(
      screen.queryByText('Quatrième article, au-delà de la limite d’affichage'),
    ).not.toBeInTheDocument();
  });

  it("met à jour la liste d'articles quand on change de flux", async () => {
    const { user } = render(<RssContainer />);

    await user.click(
      await screen.findByRole('button', { name: 'Le Parisien' }),
    );

    expect(
      await screen.findByText(
        'Canicule : les conseils pour bien dormir malgré la chaleur',
      ),
    ).toBeInTheDocument();
  });

  it("affiche l'état vide quand le flux n'a pas d'article", async () => {
    const { user } = render(<RssContainer />);

    await user.click(await screen.findByRole('button', { name: 'Eduscol' }));

    expect(
      await screen.findByText('Pas d’articles à afficher'),
    ).toBeInTheDocument();
  });

  it("affiche l'état erreur quand l'URL n'est pas un flux RSS", async () => {
    const { user } = render(<RssContainer />);

    await user.click(
      await screen.findByRole('button', { name: 'Flux invalide' }),
    );

    expect(
      await screen.findByText(/ne semble pas être un flux RSS valide/),
    ).toBeInTheDocument();
  });

  it('ajoute un nouveau flux de bout en bout', async () => {
    const { user } = render(<RssContainer />);

    const manageModal = await openManageModal(user);
    await user.click(within(manageModal).getByTestId('rss-button-add-feed'));

    await screen.findByRole('dialog', { name: 'Ajouter un flux RSS' });
    await user.type(screen.getByTestId('rss-input-title'), 'Nouveau flux E2E');
    await user.type(
      screen.getByTestId('rss-input-link'),
      'https://nouveau-flux.example.com/rss',
    );

    const save = screen.getByTestId('rss-button-save');
    await waitFor(() => expect(save).not.toBeDisabled());
    await user.click(save);

    const reopenedManageModal = await screen.findByRole('dialog', {
      name: 'Gérer les flux RSS',
    });
    expect(
      within(reopenedManageModal).getByText('Nouveau flux E2E'),
    ).toBeInTheDocument();

    await user.click(within(reopenedManageModal).getByLabelText('Close'));
    expect(
      await screen.findByRole('button', { name: 'Nouveau flux E2E' }),
    ).toBeInTheDocument();
  });

  it('modifie un flux existant', async () => {
    const { user } = render(<RssContainer />);

    const manageModal = await openManageModal(user);
    await user.click(
      within(manageModal).getByRole('button', { name: 'Modifier France Info' }),
    );

    await screen.findByRole('dialog', { name: 'Modifier un flux RSS' });
    const titleInput = screen.getByTestId('rss-input-title');
    await user.clear(titleInput);
    await user.type(titleInput, 'France Info modifié');

    const save = screen.getByTestId('rss-button-save');
    await waitFor(() => expect(save).not.toBeDisabled());
    await user.click(save);

    const reopenedManageModal = await screen.findByRole('dialog', {
      name: 'Gérer les flux RSS',
    });
    expect(
      within(reopenedManageModal).getByText('France Info modifié'),
    ).toBeInTheDocument();
  });

  it('supprime un flux immédiatement, sans confirmation', async () => {
    const { user } = render(<RssContainer />);

    const manageModal = await openManageModal(user);
    expect(within(manageModal).getByText('Le Figaro')).toBeInTheDocument();

    await user.click(
      within(manageModal).getByRole('button', { name: 'Supprimer Le Figaro' }),
    );

    expect(
      within(manageModal).queryByText('Le Figaro'),
    ).not.toBeInTheDocument();
  });

  it("annule le formulaire d'ajout et revient à la modale de gestion", async () => {
    const { user } = render(<RssContainer />);

    const manageModal = await openManageModal(user);
    await user.click(within(manageModal).getByTestId('rss-button-add-feed'));

    await screen.findByRole('dialog', { name: 'Ajouter un flux RSS' });
    await user.click(screen.getByTestId('rss-button-cancel'));

    expect(
      await screen.findByRole('dialog', { name: 'Gérer les flux RSS' }),
    ).toBeInTheDocument();
  });
});
