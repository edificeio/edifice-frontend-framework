import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import { act, renderHook, waitFor } from '~/setup';
import {
  MAX_RSS_ARTICLES,
  MAX_RSS_FEEDS,
  useRssContainer,
} from './useRssContainer';
import { RssArticle, RssFeed } from '../types';

const { get, postJson, putJson, isResponseError } = vi.hoisted(() => ({
  get: vi.fn(),
  postJson: vi.fn(),
  putJson: vi.fn(),
  isResponseError: vi.fn(() => false),
}));

vi.mock('@edifice.io/client', () => ({
  odeServices: {
    http: () => ({
      get,
      postJson,
      putJson,
      isResponseError,
      latestResponse: { statusText: 'Error' },
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

const feeds: RssFeed[] = [
  { title: 'Le Monde', link: 'https://www.lemonde.fr/rss/une.xml', show: 5 },
  { title: 'Eduscol', link: 'https://eduscol.education.fr/rss.xml', show: 3 },
  { title: 'Le Parisien', link: 'https://www.leparisien.fr/rss', show: 3 },
];

const articles: RssArticle[] = Array.from({ length: 5 }, (_, i) => ({
  title: `Article ${i}`,
  link: `https://www.lemonde.fr/article/${i}`,
  description: '',
  pubDate: 'Tue, 21 Jul 2026 08:00:00 +0200',
}));

/**
 * Stateful backend mock: POST/PUT persist the feeds, so that the refetch
 * following each mutation returns what was saved.
 */
const mockBackend = (
  channels: { _id: string; feeds: RssFeed[] }[],
  feedItems: { status: number; Items?: RssArticle[] } = {
    status: 200,
    Items: articles,
  },
) => {
  let stored = channels;
  get.mockImplementation(async (url: string) =>
    url === '/rss/channels' ? stored : feedItems,
  );
  postJson.mockImplementation(
    async (_url: string, body: { feeds: RssFeed[] }) => {
      stored = [{ _id: 'new-channel', feeds: body.feeds }];
      return { _id: 'new-channel' };
    },
  );
  putJson.mockImplementation(
    async (_url: string, body: { feeds: RssFeed[] }) => {
      stored = [{ ...stored[0], feeds: body.feeds }];
      return { number: 1 };
    },
  );
};

const renderContainerHook = async () => {
  const hook = renderHook(() => useRssContainer(), {
    wrapper: createWrapper(),
  });
  await waitFor(() => expect(hook.result.current.isLoading).toBe(false));
  return hook;
};

describe('useRssContainer', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('fetches the first feed articles, URL-encoded, capped to MAX_RSS_ARTICLES', async () => {
    mockBackend([{ _id: 'channel-1', feeds }]);

    const { result } = await renderContainerHook();

    await waitFor(() => expect(result.current.articlesStatus).toBe('success'));
    expect(get).toHaveBeenCalledWith(
      `/rss/feed/items?url=${encodeURIComponent(feeds[0].link)}&force=0`,
    );
    expect(result.current.articles).toHaveLength(MAX_RSS_ARTICLES);
  });

  it('reports an error when the backend cannot read the feed', async () => {
    mockBackend([{ _id: 'channel-1', feeds }], { status: 500 });

    const { result } = await renderContainerHook();

    await waitFor(() => expect(result.current.articlesStatus).toBe('error'));
  });

  it('disallows adding a feed once MAX_RSS_FEEDS is reached', async () => {
    const fullFeeds = Array.from({ length: MAX_RSS_FEEDS }, (_, i) => ({
      title: `Flux ${i}`,
      link: `https://example.com/${i}.xml`,
    }));
    mockBackend([{ _id: 'channel-1', feeds: fullFeeds }]);

    const { result } = await renderContainerHook();

    expect(result.current.canAddFeed).toBe(false);
  });

  it('creates the channel on the first save', async () => {
    mockBackend([]);

    const { result } = await renderContainerHook();
    expect(result.current.canAddFeed).toBe(true);

    await act(async () => {
      await result.current.addFeed({
        title: 'Le Monde',
        link: 'https://www.lemonde.fr/rss/une.xml',
      });
    });

    expect(postJson).toHaveBeenCalledWith('/rss/channel', {
      feeds: [
        {
          title: 'Le Monde',
          link: 'https://www.lemonde.fr/rss/une.xml',
          show: 3,
        },
      ],
    });
    expect(putJson).not.toHaveBeenCalled();
  });

  it('appends a new feed to the existing channel', async () => {
    mockBackend([{ _id: 'channel-1', feeds }]);

    const { result } = await renderContainerHook();

    await act(async () => {
      await result.current.addFeed({
        title: 'Nouveau',
        link: 'https://example.com/rss',
      });
    });

    expect(putJson).toHaveBeenCalledWith('/rss/channel/channel-1', {
      feeds: [
        ...feeds,
        { title: 'Nouveau', link: 'https://example.com/rss', show: 3 },
      ],
    });
  });

  it('updates a feed in place, keeping its legacy settings', async () => {
    mockBackend([{ _id: 'channel-1', feeds }]);

    const { result } = await renderContainerHook();

    await act(async () => {
      await result.current.updateFeed(0, {
        title: 'Le Monde (Une)',
        link: 'https://www.lemonde.fr/rss/une.xml',
      });
    });

    expect(putJson).toHaveBeenCalledWith('/rss/channel/channel-1', {
      feeds: [
        {
          title: 'Le Monde (Une)',
          link: 'https://www.lemonde.fr/rss/une.xml',
          show: 5,
        },
        feeds[1],
        feeds[2],
      ],
    });
  });

  it('removes a feed and keeps the same feed selected', async () => {
    mockBackend([{ _id: 'channel-1', feeds }]);

    const { result } = await renderContainerHook();

    act(() => result.current.selectFeed(2));
    act(() => result.current.deleteFeed(0));

    await waitFor(() =>
      expect(putJson).toHaveBeenCalledWith('/rss/channel/channel-1', {
        feeds: [feeds[1], feeds[2]],
      }),
    );
    expect(result.current.feeds[result.current.selectedIndex]).toEqual(
      feeds[2],
    );
  });

  it('falls back to the last feed when the selected one is removed', async () => {
    mockBackend([{ _id: 'channel-1', feeds }]);

    const { result } = await renderContainerHook();

    act(() => result.current.selectFeed(2));
    act(() => result.current.deleteFeed(2));

    await waitFor(() => expect(result.current.feeds).toHaveLength(2));
    expect(result.current.selectedIndex).toBe(1);
  });
});
