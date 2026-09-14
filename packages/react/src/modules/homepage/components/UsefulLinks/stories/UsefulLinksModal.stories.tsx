import { UsefulLink } from '@edifice.io/client';
import { Meta, StoryObj } from '@storybook/react-vite';

import { ButtonBeta } from '../../../../../components';
import useToggle from '../../../../../hooks/useToggle/useToggle';
import { UsefulLinksModal } from '../UsefulLinksModal';

const meta: Meta<typeof UsefulLinksModal> = {
  title: 'Modules/Homepage/UsefulLinks/Modal',
  component: UsefulLinksModal,
  args: {
    onClose: () => {},
    onAddClick: () => alert('Ajouter un lien'),
    onEditLink: (link: UsefulLink) => alert(`Modifier ${link.name}`),
    onDeleteLink: (id: string) => alert(`Supprimer ${id}`),
  },
  parameters: {
    docs: {
      description: {
        component:
          '« Gérer les liens utiles » — modale de gestion (tableau Nom/Adresse/Actions), avec la limite de 10 liens et un état vide dédié.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof UsefulLinksModal>;

const mockLinks: UsefulLink[] = [
  { id: '1', name: 'Lumni', url: 'https://www.lumni.fr' },
  {
    id: '2',
    name: "Ministère de l'Éducation Nationale",
    url: 'https://www.education.gouv.fr',
  },
  { id: '3', name: 'ONISEP', url: 'https://www.onisep.fr' },
];

const fullLinks: UsefulLink[] = Array.from({ length: 10 }, (_, i) => ({
  id: `${i}`,
  name: `Lien ${i + 1}`,
  url: `https://example.com/${i + 1}`,
}));

// Closed by default: safe to embed in the auto-generated Docs page (an
// always-open ModalBeta locks page scroll — see the sized stories below).
export const Interactive: Story = {
  args: {
    links: mockLinks,
    canAddLink: true,
  },
  render: (args) => {
    const [isOpen, toggle] = useToggle(false);

    return (
      <>
        <ButtonBeta type="button" onClick={() => toggle(true)}>
          Ouvrir la modale
        </ButtonBeta>
        <UsefulLinksModal
          {...args}
          isOpen={isOpen}
          onClose={() => toggle(false)}
        />
      </>
    );
  },
};

// The stories below render the modal open by default, for full Chromatic
// coverage. They are excluded from the Docs page (`docs.disable`): several
// always-open ModalBeta instances embedded together would make that page
// itself unscrollable (ModalBeta locks page scroll while open). Visit them
// individually via the sidebar.

export const WithLinks: Story = {
  args: {
    isOpen: true,
    links: mockLinks,
    canAddLink: true,
  },
  parameters: {
    docs: { disable: true },
  },
};

export const Empty: Story = {
  args: {
    isOpen: true,
    links: [],
    canAddLink: true,
  },
  parameters: {
    docs: {
      disable: true,
      description: {
        story: "État vide — aucun lien enregistré par l'utilisateur.",
      },
    },
  },
};

export const LimitReached: Story = {
  args: {
    isOpen: true,
    links: fullLinks,
    canAddLink: false,
  },
  parameters: {
    docs: {
      disable: true,
      description: {
        story:
          'Limite de 10 liens atteinte — le bouton "Ajouter un lien" est désactivé.',
      },
    },
  },
};
