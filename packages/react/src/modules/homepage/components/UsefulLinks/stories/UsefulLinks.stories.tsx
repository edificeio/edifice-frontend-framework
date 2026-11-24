import { UsefulLink } from '@edifice.io/client';
import { Meta, StoryObj } from '@storybook/react-vite';

import { UsefulLinks } from '../UsefulLinks';

const meta: Meta<typeof UsefulLinks> = {
  title: 'Modules/Homepage/UsefulLinks/Widget',
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

export const Skeleton: Story = {
  args: { ...WithLinks.args, isLoading: true },
};

export const SkeletonAboveTheLoadedCard: Story = {
  args: WithLinks.args,
  render: (args) => (
    <div className="skeleton-overlay-stack">
      <UsefulLinks {...args} isLoading />
      <UsefulLinks {...args} />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'The skeleton card shown while the widget loads, stacked on top of the loaded card. Its content block is sized to this loaded card, so any difference in height is the layout shift the user would see.',
      },
    },
  },
};

export const SkeletonSuperimposedOnTheLoadedCard: Story = {
  args: WithLinks.args,
  render: (args) => (
    <div className="skeleton-overlay">
      <UsefulLinks {...args} />
      <div className="skeleton-overlay-top">
        <UsefulLinks {...args} isLoading />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'The skeleton card superimposed on the loaded card, at partial opacity. The header and the content block should cover the loaded header and content exactly.',
      },
    },
  },
};
