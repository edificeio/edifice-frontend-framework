import { USER_AVATAR } from '@edifice.io/config/src/msw/mocks/auth';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { default as UserSpace } from './UserSpace';

const PROFILES = [
  'Teacher',
  'Student',
  'Relative',
  'Personnel',
  'Invite',
] as const;

const meta: Meta<typeof UserSpace> = {
  title: 'Modules/Homepage/UserSpace',
  component: UserSpace,
  argTypes: {
    profile: {
      control: { type: 'select' },
      options: PROFILES,
      description:
        'Profil de l’utilisateur connecté (Guest exclu : aucun lien n’est affiché pour ce profil).',
    },
  },
  decorators: [
    (Story) => (
      <div style={{ height: '35em' }}>
        <div id="portal" />
        <Story />
      </div>
    ),
  ],
  parameters: {
    docs: {
      description: {
        component:
          "Ce storybook documente le composant UserSpace, un widget personnalisable pour l'utilisateur connecté.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof UserSpace>;

export const DefaultUserSpace: Story = {
  args: {
    name: 'Marc',
    profile: 'Relative',
    avatar: USER_AVATAR,
  },
  render: (args) => (
    <UserSpace {...args}>On peut insérer ici d'autres widgets.</UserSpace>
  ),
  parameters: {
    docs: {
      description: {
        story: `Affiche l'avatar de l'utilisateur connecté, et son profil. D'autres widgets peuvent être incorporés`,
      },
    },
  },
};

export const WithCustomizeWidgetsButton: Story = {
  args: {
    name: 'NOMTRESLONGARALLONGE Jean-François',
    profile: 'Teacher',
    avatar: USER_AVATAR,
    onCustomizeWidgetsClick: () => alert('Ouvre le volet de personnalisation'),
  },
  render: (args) => (
    <UserSpace {...args}>On peut insérer ici d'autres widgets.</UserSpace>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Quand `onCustomizeWidgetsClick` est fourni, un bouton apparaît en haut à droite pour ouvrir le volet de personnalisation des widgets.',
      },
    },
  },
};

const loadingArgs = {
  name: '',
  profile: 'Student',
  avatar: '',
  isLoading: true,
  onCustomizeWidgetsClick: () => {},
} as const;

const loadedArgs = {
  ...loadingArgs,
  name: 'Marc Dupont',
  avatar: USER_AVATAR,
  isLoading: false,
};

export const Loading: Story = {
  args: loadingArgs,
  render: (args) => (
    <UserSpace {...args}>On peut insérer ici d'autres widgets.</UserSpace>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "État de chargement : l'avatar, le nom, le profil, le bouton de personnalisation et les liens du profil sont remplacés par des skeletons. Les widgets enfants gèrent leur propre état de chargement.",
      },
    },
  },
};

export const SkeletonAboveTheLoadedList: Story = {
  render: () => (
    <div className="skeleton-overlay-stack">
      <UserSpace {...loadingArgs}>
        On peut insérer ici d'autres widgets.
      </UserSpace>
      <UserSpace {...loadedArgs}>
        On peut insérer ici d'autres widgets.
      </UserSpace>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'The loading state stacked on top of the loaded card. Any difference in height between the two is the layout shift the user would see when the user arrives.',
      },
    },
  },
};

export const SkeletonSuperimposedOnTheLoadedList: Story = {
  render: () => (
    <div className="skeleton-overlay">
      <UserSpace {...loadedArgs}>
        On peut insérer ici d'autres widgets.
      </UserSpace>
      <div className="skeleton-overlay-top">
        <UserSpace {...loadingArgs}>
          On peut insérer ici d'autres widgets.
        </UserSpace>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'The loading state superimposed on the loaded card, at partial opacity. Each grey block should sit over the content it replaces; the name, profile and link widths are representative.',
      },
    },
  },
};
