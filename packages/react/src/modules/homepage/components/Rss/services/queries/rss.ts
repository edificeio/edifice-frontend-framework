import {
  queryOptions,
  useMutation,
  useQueries,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { rssService } from '../api';
import { RssChannel } from '../api/rssService';
import { RssArticle } from '../../types';

export const rssQueryKeys = {
  all: () => ['rss'] as const,
  channel: () => [...rssQueryKeys.all(), 'channel'] as const,
  articles: (url: string) => [...rssQueryKeys.all(), 'articles', url] as const,
};

export const rssQueryOptions = {
  getChannel() {
    return queryOptions({
      queryKey: rssQueryKeys.channel(),
      queryFn: async (): Promise<RssChannel> => rssService.getChannel(),
    });
  },
  getArticles(url: string) {
    return queryOptions({
      queryKey: rssQueryKeys.articles(url),
      queryFn: async (): Promise<RssArticle[]> => rssService.getArticles(url),
      // An invalid feed URL won't fix itself: show the error state right away.
      retry: false,
    });
  },
};

export const useRssChannel = () => {
  return useQuery(rssQueryOptions.getChannel());
};

/**
 * Fetches every feed's articles in parallel, so that switching feeds doesn't
 * show a loading state. Queries are independent: one failing feed doesn't
 * prevent the others from loading.
 */
export const useRssFeedsArticles = (urls: string[]) => {
  return useQueries({
    queries: urls.map((url) => rssQueryOptions.getArticles(url)),
  });
};

/**
 * Saves the whole feeds array (the backend has no per-feed route), with an
 * optimistic update so that adding, editing and deleting feel immediate.
 */
export const useSaveRssFeeds = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ channelId, feeds }: RssChannel) =>
      rssService.saveFeeds(channelId, feeds),
    onMutate: async ({ channelId, feeds }) => {
      await queryClient.cancelQueries({ queryKey: rssQueryKeys.channel() });
      const previousChannel = queryClient.getQueryData<RssChannel>(
        rssQueryKeys.channel(),
      );
      queryClient.setQueryData<RssChannel>(rssQueryKeys.channel(), {
        channelId,
        feeds,
      });
      return { previousChannel };
    },
    onSuccess: (channelId, { feeds }) => {
      // The first save creates the channel: keep its id for the next ones.
      queryClient.setQueryData<RssChannel>(rssQueryKeys.channel(), {
        channelId,
        feeds,
      });
    },
    onError: (_error, _variables, context) => {
      if (context?.previousChannel) {
        queryClient.setQueryData(
          rssQueryKeys.channel(),
          context.previousChannel,
        );
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: rssQueryKeys.channel() });
    },
  });
};
