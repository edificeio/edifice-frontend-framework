// The URL parser is lenient ("https:lumni.fr" parses as "https://lumni.fr/"),
// but the raw value is what gets saved, so the "//" must be typed.
const HTTP_PREFIX = /^https?:\/\//i;

/**
 * Parses a user-typed web address. Returns the URL when it is an absolute
 * http(s) URL starting with "http://" or "https://" and whose host contains
 * a dot (e.g. "lumni.fr"), or `null` otherwise.
 */
export function parseHttpUrl(value: string): URL | null {
  const trimmed = value.trim();
  if (!HTTP_PREFIX.test(trimmed)) return null;

  let url: URL;
  try {
    url = new URL(trimmed);
  } catch {
    return null;
  }
  if (url.protocol !== 'http:' && url.protocol !== 'https:') return null;

  const { hostname } = url;
  const labels = hostname.split('.');
  if (labels.length < 2 || labels.some((label) => label.length === 0)) {
    return null;
  }
  return url;
}

/** Whether `value` is an absolute http(s) URL pointing to a domain. */
export function isValidHttpUrl(value: string): boolean {
  return parseHttpUrl(value) !== null;
}
