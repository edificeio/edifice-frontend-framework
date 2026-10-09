import { Meta, StoryObj } from '@storybook/react-vite';
import { http, HttpResponse } from 'msw';

import { AgendaContainer } from '../AgendaContainer';

const meta: Meta<typeof AgendaContainer> = {
  title: 'Modules/Homepage/Agenda/Container',
  component: AgendaContainer,
  decorators: [
    (Story) => <div style={{ maxWidth: 400, width: '100%' }}>{Story()}</div>,
  ],
  parameters: {
    docs: {
      description: {
        component:
          'AgendaContainer connecte le widget « Agenda » aux endpoints du module Agenda (mockés ici via MSW).',
      },
    },
    chromatic: { disableSnapshot: true },
  },
};

export default meta;
type Story = StoryObj<typeof AgendaContainer>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: 'État vide — utilise le mock global (aucun événement à venir).',
      },
    },
  },
};

export const WithEvents: Story = {
  parameters: {
    msw: {
      handlers: {
        calendar: [
          http.get('/calendar/calendars', () => {
            return HttpResponse.json([
              {
                _id: 'calendar-1',
                title: 'Mon agenda',
                color: 'cyan',
                isExternal: false,
              },
            ]);
          }),
          http.get('/calendar/events/widget', () => {
            const inHours = (hours: number) =>
              new Date(Date.now() + hours * 60 * 60 * 1000).toISOString();
            return HttpResponse.json([
              {
                _id: 'event-1',
                title: 'Rendez vous parents Eric Dupuis',
                allday: false,
                startMoment: inHours(2),
                endMoment: inHours(3),
                calendar: ['calendar-1'],
              },
              {
                _id: 'event-2',
                title: 'Rendez-vous avec Mme Fricot pour le point de suivi',
                allday: false,
                startMoment: inHours(5),
                endMoment: inHours(6.5),
                calendar: ['calendar-1'],
              },
            ]);
          }),
        ],
      },
    },
  },
};
