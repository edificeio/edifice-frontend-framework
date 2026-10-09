// Pin the timezone so the "HH[h]mm" assertions below don't depend on the
// machine running the tests.
process.env.TZ = 'UTC';

import { CalendarEvent } from '@edifice.io/client';
import { fireEvent, render, screen } from '~/setup';
import { AgendaEventCard } from './AgendaEventCard';

const event = (overrides: Partial<CalendarEvent> = {}): CalendarEvent => ({
  id: 'event-1',
  calendarId: 'calendar-1',
  title: 'Rendez vous parents Eric Dupuis',
  startMoment: '2026-09-10T09:00:00.000Z',
  endMoment: '2026-09-10T10:00:00.000Z',
  allDay: false,
  ...overrides,
});

describe('AgendaEventCard', () => {
  it('renders the event title', () => {
    render(<AgendaEventCard event={event()} />);
    expect(
      screen.getByText('Rendez vous parents Eric Dupuis'),
    ).toBeInTheDocument();
  });

  it('renders a start - end time range for a same-day event', () => {
    render(
      <AgendaEventCard
        event={event({
          startMoment: '2026-09-10T09:00:00.000Z',
          endMoment: '2026-09-10T10:30:00.000Z',
        })}
      />,
    );
    expect(screen.getByText('09h00 - 10h30')).toBeInTheDocument();
  });

  it('renders the "all day" label for an all-day event', () => {
    render(<AgendaEventCard event={event({ allDay: true })} />);
    expect(screen.getByText('Journée entière')).toBeInTheDocument();
  });

  it('renders a start time - end weekday/day/time for a multi-day event', () => {
    render(
      <AgendaEventCard
        event={event({
          startMoment: '2026-09-10T14:00:00.000Z',
          endMoment: '2026-09-11T15:30:00.000Z',
        })}
      />,
    );
    expect(screen.getByText('14h00 - Ven. 11 à 15h30')).toBeInTheDocument();
  });

  it('calls onClick when the card is clicked', () => {
    const onClick = vi.fn();
    render(<AgendaEventCard event={event()} onClick={onClick} />);

    fireEvent.click(screen.getByTestId('agenda-event-card'));

    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
