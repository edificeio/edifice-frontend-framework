import { odeServices } from '@edifice.io/client';
import { RssArticle, RssFeed } from '../../types';

interface ChannelDTO {
  _id: string;
  feeds: RssFeed[];
  owner: { userId: string; displayName: string };
  created: { $date: number };
  modified: { $date: number };
}

interface FeedItemsDTO {
  title?: string;
  link?: string;
  Items?: RssArticle[];
  /** HTTP-like status of the feed fetch done by the backend. */
  status: number;
}

/** The user's RSS channel: its id (none until first saved) and its feeds. */
export interface RssChannel {
  channelId?: string;
  feeds: RssFeed[];
}

/**
 * Creates an RSS service for the homepage "RSS" widget, on top of the
 * legacy `rss` backend module.
 *
 * Backend contract:
 * - `GET /rss/channels` returns the user's channels; only the first one is
 *   used, and an empty array means the user has never saved a feed.
 * - `POST /rss/channel { feeds }` creates the channel and returns `{ _id }`.
 * - `PUT /rss/channel/:id { feeds }` replaces the whole feeds array: adding,
 *   editing and deleting a feed are all done this way.
 * - `GET /rss/feed/items?url=…&force=0` fetches and parses a feed (served
 *   from the backend cache). The body carries its own `status`: anything
 *   other than 200 means the URL is not a readable RSS feed.
 *
 * @param baseURL The base URL for the rss service API.
 */
export const createRssService = (baseURL: string) => ({
  /**
   * Get the current user's RSS channel.
   */
  async getChannel(): Promise<RssChannel> {
    const http = odeServices.http();
    const channels = await http.get<ChannelDTO[]>(`${baseURL}/rss/channels`);
    if (http.isResponseError()) {
      throw new Error(http.latestResponse.statusText);
    }
    const [channel] = channels;
    return { channelId: channel?._id, feeds: channel?.feeds ?? [] };
  },

  /**
   * Save the whole feeds array, creating the channel on first save.
   * @returns the channel id.
   */
  async saveFeeds(
    channelId: string | undefined,
    feeds: RssFeed[],
  ): Promise<string> {
    const http = odeServices.http();
    if (!channelId) {
      const { _id } = await http.postJson<{ _id: string }>(
        `${baseURL}/rss/channel`,
        { feeds },
      );
      if (http.isResponseError()) {
        throw new Error(http.latestResponse.statusText);
      }
      return _id;
    }
    await http.putJson(`${baseURL}/rss/channel/${channelId}`, { feeds });
    if (http.isResponseError()) {
      throw new Error(http.latestResponse.statusText);
    }
    return channelId;
  },

  /**
   * Get the articles of a feed.
   * @throws when the URL cannot be fetched or parsed as an RSS feed.
   */
  async getArticles(url: string): Promise<RssArticle[]> {
    const http = odeServices.http();
    const result = await http.get<FeedItemsDTO>(
      `${baseURL}/rss/feed/items?url=${encodeURIComponent(url)}&force=0`,
    );
    if (http.isResponseError() || result?.status !== 200) {
      throw new Error('rss.feed.invalid');
    }
    return result.Items ?? [];
  },
});
