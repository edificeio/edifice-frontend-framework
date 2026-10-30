import { Agenda } from './Agenda';
import { useAgendaContainer } from './hooks/useAgendaContainer';

export function AgendaContainer() {
  const { events } = useAgendaContainer();

  const handleEventClick = () => {
    // The agenda app has no route for a single event: open its root view.
    window.open('/calendar', '_self');
  };

  return <Agenda events={events} onEventClick={handleEventClick} />;
}
