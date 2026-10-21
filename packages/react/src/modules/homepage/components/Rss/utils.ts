const FEED_EXTENSIONS = ['.rss', '.xml', '.rdf', '.atom', '.feed'];

/**
 * Same rule as the legacy RSS widget: an http(s) URL whose last path
 * segment either has a feed extension or no extension at all.
 */
export function isValidRssFeedUrl(value: string): boolean {
  let url: URL;
  try {
    url = new URL(value.trim());
  } catch {
    return false;
  }
  if (url.protocol !== 'http:' && url.protocol !== 'https:') return false;

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
