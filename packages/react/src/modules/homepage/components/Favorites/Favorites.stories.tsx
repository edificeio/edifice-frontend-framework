import { Meta, StoryObj } from '@storybook/react-vite';

import hillsBackground from '@edifice.io/bootstrap/dist/images/backgrounds/hills.svg';
import { Favorites, FavoritesProps } from './Favorites';

const meta: Meta<typeof Favorites> = {
  title: 'Modules/Homepage/Favorites',
  component: Favorites,
  decorators: [
    (Story) => (
      <div
        style={{
          minHeight: '100vh',
          padding: '4rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundImage: `url(${hillsBackground})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <div style={{ maxWidth: 400, width: '100%' }}>
          <Story />
        </div>
      </div>
    ),
  ],
  parameters: {
    docs: {
      description: {
        component:
          "Widget Favoris — affiche jusqu'à 2 lignes d'applications favorites de l'utilisateur. Variante `secondary` de `HomeCard`. Affiche un état vide avec illustration si aucune application n'est marquée en favori.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Favorites>;

const mockApps: FavoritesProps['apps'] = [
  {
    address: '/blog',
    icon: 'blog',
    name: 'blog',
    scope: [],
    display: true,
    displayName: 'Blog',
    isExternal: false,
  },
  {
    address: '/wiki',
    icon: 'wiki',
    name: 'wiki',
    scope: [],
    display: true,
    displayName: 'Wiki',
    isExternal: false,
  },
  {
    address: '/conversation',
    icon: 'conversation',
    name: 'conversation',
    scope: [],
    display: true,
    displayName: 'Messagerie',
    isExternal: false,
  },
  {
    address: '/workspace',
    icon: 'workspace',
    name: 'workspace',
    scope: [],
    display: true,
    displayName: 'Espace documentaire',
    isExternal: false,
  },
  {
    address: '/rack',
    icon: 'rack',
    name: 'rack',
    scope: [],
    display: true,
    displayName: 'Casier',
    isExternal: false,
  },
  {
    address: '/scrapbook',
    icon: 'scrapbook',
    name: 'scrapbook',
    scope: [],
    display: true,
    displayName: 'Cahier multimédia',
    isExternal: false,
  },

  {
    address: '/workspace',
    icon: 'workspace',
    name: 'workspace',
    scope: [],
    display: true,
    displayName: 'Espace documentaire',
    isExternal: false,
  },
  {
    address: '/rack',
    icon: 'rack',
    name: 'rack',
    scope: [],
    display: true,
    displayName: 'Casier',
    isExternal: false,
  },
  {
    address: '/scrapbook',
    icon: 'scrapbook',
    name: 'scrapbook',
    scope: [],
    display: true,
    displayName: 'Cahier multimédia',
    isExternal: false,
  },
];

export const WithApps: Story = {
  args: {
    apps: mockApps,
    onSeeAllClick: () => alert('Voir toutes mes applis'),
  },
  parameters: {
    docs: {
      description: {
        story: 'Affichage avec 6 applications favorites.',
      },
    },
  },
};

export const Empty: Story = {
  args: {
    apps: [],
    onSeeAllClick: () => alert('Voir toutes mes applis'),
  },
  parameters: {
    docs: {
      description: {
        story: 'État vide — aucune application en favori.',
      },
    },
  },
};

export const Partial: Story = {
  args: {
    apps: mockApps.slice(0, 3),
    onSeeAllClick: () => alert('Voir toutes mes applis'),
  },
  parameters: {
    docs: {
      description: {
        story: 'Affichage partiel avec 3 applications favorites.',
      },
    },
  },
};

export const Loading: Story = {
  args: {
    apps: [],
    isLoading: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          "État de chargement : l'en-tête et les applications sont remplacés par des skeletons.",
      },
    },
  },
};

const loadedApps = mockApps.slice(0, 6);

export const SkeletonAboveTheLoadedList: Story = {
  render: () => (
    <div className="skeleton-overlay-stack">
      <Favorites apps={[]} isLoading />
      <Favorites apps={loadedApps} />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'The loading state stacked on top of the loaded card. Any difference in height between the two is the layout shift the user would see when the favorites arrive.',
      },
    },
  },
};

export const SkeletonSuperimposedOnTheLoadedList: Story = {
  render: () => (
    <div className="skeleton-overlay">
      <Favorites apps={loadedApps} />
      <div className="skeleton-overlay-top">
        <Favorites apps={[]} isLoading />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'The loading state superimposed on the loaded card, at partial opacity. Each grey block should sit over the content it replaces; the title and button widths follow translated text and are representative.',
      },
    },
  },
};
