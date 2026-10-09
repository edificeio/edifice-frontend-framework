import { CalendarEvent } from '@edifice.io/client';
import { fireEvent, render, screen } from '~/setup';
import { AgendaContainer } from './AgendaContainer';

const { useAgendaContainer } = vi.hoisted(() => ({
  useAgendaContainer: vi.fn(),
}));

vi.mock('./hooks/useAgendaContainer', () => ({ useAgendaContainer }));

const event: CalendarEvent = {
  id: 'event-1',
  calendarId: 'calendar-1',
  title: 'Réunion',
  startMoment: '2026-09-10T09:00:00.000Z',
  endMoment: '2026-09-10T10:00:00.000Z',
  allDay: false,
};

describe('AgendaContainer', () => {
  afterEach(() => {
    vi.clearAllMocks();
    vi.unstubAllGlobals();
  });

  it('renders the events returned by useAgendaContainer', () => {
    useAgendaContainer.mockReturnValue({
      events: [event],
      isLoading: false,
      error: null,
    });

    render(<AgendaContainer />);

    expect(screen.getByText('Réunion')).toBeInTheDocument();
  });

  it('opens the agenda module, focused on the clicked event, in the same tab', () => {
    useAgendaContainer.mockReturnValue({
      events: [event],
      isLoading: false,
      error: null,
    });
    const open = vi.fn();
    vi.stubGlobal('open', open);

    render(<AgendaContainer />);
    fireEvent.click(screen.getByTestId('agenda-event-card'));

    expect(open).toHaveBeenCalledWith(
      '/calendar#/view/calendar-1/event/event-1',
      '_self',
    );
  });
});
