// Pin the timezone so events grouped by day below don't depend on the
// machine running the tests.
process.env.TZ = 'UTC';

import { CalendarEvent } from '@edifice.io/client';
import { fireEvent, render, screen } from '~/setup';
import { Agenda } from './Agenda';

const event = (overrides: Partial<CalendarEvent> = {}): CalendarEvent => ({
  id: 'event-1',
  calendarId: 'calendar-1',
  title: 'Réunion',
  startMoment: '2026-09-10T09:00:00.000Z',
  endMoment: '2026-09-10T10:00:00.000Z',
  allDay: false,
  ...overrides,
});

describe('Agenda', () => {
  it('renders the empty state when there is no event', () => {
    render(<Agenda events={[]} />);

    expect(screen.getByText('Pas d’évènement à venir.')).toBeInTheDocument();
    expect(screen.queryByTestId('agenda-day-group')).not.toBeInTheDocument();
  });

  it('renders one day group per distinct day', () => {
    render(
      <Agenda
        events={[
          event({ id: 'e1', startMoment: '2026-09-10T09:00:00.000Z' }),
          event({ id: 'e2', startMoment: '2026-09-10T14:00:00.000Z' }),
          event({ id: 'e3', startMoment: '2026-09-16T09:00:00.000Z' }),
        ]}
      />,
    );

    const groups = screen.getAllByTestId('agenda-day-group');
    expect(groups).toHaveLength(2);
    expect(screen.getAllByTestId('agenda-event-card')).toHaveLength(3);
  });

  it('calls onEventClick when an event card is clicked', () => {
    const onEventClick = vi.fn();
    render(
      <Agenda events={[event({ id: 'e1' })]} onEventClick={onEventClick} />,
    );

    fireEvent.click(screen.getByTestId('agenda-event-card'));

    expect(onEventClick).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'e1' }),
    );
  });

  it('calls onOpenAgendaClick when the header button is clicked', () => {
    const onOpenAgendaClick = vi.fn();
    render(<Agenda events={[]} onOpenAgendaClick={onOpenAgendaClick} />);

    fireEvent.click(screen.getByTestId('agenda-button-open'));

    expect(onOpenAgendaClick).toHaveBeenCalledTimes(1);
  });
});
