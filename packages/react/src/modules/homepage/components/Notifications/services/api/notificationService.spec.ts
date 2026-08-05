import { NotificationModel } from '@edifice.io/client';
import { createNotificationService } from './notificationService';

const { get } = vi.hoisted(() => ({ get: vi.fn() }));

vi.mock('@edifice.io/client', () => ({
  odeServices: { http: () => ({ get }) },
}));

const service = createNotificationService('/api');

const notification = (id: string) =>
  ({ _id: id }) as unknown as NotificationModel;

describe('createNotificationService', () => {
  describe('getNotifications', () => {
    it('requests the page and every requested type', async () => {
      get.mockResolvedValue({ status: 'ok', number: 0, results: [] });

      await service.getNotifications(['BLOG', 'NEWS'], 2);

      expect(get).toHaveBeenCalledWith(
        '/api/timeline/lastNotifications?page=2&type=BLOG&type=NEWS',
      );
    });

    it('requests only the page when no type is given', async () => {
      get.mockResolvedValue({ status: 'ok', number: 0, results: [] });

      await service.getNotifications([], 0);

      expect(get).toHaveBeenCalledWith(
        '/api/timeline/lastNotifications?page=0',
      );
    });

    it('returns the results of a successful response', async () => {
      const results = [notification('n1'), notification('n2')];
      get.mockResolvedValue({ status: 'ok', number: 2, results });

      await expect(service.getNotifications(['BLOG'], 0)).resolves.toEqual(
        results,
      );
    });

    it('returns an empty list when the platform reports an error', async () => {
      get.mockResolvedValue({
        status: 'error',
        number: 1,
        results: [notification('n1')],
      });

      await expect(service.getNotifications(['BLOG'], 0)).resolves.toEqual([]);
    });

    it('returns an empty list when the response holds no result', async () => {
      get.mockResolvedValue({ status: 'ok', number: 0, results: [] });

      await expect(service.getNotifications(['BLOG'], 0)).resolves.toEqual([]);
    });

    it('returns an empty list when the results are missing altogether', async () => {
      get.mockResolvedValue({ status: 'ok', number: 3 });

      await expect(service.getNotifications(['BLOG'], 0)).resolves.toEqual([]);
    });
  });

  describe('getNotificationTypes', () => {
    it('requests the type list of the platform', async () => {
      get.mockResolvedValue(['BLOG', 'NEWS']);

      await expect(service.getNotificationTypes()).resolves.toEqual([
        'BLOG',
        'NEWS',
      ]);
      expect(get).toHaveBeenCalledWith('/api/timeline/types');
    });
  });

  it('prefixes every call with the configured base URL', async () => {
    get.mockResolvedValue([]);

    await createNotificationService('https://ent.fr').getNotificationTypes();

    expect(get).toHaveBeenCalledWith('https://ent.fr/timeline/types');
  });
});
