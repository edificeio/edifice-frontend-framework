import { createAgendaService } from './agendaService';

const { get } = vi.hoisted(() => ({ get: vi.fn() }));

vi.mock('@edifice.io/client', () => ({
  odeServices: { http: () => ({ get }) },
}));

const service = createAgendaService('/api');

describe('createAgendaService', () => {
  describe('getCalendars', () => {
    it('requests the calendar list and maps it', async () => {
      get.mockResolvedValue([
        { _id: 'c1', title: 'Mon agenda', color: 'cyan', isExternal: false },
      ]);

      await expect(service.getCalendars()).resolves.toEqual([
        { id: 'c1', title: 'Mon agenda', color: 'cyan', isExternal: false },
      ]);
      expect(get).toHaveBeenCalledWith('/api/calendar/calendars');
    });
  });

  describe('getEvents', () => {
    it('requests every calendar id and the requested count', async () => {
      get.mockResolvedValue([]);

      await service.getEvents(['c1', 'c2'], 3);

      expect(get).toHaveBeenCalledWith(
        '/api/calendar/events/widget?calendarId=c1&calendarId=c2&nb=3',
      );
    });

    it('maps the raw events, taking the first calendar id', async () => {
      get.mockResolvedValue([
        {
          _id: 'e1',
          title: 'Réunion',
          allday: false,
          startMoment: '2026-09-10T09:00:00.000Z',
          endMoment: '2026-09-10T10:00:00.000Z',
          calendar: ['c1', 'c2'],
        },
      ]);

      await expect(service.getEvents(['c1'], 3)).resolves.toEqual([
        {
          id: 'e1',
          calendarId: 'c1',
          title: 'Réunion',
          startMoment: '2026-09-10T09:00:00.000Z',
          endMoment: '2026-09-10T10:00:00.000Z',
          allDay: false,
        },
      ]);
    });

    it('does not call the API when no calendar is given', async () => {
      await expect(service.getEvents([], 3)).resolves.toEqual([]);
      expect(get).not.toHaveBeenCalled();
    });
  });
});
