import { Meta, StoryObj } from '@storybook/react-vite';

import { ButtonBeta } from '../../../../components';
import useToggle from '../../../../hooks/useToggle/useToggle';
import { RssFeedsModal } from './RssFeedsModal';
import { RssFeed } from './types';

const meta: Meta<typeof RssFeedsModal> = {
  title: 'Modules/Homepage/Rss/Modal',
  component: RssFeedsModal,
  args: {
    onClose: () => {},
    onAddClick: () => alert('Ajouter un flux RSS'),
    onEditFeed: (index: number) => alert(`Modifier le flux ${index}`),
    onDeleteFeed: (index: number) => alert(`Supprimer le flux ${index}`),
  },
  parameters: {
    docs: {
      description: {
        component:
          '« Gérer les flux RSS » : modale de gestion (tableau Nom/Adresse/Actions), avec la limite de 10 flux et un état vide dédié.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof RssFeedsModal>;

const mockFeeds: RssFeed[] = [
  {
    title: 'Nom du lien qui peut faire 80 caractères max',
    link: 'https://adresse-url.io',
  },
  { title: 'Le Monde', link: 'https://www.lemonde.fr/rss/une.xml' },
  {
    title: 'Le Parisien - Vie étudiante',
    link: 'https://feeds.leparisien.fr/leparisien/rubriques/etudiant',
  },
  { title: 'Eduscol', link: 'https://eduscol.education.fr/rss.xml' },
];

const fullFeeds: RssFeed[] = Array.from({ length: 10 }, (_, i) => ({
  title: `Flux ${i + 1}`,
  link: `https://example.com/${i + 1}/rss.xml`,
}));

// Closed by default: safe to embed in the auto-generated Docs page (an
// always-open ModalBeta locks page scroll, see the stories below).
export const Interactive: Story = {
  args: {
    feeds: mockFeeds,
    canAddFeed: true,
  },
  render: (args) => {
    const [isOpen, toggle] = useToggle(false);

    return (
      <>
        <ButtonBeta type="button" onClick={() => toggle(true)}>
          Ouvrir la modale
        </ButtonBeta>
        <RssFeedsModal
          {...args}
          isOpen={isOpen}
          onClose={() => toggle(false)}
        />
      </>
    );
  },
};

// The stories below render the modal open, for Chromatic coverage. They are
// excluded from the Docs page: several always-open ModalBeta instances would
// make it unscrollable.

export const WithFeeds: Story = {
  args: {
    isOpen: true,
    feeds: mockFeeds,
    canAddFeed: true,
  },
  parameters: {
    docs: { disable: true },
  },
};

export const Empty: Story = {
  args: {
    isOpen: true,
    feeds: [],
    canAddFeed: true,
  },
  parameters: {
    docs: { disable: true },
  },
};

export const LimitReached: Story = {
  args: {
    isOpen: true,
    feeds: fullFeeds,
    canAddFeed: false,
  },
  parameters: {
    docs: {
      disable: true,
      description: {
        story:
          'Limite de 10 flux atteinte : le bouton « Ajouter un flux RSS » est désactivé.',
      },
    },
  },
};
