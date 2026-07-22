import { userInfo } from '@edifice.io/config';
import { USER_AVATAR } from '@edifice.io/config/src/msw/mocks/auth';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { http, HttpResponse } from 'msw';
import { default as UserSpace } from './UserSpace';

const PROFILES = [
  'Teacher',
  'Student',
  'Relative',
  'Personnel',
  'Invite',
] as const;

const RELATIVE_CHILDREN = {
  '24827863-82d6-4812-944f-13608b07a811': {
    lastName: 'WEASLEY',
    firstName: 'Ronald',
  },
  '55f8fa0e-b690-4feb-85bb-1f6a84dfd6c7': {
    lastName: 'WEASLEY',
    firstName: 'Ginny',
  },
};

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
    profile: 'Teacher',
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
    msw: {
      // Keyed object form so Storybook deep-merges with the global handlers
      // instead of replacing them (only the "auth" handler is overridden).
      handlers: {
        auth: [
          http.get('/auth/oauth2/userinfo', () =>
            HttpResponse.json({
              ...userInfo,
              children: RELATIVE_CHILDREN,
              childrenIds: Object.keys(RELATIVE_CHILDREN),
            }),
          ),
        ],
      },
    },
  },
};
