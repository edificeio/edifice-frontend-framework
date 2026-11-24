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

export const Skeleton: Story = {
  args: { ...WithEvents.args, isLoading: true },
};

export const SkeletonAboveTheLoadedCard: Story = {
  args: WithEvents.args,
  render: (args) => (
    <div className="skeleton-overlay-stack">
      <Agenda {...args} isLoading />
      <Agenda {...args} />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'The skeleton card shown while the widget loads, stacked on top of the loaded card. Its content block is sized to this loaded card, so any difference in height is the layout shift the user would see.',
      },
    },
  },
};

export const SkeletonSuperimposedOnTheLoadedCard: Story = {
  args: WithEvents.args,
  render: (args) => (
    <div className="skeleton-overlay">
      <Agenda {...args} />
      <div className="skeleton-overlay-top">
        <Agenda {...args} isLoading />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'The skeleton card superimposed on the loaded card, at partial opacity. The header and the content block should cover the loaded header and content exactly.',
      },
    },
  },
};
