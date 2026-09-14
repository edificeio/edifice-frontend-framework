import { UsefulLink } from '@edifice.io/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import { act, renderHook, waitFor } from '~/setup';
import {
  MAX_USEFUL_LINKS,
  useUsefulLinksContainer,
} from './useUsefulLinksContainer';

const { get, postJson, putJson, del } = vi.hoisted(() => ({
  get: vi.fn(),
  postJson: vi.fn(),
  putJson: vi.fn(),
  del: vi.fn(),
}));

vi.mock('@edifice.io/client', () => ({
  odeServices: {
    http: () => ({
      get,
      postJson,
      putJson,
      delete: del,
    }),
  },
}));

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

const links: UsefulLink[] = [
  { id: '1', name: 'Lumni', url: 'https://lumni.fr' },
  { id: '2', name: 'ONISEP', url: 'https://onisep.fr' },
];

const bookmarksResponse = {
  _id: 'owner-doc-1',
  owner: { userId: 'u1', displayName: 'User' },
  bookmarks: links.map(({ id, name, url }) => ({ _id: id, name, url })),
  created: { $date: '2026-09-09T09:59:26.347Z' },
  modified: { $date: '2026-09-09T09:59:26.347Z' },
};

describe('useUsefulLinksContainer', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('exposes the fetched links', async () => {
    get.mockResolvedValue(bookmarksResponse);

    const { result } = renderHook(() => useUsefulLinksContainer(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.links).toEqual(links);
  });

  it('allows adding a link while under the limit', async () => {
    get.mockResolvedValue(bookmarksResponse);

    const { result } = renderHook(() => useUsefulLinksContainer(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.canAddLink).toBe(true);
  });

  it('disallows adding a link once MAX_USEFUL_LINKS is reached', async () => {
    const fullList = Array.from({ length: MAX_USEFUL_LINKS }, (_, i) => ({
      _id: `${i}`,
      name: `Link ${i}`,
      url: `https://example.com/${i}`,
    }));
    get.mockResolvedValue({ ...bookmarksResponse, bookmarks: fullList });

    const { result } = renderHook(() => useUsefulLinksContainer(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.canAddLink).toBe(false);
  });

  it('creates a link through the service', async () => {
    get.mockResolvedValue(bookmarksResponse);
    postJson.mockResolvedValue({ _id: '3' });

    const { result } = renderHook(() => useUsefulLinksContainer(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    await act(async () => {
      await result.current.createLink({ name: 'New', url: 'https://new.fr' });
    });

    expect(postJson).toHaveBeenCalledWith('/bookmark/api/v2/bookmarks', {
      name: 'New',
      url: 'https://new.fr',
    });
  });

  it('updates a link through the service', async () => {
    get.mockResolvedValue(bookmarksResponse);
    putJson.mockResolvedValue({ _id: '1' });

    const { result } = renderHook(() => useUsefulLinksContainer(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    await act(async () => {
      await result.current.updateLink('1', {
        name: 'Updated',
        url: 'https://lumni.fr',
      });
    });

    expect(putJson).toHaveBeenCalledWith('/bookmark/api/v2/bookmarks/1', {
      name: 'Updated',
      url: 'https://lumni.fr',
    });
  });

  it('deletes a link through the service', async () => {
    get.mockResolvedValue(bookmarksResponse);
    del.mockResolvedValue({ number: 1 });

    const { result } = renderHook(() => useUsefulLinksContainer(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    act(() => {
      result.current.deleteLink('1');
    });

    await waitFor(() =>
      expect(del).toHaveBeenCalledWith('/bookmark/api/v2/bookmarks/1'),
    );
  });
});
