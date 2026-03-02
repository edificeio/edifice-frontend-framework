import { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import type { ComponentRef } from 'react';
import { useRef } from 'react';
import { UserRightsList } from './UserRightsList';
import type { ResourceRights, SharingItem } from './types/types';

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
    requires: ['contrib'],
    excludes: [],
  },
  manager: {
    priority: 4,
    default: false,
    requires: ['publish'],
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

const meta: Meta<typeof UserRightsList> = {
  title: 'Components/UserRightsList',
  component: UserRightsList,
  decorators: [(Story) => <div style={{ minHeight: '200px' }}>{Story()}</div>],
  args: {
    resourceRights: mockResourceRights,
    isReadOnly: false,
    isLoading: false,
    ownerId: '91c22b66-ba1b-4fde-a3fe-95219cc18d4a', // packages/config/src/msw/mocks/directory.ts
    isCreating: true,
    initialSharings: mockInitialSharings,
    onChange: fn(),
    onAddItem: fn(),
    onDeleteItem: fn(),
    onSaveBookmark: fn(),
  },
};

export default meta;

type Story = StoryObj<typeof UserRightsList>;

export const Default: Story = {};

export const ReadOnly: Story = {
  args: {
    isReadOnly: true,
  },
};

export const Loading: Story = {
  args: {
    isLoading: true,
  },
};

export const Empty: Story = {
  args: {
    initialSharings: [],
  },
};

export const WithoutSaveBookmark: Story = {
  args: {
    onSaveBookmark: undefined,
  },
};

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
