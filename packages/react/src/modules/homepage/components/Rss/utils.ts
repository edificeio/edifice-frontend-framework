import { parseHttpUrl } from '../../utils/url';

const FEED_EXTENSIONS = ['.rss', '.xml', '.rdf', '.atom', '.feed'];

/**
 * Same rule as the legacy RSS widget: a valid http(s) URL whose last path
 * segment either has a feed extension or no extension at all. The feed
 * content itself can only be checked by the backend.
 */
export function isValidRssFeedUrl(value: string): boolean {
  const url = parseHttpUrl(value);
  if (!url) return false;

  const pathname = url.pathname.toLowerCase();
  const lastSegment = pathname.split('/').pop() ?? '';
  return (
    !lastSegment.includes('.') ||
    FEED_EXTENSIONS.some((extension) => pathname.endsWith(extension))
  );
}

/** Feed descriptions may contain HTML: only keep their text. */
export function htmlToText(html: string): string {
  const doc = new DOMParser().parseFromString(html, 'text/html');
  return (doc.body.textContent ?? '').trim();
}
