import { CalendarEvent } from '@edifice.io/client';

import { Agenda } from './Agenda';
import { useAgendaContainer } from './hooks/useAgendaContainer';

export function AgendaContainer() {
  const { events } = useAgendaContainer();

  const handleEventClick = (event: CalendarEvent) => {
    window.open(
      `/calendar#/view/${event.calendarId}/event/${event.id}`,
      '_self',
    );
  };

  return <Agenda events={events} onEventClick={handleEventClick} />;
}
