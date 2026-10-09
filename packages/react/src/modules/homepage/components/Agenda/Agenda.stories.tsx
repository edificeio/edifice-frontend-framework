import { CalendarEvent } from '@edifice.io/client';
import { Meta, StoryObj } from '@storybook/react-vite';

import { Agenda } from './Agenda';

const meta: Meta<typeof Agenda> = {
  title: 'Modules/Homepage/Agenda',
  component: Agenda,
  decorators: [
    (Story) => <div style={{ maxWidth: 400, width: '100%' }}>{Story()}</div>,
  ],
  parameters: {
    docs: {
      description: {
        component:
          "Widget Agenda — affiche les 3 prochains événements de l'utilisateur (à venir ou en cours), groupés par jour. État vide avec illustration si aucun événement à venir.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Agenda>;

const inHours = (hours: number) =>
  new Date(Date.now() + hours * 60 * 60 * 1000).toISOString();
const inDays = (days: number, hour: number) => {
  const date = new Date(Date.now() + days * 24 * 60 * 60 * 1000);
  date.setHours(hour, 0, 0, 0);
  return date.toISOString();
};

const mockEvents: CalendarEvent[] = [
  {
    id: 'event-1',
    calendarId: 'calendar-1',
    title: 'Rendez vous parents Eric Dupuis',
    startMoment: inHours(2),
    endMoment: inHours(3),
    allDay: false,
  },
  {
    id: 'event-2',
    calendarId: 'calendar-1',
    title: 'Rendez-vous avec Mme Fricot pour le point de suivi',
    startMoment: inHours(5),
    endMoment: inHours(6.5),
    allDay: false,
  },
  {
    id: 'event-3',
    calendarId: 'calendar-1',
    title: 'Réunion équipe enseignante des 6ème E',
    startMoment: inDays(3, 9),
    endMoment: inDays(3, 9),
    allDay: true,
  },
];

export const WithEvents: Story = {
  args: {
    events: mockEvents,
    onEventClick: (event) => alert(`Ouvrir l'événement : ${event.title}`),
    onOpenAgendaClick: () => alert("Accéder à l'agenda"),
  },
};

export const Empty: Story = {
  args: {
    events: [],
    onOpenAgendaClick: () => alert("Accéder à l'agenda"),
  },
  parameters: {
    docs: {
      description: {
        story: 'État vide — aucun événement à venir.',
      },
    },
  },
};
