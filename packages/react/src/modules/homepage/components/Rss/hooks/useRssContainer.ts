import { useState } from 'react';
import {
  useRssFeedsArticles,
  useRssChannel,
  useSaveRssFeeds,
} from '../services/queries/rss';
import {
  RssArticle,
  RssArticlesStatus,
  RssFeed,
  RssFeedPayload,
} from '../types';

/** Maximum number of feeds a user can follow. */
export const MAX_RSS_FEEDS = 10;

/** Maximum number of articles displayed for the selected feed. */
export const MAX_RSS_ARTICLES = 3;

/** Legacy `show` value given to new feeds, for the legacy widget. */
const DEFAULT_FEED_SHOW = 3;

export interface UseRssContainerReturn {
  feeds: RssFeed[];
  isLoading: boolean;
  /** Whether the user can still add a feed (fewer than MAX_RSS_FEEDS). */
  canAddFeed: boolean;
  selectedIndex: number;
  selectFeed: (index: number) => void;
  /** The selected feed's latest articles, at most MAX_RSS_ARTICLES. */
  articles: RssArticle[];
  articlesStatus: RssArticlesStatus;
  addFeed: (payload: RssFeedPayload, onSuccess?: () => void) => void;
  updateFeed: (
    index: number,
    payload: RssFeedPayload,
    onSuccess?: () => void,
  ) => void;
  deleteFeed: (index: number) => void;
  isSaving: boolean;
}

/**
 * Custom hook that provides the RSS feeds, the selected feed's articles and
 * the feed CRUD handlers. Feeds have no id: they are handled by index.
 */
export const useRssContainer = (): UseRssContainerReturn => {
  const { data: channel, isLoading } = useRssChannel();
  const saveMutation = useSaveRssFeeds();
  const [selectedIndex, setSelectedIndex] = useState(0);

  const feeds = channel?.feeds ?? [];
  // A deletion can leave the selection past the end of the list.
  const currentIndex = Math.min(selectedIndex, Math.max(feeds.length - 1, 0));
  // All feeds are loaded upfront so that switching feeds is instant.
  const articlesQueries = useRssFeedsArticles(feeds.map((feed) => feed.link));
  const articlesQuery = articlesQueries[currentIndex];

  let articlesStatus: RssArticlesStatus = 'loading';
  if (articlesQuery?.isError) articlesStatus = 'error';
  else if (articlesQuery?.isSuccess) articlesStatus = 'success';

  const saveFeeds = (nextFeeds: RssFeed[], onSuccess?: () => void) =>
    saveMutation.mutate(
      { channelId: channel?.channelId, feeds: nextFeeds },
      { onSuccess },
    );

  const deleteFeed = (index: number) => {
    // Keep the same feed selected when a feed before it is removed.
    if (index < currentIndex) setSelectedIndex(currentIndex - 1);
    saveFeeds(feeds.filter((_, i) => i !== index));
  };

  return {
    feeds,
    isLoading,
    canAddFeed: feeds.length < MAX_RSS_FEEDS,
    selectedIndex: currentIndex,
    selectFeed: setSelectedIndex,
    articles: (articlesQuery?.data ?? []).slice(0, MAX_RSS_ARTICLES),
    articlesStatus,
    addFeed: (payload, onSuccess) =>
      saveFeeds([...feeds, { ...payload, show: DEFAULT_FEED_SHOW }], onSuccess),
    updateFeed: (index, payload, onSuccess) =>
      saveFeeds(
        feeds.map((feed, i) => (i === index ? { ...feed, ...payload } : feed)),
        onSuccess,
      ),
    deleteFeed,
    isSaving: saveMutation.isPending,
  };
};
