import { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { useRef, useState } from 'react';
import { UserSearch, type UserSearchRef } from './UserSearch';
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

export const WithRemoveSharing: Story = {
  render: (args) => {
    const ref = useRef<UserSearchRef>(null);
    const [removed, setRemoved] = useState<string[]>([]);
    return (
      <div>
        <div
          style={{
            marginBottom: '8px',
            display: 'flex',
            gap: '8px',
            flexWrap: 'wrap',
          }}
        >
          {[
            { recipientId: 'user-1', displayName: 'Marie Dupont' },
            { recipientId: 'user-2', displayName: 'Jean Martin' },
          ].map(
            (item) =>
              !removed.includes(item.recipientId) && (
                <button
                  key={item.recipientId}
                  type="button"
                  onClick={() => {
                    ref.current?.removeSharing(item.recipientId);
                    setRemoved((prev) => [...prev, item.recipientId]);
                  }}
                  style={{
                    padding: '4px 8px',
                    borderRadius: '4px',
                    border: '1px solid #ccc',
                  }}
                >
                  {item.displayName} ×
                </button>
              ),
          )}
        </div>
        <UserSearch
          {...args}
          ref={ref}
          initialSharings={args.initialSharings}
        />
      </div>
    );
  },
  args: {
    initialSharings: [
      {
        recipientId: 'user-1',
        recipientType: 'user',
        permission: ['read'],
        displayName: 'Marie Dupont',
      },
      {
        recipientId: 'user-2',
        recipientType: 'user',
        permission: ['read'],
        displayName: 'Jean Martin',
      },
    ],
  },
  parameters: {
    docs: {
      description: {
        story:
          "Cliquez sur un chip pour retirer un partage. L'élément réapparaîtra dans les résultats de recherche.",
      },
    },
  },
};
