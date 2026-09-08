import { School, odeServices } from '@edifice.io/client';
import { queryOptions, useQuery } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import useDate from '../../../../hooks/useDate/useDate';
import { useUserSchools } from '../SchoolSpace/useUserSchools';
import { BriefMeArticle, BriefMeStatus } from './BriefMe';

/**
 * Brief.me feeds are proxied and cached by app-registry, one endpoint per
 * category. Keys match the SegmentedControl option values of `BriefMe`.
 */
const BRIEFME_ENDPOINTS = {
  'briefme': '/appregistry/widget/cache/external/briefme',
  'brief-eco': '/appregistry/widget/cache/external/briefeco',
  'brief-science': '/appregistry/widget/cache/external/briefscience',
} as const;

export type BriefMeCategory = keyof typeof BRIEFME_ENDPOINTS;

export const BRIEFME_DEFAULT_CATEGORY: BriefMeCategory = 'briefme';

export interface BriefMeEntry {
  title: string;
  published_at: string;
  url: string;
}

export interface BriefMeFeed {
  results?: BriefMeEntry[];
  error?: string;
}

/**
 * Article URLs served by Brief.me embed the literal `ID_ETAB` and `ID_ENT`
 * placeholders, which identify the subscribing school to their SSO. Both are
 * replaced by base64-encoded values: the school UAI, and the GAR code taken
 * from its exports.
 */
export function buildGarLink(url: string, school?: School): string {
  const schoolExports = school?.exports ?? [];
  const garExport = schoolExports.find((entry) => entry.startsWith('GAR-'));
  const garCode = garExport
    ? garExport.replace('GAR-', '')
    : (schoolExports[0] ?? '');

  return url
    .replace('ID_ETAB', btoa(school?.UAI ?? ''))
    .replace('ID_ENT', btoa(garCode));
}

export function briefMeQueryOptions(category: BriefMeCategory) {
  return queryOptions({
    queryKey: ['briefme', category],
    queryFn: async () => {
      const http = odeServices.http();
      const feed = await http.get<BriefMeFeed>(BRIEFME_ENDPOINTS[category]);

      if (http.isResponseError()) {
        throw new Error(http.latestResponse.statusText);
      }
      // The app-registry cache reports its own failures as HTTP 200 responses
      // carrying an `error` key, so the body has to be validated as well.
      if (!feed || feed.error || !Array.isArray(feed.results)) {
        throw new Error(feed?.error ?? 'briefme.invalid.response');
      }
      return feed.results;
    },
  });
}

/**
 * Loads the Brief.me articles of the selected category, and resolves their
 * links against the school currently selected by the user.
 */
export function useBriefMe() {
  const [category, setCategory] = useState<BriefMeCategory>(
    BRIEFME_DEFAULT_CATEGORY,
  );
  const { selectedSchool } = useUserSchools();
  const { formatDate } = useDate();

  const { data, isLoading, error } = useQuery(briefMeQueryOptions(category));

  const articles = useMemo<BriefMeArticle[]>(
    () =>
      (data ?? []).map((entry) => ({
        id: entry.url,
        date: formatDate(entry.published_at, 'long'),
        title: entry.title,
        url: buildGarLink(entry.url, selectedSchool),
      })),
    [data, selectedSchool, formatDate],
  );

  const status: BriefMeStatus = error
    ? 'error'
    : isLoading
      ? 'loading'
      : articles.length > 0
        ? 'default'
        : 'empty';

  return { category, setCategory, articles, status };
}
