import { render, screen, waitFor, within } from '~/setup';
import { UsefulLinksContainer } from './UsefulLinksContainer';

// The MSW mock for /directory/user/link (packages/config/src/msw/mocks/directory.ts)
// seeds 3 links (Lumni, Ministère de l'Éducation Nationale, ONISEP) in an
// in-memory store shared across tests in this file. Each test below claims a
// distinct seed item to mutate/delete so tests stay order-independent.

const openManageModal = async (user: ReturnType<typeof render>['user']) => {
  const editButton = await screen.findByTestId('home-card-header-action');
  await user.click(editButton);
  return screen.findByRole('dialog', { name: 'Gérer les liens utiles' });
};

describe('UsefulLinksContainer', () => {
  it("affiche les liens existants de l'utilisateur", async () => {
    render(<UsefulLinksContainer />);

    expect(await screen.findByText('Lumni')).toBeInTheDocument();
  });

  it('ajoute un nouveau lien de bout en bout', async () => {
    const { user } = render(<UsefulLinksContainer />);

    const manageModal = await openManageModal(user);
    await user.click(
      within(manageModal).getByRole('button', { name: 'Ajouter un lien' }),
    );

    await screen.findByRole('dialog', {
      name: 'Ajouter un lien',
    });
    await user.type(screen.getByLabelText(/^Nom/), 'Nouveau lien E2E');
    const urlInput = screen.getByLabelText(/^Lien/);
    await user.clear(urlInput);
    await user.type(urlInput, 'https://nouveau-lien.example.com');

    const save = screen.getByText('Enregistrer').closest('button')!;
    await waitFor(() => expect(save).not.toBeDisabled());
    await user.click(save);

    const reopenedManageModal = await screen.findByRole('dialog', {
      name: 'Gérer les liens utiles',
    });
    expect(
      within(reopenedManageModal).getByText('Nouveau lien E2E'),
    ).toBeInTheDocument();

    await user.click(within(reopenedManageModal).getByLabelText('Close'));
    expect(await screen.findByText('Nouveau lien E2E')).toBeInTheDocument();
  });

  it('modifie un lien existant', async () => {
    const { user } = render(<UsefulLinksContainer />);

    const manageModal = await openManageModal(user);
    await user.click(within(manageModal).getByLabelText('Modifier ONISEP'));

    await screen.findByRole('dialog', {
      name: 'Modifier un lien',
    });
    const nameInput = screen.getByLabelText(/^Nom/);
    await user.clear(nameInput);
    await user.type(nameInput, 'ONISEP modifié');

    const save = screen.getByText('Enregistrer').closest('button')!;
    await waitFor(() => expect(save).not.toBeDisabled());
    await user.click(save);

    const reopenedManageModal = await screen.findByRole('dialog', {
      name: 'Gérer les liens utiles',
    });
    expect(
      within(reopenedManageModal).getByText('ONISEP modifié'),
    ).toBeInTheDocument();
  });

  it('supprime un lien immédiatement, sans confirmation', async () => {
    const { user } = render(<UsefulLinksContainer />);

    const manageModal = await openManageModal(user);
    const targetName = "Ministère de l'Éducation Nationale";
    expect(within(manageModal).getByText(targetName)).toBeInTheDocument();

    await user.click(
      within(manageModal).getByLabelText(`Supprimer ${targetName}`),
    );

    expect(within(manageModal).queryByText(targetName)).not.toBeInTheDocument();
  });

  it("annule le formulaire d'ajout sans enregistrer, retour à la modale de gestion", async () => {
    const { user } = render(<UsefulLinksContainer />);

    const manageModal = await openManageModal(user);
    await user.click(
      within(manageModal).getByRole('button', { name: 'Ajouter un lien' }),
    );

    await screen.findByRole('dialog', {
      name: 'Ajouter un lien',
    });
    await user.click(screen.getByText('Annuler'));

    expect(
      await screen.findByRole('dialog', { name: 'Gérer les liens utiles' }),
    ).toBeInTheDocument();
  });
});
