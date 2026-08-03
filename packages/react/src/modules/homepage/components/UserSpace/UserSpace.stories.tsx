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
