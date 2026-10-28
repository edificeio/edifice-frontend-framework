/** A content published by Édumalin, as relayed by app-registry. */
export interface EdumalinItem {
  title: string;
  description?: string;
  picture?: string;
  type?: { name: string };
  /** Webinar date and time. */
  dateTime?: string;
  /** Webinar duration, in minutes. */
  duration?: number;
  /** RDV location, as a Google Maps URL. */
  googleMap?: string;
  buttonLink?: string;
  buttonTitle?: string;
}

export type EdumalinStatus =
  | 'loading'
  | 'default'
  | 'empty'
  | 'connectionError'
  | 'loadError';

export interface EdumalinError {
  code: number;
  message: string;
}

export const EDUMALIN_TYPES = [
  'webinar',
  'announcement',
  'news',
  'rdv',
  'testimonial',
  'replay',
  'podcast',
  'tutorial',
  'other',
] as const;

export type EdumalinType = (typeof EDUMALIN_TYPES)[number];
