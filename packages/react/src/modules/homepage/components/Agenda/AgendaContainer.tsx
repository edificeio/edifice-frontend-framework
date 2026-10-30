import { CalendarEvent } from '@edifice.io/client';

import { Agenda } from './Agenda';
import { useAgendaContainer } from './hooks/useAgendaContainer';

export function AgendaContainer() {
  const { events } = useAgendaContainer();

  const handleEventClick = (event: CalendarEvent) => {
    // The agenda app has no route for a single event: open the event's calendar.
    window.open(`/calendar#/view/${event.calendarId}`, '_self');
  };

  return <Agenda events={events} onEventClick={handleEventClick} />;
}
