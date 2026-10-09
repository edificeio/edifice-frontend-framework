import { http, HttpResponse } from 'msw';

export const handlers = [
  http.get('/calendar/calendars', () => {
    return HttpResponse.json([
      {
        _id: 'calendar-1',
        title: 'Mon agenda',
        color: 'cyan',
        isExternal: false,
      },
    ]);
  }),
  http.get('/calendar/events/widget', () => {
    return HttpResponse.json([]);
  }),
];
