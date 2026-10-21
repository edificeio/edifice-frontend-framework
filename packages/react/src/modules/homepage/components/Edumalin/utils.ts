import { EdumalinError, EdumalinType } from './types';

/** Error code sent by app-registry when it cannot authenticate to Édumalin. */
export const EDUMALIN_UNAUTHORIZED = 'edumalin.widget.unauthorized';

/**
 * app-registry wraps every failure in `{ error: <string> }`. That string is
 * either a plain message or a JSON payload (its own error code, or the error
 * Édumalin returned), in which case its `message`, then `error`, is shown.
 * Any other body (network failure, proxy error page…) shows the status text.
 */
export function parseEdumalinError(
  body: unknown,
  { status, statusText }: { status: number; statusText: string },
): EdumalinError {
  const raw =
    typeof body === 'object' && body !== null && 'error' in body
      ? body.error
      : undefined;
  if (typeof raw !== 'string') return { code: status, message: statusText };

  try {
    const payload = JSON.parse(raw);
    return {
      code: status,
      message: String(payload.message ?? payload.error ?? raw),
    };
  } catch {
    return { code: status, message: raw };
  }
}

const TYPE_BY_NAME: Record<string, EdumalinType> = {
  webinaire: 'webinar',
  annonce: 'announcement',
  actualite: 'news',
  rdv: 'rdv',
  temoignage: 'testimonial',
  replay: 'replay',
  podcast: 'podcast',
  tutoriel: 'tutorial',
};

/**
 * Édumalin type names aren't normalized (e.g. "Temoignage" without accent),
 * so they are matched ignoring case and accents. Unknown types are "other".
 */
export function getEdumalinType(name?: string): EdumalinType {
  const key = (name ?? '')
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase();
  return TYPE_BY_NAME[key] ?? 'other';
}

/** Only absolute http(s) URLs coming from Édumalin are trusted. */
export function isHttpUrl(url?: string): url is string {
  return !!url && /^https?:\/\//.test(url);
}

export function getPictureUrl(picture?: string): string | undefined {
  return isHttpUrl(picture) ? encodeURI(picture) : undefined;
}
