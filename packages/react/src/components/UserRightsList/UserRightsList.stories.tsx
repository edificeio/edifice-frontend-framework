import { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import type { ComponentRef } from 'react';
import { useEffect, useRef } from 'react';
import { UserRightsList } from './UserRightsList';
import type { BookmarkInput, ResourceRights, SharingItem } from './types/types';

// ---------------------------------------------------------------------------
// Mock data
// ---------------------------------------------------------------------------

const mockResourceRights: ResourceRights = {
  read: { priority: 1, default: true, requires: [], excludes: [] },
  contrib: {
    priority: 2,
    default: false,
    requires: ['read'],
    excludes: [],
  },
  publish: {
    priority: 3,
    default: false,
    requires: ['contrib', 'read'],
    excludes: [],
  },
  manager: {
    priority: 4,
    default: false,
    requires: ['publish', 'contrib', 'read'],
    excludes: [],
  },
  comment: {
    priority: 5,
    default: false,
    requires: ['read'],
    excludes: [],
  },
};

const mockInitialSharings: SharingItem[] = [
  {
    recipientId: 'user-1',
    recipientType: 'user',
    permission: ['read', 'contrib', 'publish'],
    displayName: 'Marie Dupont',
  },
  {
    recipientId: 'user-2',
    recipientType: 'user',
    permission: ['read', 'comment'],
    displayName: 'Jean Martin',
  },
  {
    recipientId: 'group-1',
    recipientType: 'group',
    permission: ['read'],
    displayName: 'Classe 3ème A',
  },
];

const mockBookmark1: BookmarkInput = {
  id: '_9a1d29c3d2864ed8a3d72198fadf4a96',
  name: 'Parents délégués CE2',
  notVisibleCount: 0,
  groups: [],
  users: [
    {
      displayName: 'CARPENTIER Béatrice',
      profile: 'Relative',
      id: 'c0824335-ab0e-41fb-9ed3-d5c28a93087d',
      activationCode: false,
    },
    {
      displayName: 'ROUSTIN Christophe',
      profile: 'Relative',
      id: '6a7495f8-bec7-4f68-b891-0b05c6e8e0ce',
      activationCode: false,
    },
  ],
};

const mockBookmark2: BookmarkInput = {
  id: '_b7e3f1a2c4d5e6f7a8b9c0d1e2f3a4b5',
  name: 'Équipe pédagogique CM1',
  notVisibleCount: 0,
  groups: [],
  users: [
    {
      displayName: 'DURAND Sophie',
      profile: 'Teacher',
      id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
      activationCode: false,
    },
    {
      displayName: 'MOREAU Philippe',
      profile: 'Teacher',
      id: 'f9e8d7c6-b5a4-3210-fedc-ba9876543210',
      activationCode: false,
    },
    {
      displayName: 'LEFEBVRE Claire',
      profile: 'Teacher',
      id: 'd4c3b2a1-0987-6543-210f-edcba9876543',
      activationCode: false,
    },
  ],
};

// ---------------------------------------------------------------------------
// Meta
// ---------------------------------------------------------------------------

const meta: Meta<typeof UserRightsList> = {
  title: 'Components/UserRightsList',
  component: UserRightsList,
  decorators: [(Story) => <div style={{ minHeight: '200px' }}>{Story()}</div>],
  args: {
    resourceRights: mockResourceRights,
    isReadOnly: false,
    isLoading: false,
    ownerId: '91c22b66-ba1b-4fde-a3fe-95219cc18d4a',
    isCreating: true,
    initialSharings: mockInitialSharings,
    onChange: fn(),
    onAddItems: fn(),
    onDeleteItems: fn(),
    onSaveBookmark: fn(),
  },
  parameters: {
    docs: {
      description: {
        component:
          'The UserRightsList component displays a table of sharing permissions for a resource. ' +
          'Each row represents a user, group, or bookmark with checkboxes for each right (read, contrib, publish, manager, comment). ' +
          'Rights support dependencies (requires/excludes) and transitive removal. ' +
          'Items can be added externally via a ref (`addItem`), which accepts either a `SharingItem` (user/group) or a `BookmarkInput` (group of users). ' +
          'Bookmarks appear as collapsible rows at the top of the list; toggling a right on a bookmark applies it to all its users. ' +
          'Parent notifications use batch callbacks (`onAddItems`, `onDeleteItems`) for efficient handling of bulk operations like bookmark insertion/deletion. ' +
          'The component also supports saving the current sharing configuration as a bookmark via `onSaveBookmark`.',
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof UserRightsList>;

// ---------------------------------------------------------------------------
// Stories
// ---------------------------------------------------------------------------

/** Default editable list with pre-populated users and a group. */
export const Default: Story = {};

/** All rows are read-only: checkboxes are disabled and delete buttons are hidden. */
export const ReadOnly: Story = {
  args: {
    isReadOnly: true,
  },
};

/** Displays a loading spinner instead of the table. */
export const Loading: Story = {
  args: {
    isLoading: true,
  },
};

/** Empty list with only the owner row visible. */
export const Empty: Story = {
  args: {
    initialSharings: [],
  },
};

/** Hides the "Save as bookmark" button when onSaveBookmark is not provided. */
export const WithoutSaveBookmark: Story = {
  args: {
    onSaveBookmark: undefined,
  },
};

/** Demonstrates adding a user programmatically via the ref's `addItem` method. */
export const WithRef: Story = {
  render: (args) => {
    const ref = useRef<ComponentRef<typeof UserRightsList>>(null);
    return (
      <div>
        <UserRightsList {...args} ref={ref} />
        <button
          type="button"
          onClick={() => {
            ref.current?.addItem({
              recipientId: 'user-new',
              recipientType: 'user',
              permission: ['read'],
              displayName: 'Nouvel utilisateur',
            });
          }}
          style={{ marginTop: '1rem' }}
        >
          Ajouter via ref
        </button>
      </div>
    );
  },
};

/**
 * Demonstrates bookmark support.
 * A first bookmark is loaded on mount; a second can be added via the button.
 * Bookmarks are collapsible rows whose right toggles apply to all their users.
 */
export const WithBookmark: Story = {
  render: (args) => {
    const ref = useRef<ComponentRef<typeof UserRightsList>>(null);
    useEffect(() => {
      ref.current?.addItem(mockBookmark1);
    }, []);
    return (
      <div>
        <UserRightsList {...args} ref={ref} />
        <button
          type="button"
          onClick={() => {
            ref.current?.addItem(mockBookmark2);
          }}
          style={{ marginTop: '1rem' }}
        >
          Ajouter un bookmark
        </button>
      </div>
    );
  },
};
