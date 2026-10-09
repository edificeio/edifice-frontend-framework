import { Calendar, CalendarEvent } from '@edifice.io/client';
import { queryOptions, useQuery } from '@tanstack/react-query';

import { agendaService } from '../api';

export const agendaQueryKeys = {
  calendars: () => ['agenda', 'calendars'] as const,
  events: (calendarIds: string[], nb: number) =>
    ['agenda', 'events', calendarIds, nb] as const,
};

export const agendaQueryOptions = {
  getCalendars() {
    return queryOptions({
      queryKey: agendaQueryKeys.calendars(),
      queryFn: async (): Promise<Calendar[]> => agendaService.getCalendars(),
    });
  },
  getEvents(calendarIds: string[], nb: number) {
    return queryOptions({
      queryKey: agendaQueryKeys.events(calendarIds, nb),
      queryFn: async (): Promise<CalendarEvent[]> =>
        agendaService.getEvents(calendarIds, nb),
      enabled: calendarIds.length > 0,
    });
  },
};

export const useCalendars = () => {
  return useQuery(agendaQueryOptions.getCalendars());
};

export const useEvents = (calendarIds: string[], nb: number) => {
  return useQuery(agendaQueryOptions.getEvents(calendarIds, nb));
};
