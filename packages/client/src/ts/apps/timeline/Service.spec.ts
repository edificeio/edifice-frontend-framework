import { IOdeServices } from '../../services/OdeServices';
import { TimelineService } from './Service';

describe('TimelineService', () => {
  let httpMock: { get: ReturnType<typeof vi.fn> };
  let service: TimelineService;

  beforeEach(() => {
    httpMock = { get: vi.fn() };
    const mockContext = {
      http: () => httpMock,
    } as unknown as IOdeServices;
    service = new TimelineService(mockContext);
  });

  describe('getNotificationsSince', () => {
    it('sends the date as an ISO-8601 UTC string', async () => {
      httpMock.get.mockResolvedValue({ status: 'ok', results: [] });

      await service.getNotificationsSince(new Date('2026-11-20T08:30:00.000Z'));

      expect(httpMock.get).toHaveBeenCalledWith(
        '/timeline/notifications/since',
        { queryParams: { date: '2026-11-20T08:30:00.000Z' } },
      );
    });

    it('forwards the disableNotifications option', async () => {
      httpMock.get.mockResolvedValue({ status: 'ok', results: [] });
      const since = new Date('2026-11-20T08:30:00.000Z');

      await service.getNotificationsSince(since, {
        disableNotifications: true,
      });

      expect(httpMock.get).toHaveBeenCalledWith(
        '/timeline/notifications/since',
        {
          disableNotifications: true,
          queryParams: { date: '2026-11-20T08:30:00.000Z' },
        },
      );
    });

    it('returns the results', async () => {
      const results = [
        {
          '_id': 'n1',
          'type': 'MESSAGERIE',
          'event-type': 'SEND-MESSAGE',
          'resource': 'm1',
          'date': { $date: '2026-11-20T09:00:00.000Z' },
        },
      ];
      httpMock.get.mockResolvedValue({ status: 'ok', results });

      await expect(service.getNotificationsSince(new Date())).resolves.toEqual(
        results,
      );
    });

    it('returns an empty list when the payload has no results', async () => {
      httpMock.get.mockResolvedValue({ status: 'ok' });

      await expect(service.getNotificationsSince(new Date())).resolves.toEqual(
        [],
      );
    });
  });
});
