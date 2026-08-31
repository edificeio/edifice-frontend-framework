import { UsefulLink } from '@edifice.io/client';
import { render, screen } from '~/setup';
import { UsefulLinksModal } from './UsefulLinksModal';

const links: UsefulLink[] = [
  { id: '1', name: 'Lumni', url: 'https://lumni.fr' },
  { id: '2', name: 'ONISEP', url: 'https://onisep.fr' },
];

describe('UsefulLinksModal', () => {
  it('renders one table row per link', () => {
    render(
      <UsefulLinksModal
        isOpen
        links={links}
        canAddLink
        onClose={vi.fn()}
        onAddClick={vi.fn()}
        onEditLink={vi.fn()}
        onDeleteLink={vi.fn()}
      />,
    );

    expect(screen.getByText('Lumni')).toBeInTheDocument();
    expect(screen.getByText('https://lumni.fr')).toBeInTheDocument();
    expect(screen.getByText('ONISEP')).toBeInTheDocument();
  });

  it('shows the empty state when there are no links', () => {
    render(
      <UsefulLinksModal
        isOpen
        links={[]}
        canAddLink
        onClose={vi.fn()}
        onAddClick={vi.fn()}
        onEditLink={vi.fn()}
        onDeleteLink={vi.fn()}
      />,
    );

    expect(screen.getByText('Pas encore de liens ajoutés')).toBeInTheDocument();
  });

  it('disables the add button when canAddLink is false', () => {
    render(
      <UsefulLinksModal
        isOpen
        links={links}
        canAddLink={false}
        onClose={vi.fn()}
        onAddClick={vi.fn()}
        onEditLink={vi.fn()}
        onDeleteLink={vi.fn()}
      />,
    );

    expect(
      screen.getByText('Ajouter un lien').closest('button'),
    ).toBeDisabled();
  });

  it('calls onDeleteLink immediately when the delete action is clicked', async () => {
    const onDeleteLink = vi.fn();
    const { user } = render(
      <UsefulLinksModal
        isOpen
        links={links}
        canAddLink
        onClose={vi.fn()}
        onAddClick={vi.fn()}
        onEditLink={vi.fn()}
        onDeleteLink={onDeleteLink}
      />,
    );

    await user.click(screen.getByLabelText('Supprimer Lumni'));

    expect(onDeleteLink).toHaveBeenCalledWith('1');
  });

  it('calls onEditLink with the link when the edit action is clicked', async () => {
    const onEditLink = vi.fn();
    const { user } = render(
      <UsefulLinksModal
        isOpen
        links={links}
        canAddLink
        onClose={vi.fn()}
        onAddClick={vi.fn()}
        onEditLink={onEditLink}
        onDeleteLink={vi.fn()}
      />,
    );

    await user.click(screen.getByLabelText('Modifier Lumni'));

    expect(onEditLink).toHaveBeenCalledWith(links[0]);
  });
});
