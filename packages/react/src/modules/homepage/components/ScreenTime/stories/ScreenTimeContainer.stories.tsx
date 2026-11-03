import {
  authHandlers,
  mockScreenTimeKidIds,
  userInfo,
} from '@edifice.io/config';
import { Meta, StoryObj } from '@storybook/react-vite';
import { http, HttpResponse } from 'msw';

import { ScreenTimeContainer } from '../ScreenTimeContainer';

const meta: Meta<typeof ScreenTimeContainer> = {
  title: 'Modules/Homepage/ScreenTime/Container',
  component: ScreenTimeContainer,
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 397 }}>
        <div id="portal" />
        <Story />
      </div>
    ),
  ],
  parameters: {
    docs: {
      description: {
        component:
          "ScreenTimeContainer connecte le widget « Temps d'écran » à l'API appregistry (mockée ici via MSW). Ouvrez le plein écran pour naviguer entre les semaines et les jours.",
      },
    },
    // Interaction demo: the Widget/Modal stories already cover the visual
    // states.
    chromatic: { disableSnapshot: true },
  },
};

export default meta;
type Story = StoryObj<typeof ScreenTimeContainer>;

export const Default: Story = {};

export const WithKids: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Parent de trois enfants : le troisième (Marc) n'a aucune donnée de temps d'écran.",
      },
    },
    msw: {
      handlers: {
        auth: [
          http.get('/auth/oauth2/userinfo', () =>
            HttpResponse.json({
              ...userInfo,
              children: {
                'alice-id': { firstName: 'Alice', lastName: 'Lindo' },
                'ines-id': { firstName: 'Inès', lastName: 'Lindo' },
                [mockScreenTimeKidIds.empty]: {
                  firstName: 'Marc',
                  lastName: 'Lindo',
                },
              },
            }),
          ),
          ...authHandlers,
        ],
      },
    },
  },
};
