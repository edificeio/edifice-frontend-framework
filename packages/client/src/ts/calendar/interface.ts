/**
 * A calendar owned by, or shared with, the current user.
 */
export interface Calendar {
  id: string;
  title: string;
  color: string;
  isExternal: boolean;
}

/**
 * An event of the Agenda module, as surfaced by the homepage "Agenda" widget.
 */
export interface CalendarEvent {
  id: string;
  calendarId: string;
  title: string;
  /** ISO 8601 date-time. */
  startMoment: string;
  /** ISO 8601 date-time. */
  endMoment: string;
  allDay: boolean;
}
