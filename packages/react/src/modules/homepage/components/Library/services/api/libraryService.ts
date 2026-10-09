import { odeServices } from '@edifice.io/client';

import { LibraryBook, LibraryLoansResponse } from '../../models';

/**
 * Resolve the cover URL of an RSS `<item>`, looking successively at the
 * `<enclosure>` element, the `<media:content>`/`<media:thumbnail>` elements
 * and finally the first `<img>` found in the item description.
 */
function findItemCover(item: Element): string | undefined {
  const enclosure = item.querySelector('enclosure[url]');
  const enclosureType = enclosure?.getAttribute('type') ?? '';
  if (enclosure && (!enclosureType || enclosureType.startsWith('image/'))) {
    return enclosure.getAttribute('url') ?? undefined;
  }

  const mediaElements = [
    ...Array.from(item.getElementsByTagNameNS('*', 'content')),
    ...Array.from(item.getElementsByTagNameNS('*', 'thumbnail')),
  ];
  const media = mediaElements.find((element) => element.getAttribute('url'));
  if (media) {
    return media.getAttribute('url') ?? undefined;
  }

  const description = item.querySelector('description')?.textContent ?? '';
  if (!description) return undefined;
  const html = new DOMParser().parseFromString(description, 'text/html');
  return html.querySelector('img')?.getAttribute('src') ?? undefined;
}

/**
 * Parse an RSS 2.0 feed into a list of books.
 *
 * The book author is read from the `<dc:creator>` or `<author>` element, and
 * the cover from the `<enclosure>`, `<media:*>` or description image.
 *
 * @param xml Raw XML content of the RSS feed.
 * @returns The books described by the feed items.
 */
export function parseRssFeed(xml: string): LibraryBook[] {
  const doc = new DOMParser().parseFromString(xml, 'application/xml');
  if (doc.querySelector('parsererror')) {
    throw new Error('Invalid RSS feed');
  }

  return Array.from(doc.querySelectorAll('item')).map((item, index) => {
    const link = item.querySelector('link')?.textContent?.trim() ?? '';
    const guid = item.querySelector('guid')?.textContent?.trim() ?? '';
    const author =
      item.getElementsByTagNameNS('*', 'creator')[0]?.textContent?.trim() ||
      item.querySelector('author')?.textContent?.trim() ||
      undefined;

    return {
      id: guid || link || `library-book-${index}`,
      title: item.querySelector('title')?.textContent?.trim() ?? '',
      author,
      cover: findItemCover(item),
      link: link || undefined,
    };
  });
}

/**
 * Creates a library service with methods to fetch the books selection and the
 * user's loans from the library backend.
 *
 * @returns A service exposing methods to retrieve the selection and the loans.
 */
export const createLibraryService = () => ({
  /**
   * Fetch and parse the RSS feed listing the current books selection.
   *
   * @param feedUrl URL of the RSS feed.
   * @returns The books of the selection.
   */
  async getSelection(feedUrl: string): Promise<LibraryBook[]> {
    const http = odeServices.http();
    const xml = await http.get<string>(feedUrl, { responseType: 'text' });
    if (http.isResponseError()) {
      throw new Error(http.latestResponse.statusText);
    }
    return parseRssFeed(xml);
  },

  /**
   * Get the books currently borrowed by the user or, for a relative, the
   * number of books borrowed by each child.
   *
   * @param loansUrl URL of the endpoint returning the user's loans.
   * @returns The user's loans and the number of books borrowed by each child.
   */
  async getLoans(loansUrl: string): Promise<LibraryLoansResponse> {
    const http = odeServices.http();
    const response = await http.get<Partial<LibraryLoansResponse>>(loansUrl);
    if (http.isResponseError()) {
      throw new Error(http.latestResponse.statusText);
    }
    return {
      loans: response?.loans ?? [],
      children: response?.children ?? [],
    };
  },
});
