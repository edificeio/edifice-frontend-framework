import { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { UserSearch } from './UserSearch';
import type { Visible } from './types/visible';
import { VisibleType } from './types/visible';

const mockVisibles: Visible[] = [
  {
    id: 'user-1',
    displayName: 'Marie Dupont',
    type: VisibleType.User,
    profile: '/profile/marie',
  },
  {
    id: 'user-2',
    displayName: 'Jean Martin',
    type: VisibleType.User,
    profile: '/profile/jean',
  },
  {
    id: 'group-1',
    displayName: 'Classe 3ème A',
    type: VisibleType.Group,
  },
];

const mockBookmarks: Visible[] = [
  {
    id: 'bookmark-1',
    displayName: 'Favori Mathématiques',
    type: VisibleType.ShareBookmark,
  },
];

const getSearchResults = (searchInputValue: string) => {
  return new Promise<{ results: Visible[] }>((resolve) => {
    setTimeout(() => {
      const query = searchInputValue.toLowerCase().trim();
      const results = query
        ? mockVisibles.filter((item) =>
            item.displayName.toLowerCase().includes(query),
          )
        : [];
      resolve({ results });
    }, 300);
  });
};

const meta: Meta<typeof UserSearch> = {
  title: 'Components/UserSearch',
  component: UserSearch,
  decorators: [
    (Story) => (
      <div style={{ width: '320px', minHeight: '250px' }}>{Story()}</div>
    ),
  ],
  args: {
    placeholder: 'Rechercher un utilisateur',
    bookmarks: mockBookmarks,
    initialSharings: [],
    getSearchResults,
    onSearchResultsChange: fn(),
  },
  parameters: {
    docs: {
      description: {
        component:
          "Recherche d'utilisateurs, groupes ou favoris avec debounce. Saisissez quelques caractères pour afficher les résultats.",
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof UserSearch>;

export const Default: Story = {};

export const SlowSearch: Story = {
  args: {
    getSearchResults: (searchInputValue: string) =>
      new Promise<{ results: Visible[] }>((resolve) => {
        setTimeout(() => {
          const query = searchInputValue.toLowerCase().trim();
          const results = query
            ? mockVisibles.filter((item) =>
                item.displayName.toLowerCase().includes(query),
              )
            : [];
          resolve({ results });
        }, 2000);
      }),
  },
  parameters: {
    docs: {
      description: {
        story:
          "Recherche avec délai volontairement long pour voir l'état de chargement (géré en interne pendant l'appel à getSearchResults).",
      },
    },
  },
};

export const AdmlcOrAdmc: Story = {
  args: {
    isAdmlcOrAdmc: true,
    placeholder: 'Rechercher (min. 3 caractères)',
  },
};

export const WithInitialSharings: Story = {
  args: {
    initialSharings: [
      {
        recipientId: 'user-1',
        recipientType: 'user',
        permission: ['read'],
        displayName: 'Marie Dupont',
      },
    ],
  },
  parameters: {
    docs: {
      description: {
        story:
          "Les éléments déjà partagés (ex. Marie Dupont) n'apparaissent pas dans les résultats de recherche.",
      },
    },
  },
};
