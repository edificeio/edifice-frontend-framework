import { beforeEach, describe, expect, it, vi } from 'vitest';
import { mediacentreService } from './mediacentreService';

const mocks = vi.hoisted(() => ({
  get: vi.fn(),
  isResponseError: vi.fn(),
}));

vi.mock('@edifice.io/client', () => ({
  odeServices: {
    http: () => ({
      get: mocks.get,
      isResponseError: mocks.isResponseError,
    }),
  },
}));

describe('mediacentreService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.isResponseError.mockReturnValue(false);
  });

  describe('getFavorites', () => {
    it('maps the favorites to resources', async () => {
      mocks.get.mockResolvedValue({
        status: 'ok',
        data: [
          {
            _id: '1',
            title: 'Global resource',
            plain_text: 'Éditions Nathan',
            link: 'https://example.com/global',
            image: 'https://example.com/global.png',
          },
          {
            _id: '2',
            title: 'Personal signet',
            plain_text: '',
            url: 'https://example.com/personal',
            image: '',
          },
        ],
      });

      await expect(mediacentreService.getFavorites()).resolves.toEqual([
        {
          id: '1',
          title: 'Global resource',
          subtitle: 'Éditions Nathan',
          href: 'https://example.com/global',
          imageUrl: 'https://example.com/global.png',
        },
        {
          id: '2',
          title: 'Personal signet',
          subtitle: undefined,
          href: 'https://example.com/personal',
          imageUrl: undefined,
        },
      ]);
      expect(mocks.get).toHaveBeenCalledWith('/mediacentre/favorites');
    });

    it('returns an empty list when the user never selected a favorite', async () => {
      mocks.get.mockResolvedValue({
        status: 'ok',
        state: 'initialization',
        data: {},
      });

      await expect(mediacentreService.getFavorites()).resolves.toEqual([]);
    });

    it('throws when the backend answers with an error status', async () => {
      mocks.get.mockResolvedValue({ status: 'ko', data: [] });

      await expect(mediacentreService.getFavorites()).rejects.toThrow();
    });

    it('throws when the request fails', async () => {
      mocks.get.mockResolvedValue(undefined);
      mocks.isResponseError.mockReturnValue(true);

      await expect(mediacentreService.getFavorites()).rejects.toThrow();
    });
  });
});
