// The URL parser is lenient ("https:lumni.fr" parses as "https://lumni.fr/"),
// but the raw value is what gets saved, so the "//" must be typed.
const HTTP_PREFIX = /^https?:\/\//i;

// Engines do not agree on invalid hosts: Chrome accepts "https://a b.fr"
// (host "a%20b.fr") or "https://a!b.fr", where Node and jsdom throw. So the
// host is checked here rather than trusting the URL parser.
// A label is made of letters, digits, "-" and "_", and does not start or end
// with "-". Internationalized domains are already punycoded ("xn--…").
const HOST_LABEL = /^[a-z0-9_](?:[a-z0-9_-]*[a-z0-9_])?$/i;
const IPV6_HOST = /^\[[0-9a-f:.]+\]$/i;

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
  // A typed URL never contains a raw space, in the host or anywhere else.
  if (!HTTP_PREFIX.test(trimmed) || /\s/.test(trimmed)) return null;

  let url: URL;
  try {
    url = new URL(trimmed);
  } catch {
    return null;
  }
  if (url.protocol !== 'http:' && url.protocol !== 'https:') return null;

  const { hostname } = url;
  if (IPV6_HOST.test(hostname)) return allowIntranetHost ? url : null;

  const labels = hostname.split('.');
  const minLabels = allowIntranetHost ? 1 : 2;
  if (
    labels.length < minLabels ||
    labels.some((label) => !HOST_LABEL.test(label))
  ) {
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
