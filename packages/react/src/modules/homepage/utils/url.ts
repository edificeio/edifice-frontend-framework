// The URL parser is lenient ("https:lumni.fr" parses as "https://lumni.fr/"),
// but the raw value is what gets saved, so the "//" must be typed.
const HTTP_PREFIX = /^https?:\/\//i;

export interface HttpUrlOptions {
  /**
   * Accept a host without any dot, such as an intranet name ("intranet") or
   * "localhost". By default the host must contain a dot (e.g. "lumni.fr").
   */
  allowIntranetHost?: boolean;
}

/**
 * Parses a user-typed web address. Returns the URL when it is an absolute
 * http(s) URL starting with "http://" or "https://" and whose host contains
 * a dot (unless `allowIntranetHost` is set), or `null` otherwise.
 */
export function parseHttpUrl(
  value: string,
  { allowIntranetHost = false }: HttpUrlOptions = {},
): URL | null {
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
  const minLabels = allowIntranetHost ? 1 : 2;
  if (labels.length < minLabels || labels.some((label) => !label)) {
    return null;
  }
  return url;
}

/** Whether `value` is a valid absolute http(s) URL (see `parseHttpUrl`). */
export function isValidHttpUrl(
  value: string,
  options?: HttpUrlOptions,
): boolean {
  return parseHttpUrl(value, options) !== null;
}
