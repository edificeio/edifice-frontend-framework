import { Calendar, CalendarEvent, odeServices } from '@edifice.io/client';

interface CalendarDTO {
  _id: string;
  title: string;
  color: string;
  isExternal: boolean;
}

interface CalendarEventDTO {
  _id: string;
  title: string;
  allday: boolean;
  startMoment: string;
  endMoment: string;
  calendar: string[];
}

const toCalendar = ({
  _id,
  title,
  color,
  isExternal,
}: CalendarDTO): Calendar => ({
  id: _id,
  title,
  color,
  isExternal,
});

const toCalendarEvent = ({
  _id,
  title,
  allday,
  startMoment,
  endMoment,
  calendar,
}: CalendarEventDTO): CalendarEvent => ({
  id: _id,
  calendarId: calendar[0],
  title,
  startMoment,
  endMoment,
  allDay: allday,
});

/**
 * Creates an agenda service with methods to fetch the current user's
 * calendars and upcoming events (homepage "Agenda" widget).
 *
 * Backend contract (provisional, see IMPULS-5880/IMPULS-6095): `GET
 * /calendar/calendars` lists the user's calendars, `GET
 * /calendar/events/widget?calendarId=...&nb=N` returns up to `N` events for
 * the given calendars. Whether that second endpoint already excludes past
 * (fully elapsed) events isn't guaranteed, so callers should re-apply that
 * filter themselves.
 *
 * @param baseURL The base URL for the agenda service API.
 */
export const createAgendaService = (baseURL: string) => ({
  /**
   * Get the calendars the current user can see events from.
   */
  async getCalendars(): Promise<Calendar[]> {
    const calendars = await odeServices
      .http()
      .get<CalendarDTO[]>(`${baseURL}/calendar/calendars`);
    return calendars.map(toCalendar);
  },

  /**
   * Get up to `nb` events for the given calendars, in no particular order.
   */
  async getEvents(calendarIds: string[], nb: number): Promise<CalendarEvent[]> {
    if (calendarIds.length === 0) {
      return [];
    }

    const query = new URLSearchParams();
    calendarIds.forEach((id) => query.append('calendarId', id));
    query.set('nb', String(nb));

    const events = await odeServices
      .http()
      .get<
        CalendarEventDTO[]
      >(`${baseURL}/calendar/events/widget?${query.toString()}`);
    return events.map(toCalendarEvent);
  },
});
