import { UsefulLink } from '@edifice.io/client';
import { Meta, StoryObj } from '@storybook/react-vite';

import { UsefulLinks } from './UsefulLinks';

const meta: Meta<typeof UsefulLinks> = {
  title: 'Modules/Homepage/UsefulLinks',
  component: UsefulLinks,
  decorators: [
    (Story) => <div style={{ maxWidth: 400, width: '100%' }}>{Story()}</div>,
  ],
  parameters: {
    docs: {
      description: {
        component:
          "Widget « Liens utiles » — affiche la liste personnelle de liens externes de l'utilisateur (max 10) avec un accès à la modale de gestion. Variante `secondary` de `HomeCard`.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof UsefulLinks>;

const mockLinks: UsefulLink[] = [
  { id: '1', name: 'Lumni', url: 'https://www.lumni.fr' },
  {
    id: '2',
    name: "Ministère de l'Éducation Nationale",
    url: 'https://www.education.gouv.fr',
  },
  { id: '3', name: 'ONISEP', url: 'https://www.onisep.fr' },
];

export const WithLinks: Story = {
  args: {
    links: mockLinks,
    onEditClick: () => alert('Éditer les liens utiles'),
  },
};

export const Empty: Story = {
  args: {
    links: [],
    onEditClick: () => alert('Éditer les liens utiles'),
  },
  parameters: {
    docs: {
      description: {
        story: "État vide — aucun lien enregistré par l'utilisateur.",
      },
    },
  },
};
