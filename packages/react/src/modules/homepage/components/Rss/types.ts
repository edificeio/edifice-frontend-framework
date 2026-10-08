/**
 * An RSS feed followed by the user from the homepage "RSS" widget.
 * Feeds have no id: they are stored as an ordered array in the user's
 * RSS channel and identified by their position in it.
 */
export interface RssFeed {
  title: string;
  link: string;
  /** Legacy number of articles to display, kept as-is when editing. */
  show?: number;
}

export type RssFeedPayload = Pick<RssFeed, 'title' | 'link'>;

/**
 * An article of an RSS feed, as parsed by the rss backend module.
 */
export interface RssArticle {
  title: string;
  link: string;
  /** May contain HTML. */
  description: string;
  /** RFC 822 date, e.g. "Tue, 21 Jul 2026 08:00:00 +0200". */
  pubDate: string;
}

/** Fetch status of the selected feed's articles. */
export type RssArticlesStatus = 'loading' | 'error' | 'success';
