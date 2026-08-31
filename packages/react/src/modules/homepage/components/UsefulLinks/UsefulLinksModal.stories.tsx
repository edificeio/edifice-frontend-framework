import { UsefulLink } from '@edifice.io/client';
import { Meta, StoryObj } from '@storybook/react-vite';

import { UsefulLinksModal } from './UsefulLinksModal';

const meta: Meta<typeof UsefulLinksModal> = {
  title: 'Modules/Homepage/UsefulLinksModal',
  component: UsefulLinksModal,
  args: {
    isOpen: true,
    onClose: () => {},
    onAddClick: () => alert('Ajouter un lien'),
    onEditLink: (link: UsefulLink) => alert(`Modifier ${link.name}`),
    onDeleteLink: (id: string) => alert(`Supprimer ${id}`),
  },
  parameters: {
    // ModalBeta locks page scroll while open. All the stories in this file
    // render it open by default for full Chromatic coverage — embedding
    // several of them together in an auto-generated Docs page would make
    // that page itself unscrollable, so the whole Docs page is disabled
    // here. Visit each story individually via the sidebar.
    docs: { disable: true },
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

export const WithLinks: Story = {
  args: {
    links: mockLinks,
    canAddLink: true,
  },
};

export const Empty: Story = {
  args: {
    links: [],
    canAddLink: true,
  },
  parameters: {
    docs: {
      description: {
        story: "État vide — aucun lien enregistré par l'utilisateur.",
      },
    },
  },
};

export const LimitReached: Story = {
  args: {
    links: fullLinks,
    canAddLink: false,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Limite de 10 liens atteinte — le bouton "Ajouter un lien" est désactivé.',
      },
    },
  },
};
