import { CalendarEvent } from '@edifice.io/client';
import dayjs from 'dayjs';
import { useMemo } from 'react';

import { useCalendars, useEvents } from '../services/queries/agenda';

/** Number of upcoming events shown by the widget. */
export const MAX_VISIBLE_EVENTS = 3;

export interface UseAgendaContainerReturn {
  events: CalendarEvent[];
  isLoading: boolean;
  error: Error | null;
}

/**
 * Loads the current user's calendars, then their events, and keeps only the
 * next `MAX_VISIBLE_EVENTS` events that haven't fully elapsed yet — an event
 * still in progress (end date in the future) counts as "upcoming" too.
 */
export const useAgendaContainer = (): UseAgendaContainerReturn => {
  const {
    data: calendars,
    isLoading: isLoadingCalendars,
    error: calendarsError,
  } = useCalendars();
  const calendarIds = useMemo(
    () => calendars?.map((calendar) => calendar.id) ?? [],
    [calendars],
  );
  const {
    data: rawEvents,
    isLoading: isLoadingEvents,
    error: eventsError,
  } = useEvents(calendarIds, MAX_VISIBLE_EVENTS);

  const events = useMemo(() => {
    if (!rawEvents) return [];

    const now = dayjs();
    return rawEvents
      .filter((event) => dayjs(event.endMoment).isAfter(now))
      .sort((a, b) => dayjs(a.startMoment).diff(dayjs(b.startMoment)))
      .slice(0, MAX_VISIBLE_EVENTS);
  }, [rawEvents]);

  return {
    events,
    isLoading: isLoadingCalendars || isLoadingEvents,
    error: calendarsError ?? eventsError,
  };
};
