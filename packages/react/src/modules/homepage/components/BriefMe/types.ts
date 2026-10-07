export interface BriefMeArticle {
  id: string;
  date: string;
  title: string;
  url: string;
}

export type BriefMeStatus = 'loading' | 'default' | 'empty' | 'error';

/**
 * Brief.me feeds are proxied and cached by app-registry, one endpoint per
 * category. Keys match the SegmentedControl option values of `BriefMe`.
 */
export const BRIEFME_ENDPOINTS = {
  'briefme': '/appregistry/widget/cache/external/briefme',
  'brief-eco': '/appregistry/widget/cache/external/briefeco',
  'brief-science': '/appregistry/widget/cache/external/briefscience',
} as const;

export type BriefMeCategory = keyof typeof BRIEFME_ENDPOINTS;
