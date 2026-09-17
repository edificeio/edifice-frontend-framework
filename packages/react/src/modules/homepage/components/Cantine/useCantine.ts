import { odeServices } from '@edifice.io/client';
import { queryOptions, useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { useMemo } from 'react';
import { useUserSchools } from '../SchoolSpace/useUserSchools';

export type CantineCategory =
  | 'entree'
  | 'plat'
  | 'accompagnement'
  | 'laitage'
  | 'dessert';

/**
 * Fixed rendering order for menu categories, matching the Figma design.
 * Any other `type` value returned by the upstream API is dropped.
 */
const CANTINE_CATEGORIES: CantineCategory[] = [
  'entree',
  'plat',
  'accompagnement',
  'laitage',
  'dessert',
];

export type CantineStatus = 'loading' | 'default' | 'empty' | 'error';

/**
 * Raw dish shape returned by the Webgerest upstream API, forwarded unmapped by
 * app-registry. Everything besides `type` and `nom` is effectively optional.
 */
export interface CantineMenuItem {
  type: string;
  nom: string;
  designationMenu?: string;
  vegetarien?: boolean;
  faitmaison?: boolean;
  bio?: boolean;
  local?: boolean;
  [key: string]: unknown; // allerg_gluten, allerg_fruits_a_coque…
}

interface CantineMenuResponse {
  menu?: CantineMenuItem[];
  dinnerAvailable?: boolean;
  dinnerMenu?: CantineMenuItem[];
}

export interface CantineDish {
  id: string;
  label: string;
  vegetarien: boolean;
  faitmaison: boolean;
  bio: boolean;
  local: boolean;
  allergens: string[];
}

export interface CantineSection {
  category: CantineCategory;
  items: CantineDish[];
}

/**
 * Allergen keys are dynamic (`allerg_gluten`, `allerg_fruits_a_coque`…), so
 * this builds the list from the item's own keys instead of a fixed schema.
 * Every underscore becomes a space (the legacy widget only replaced the
 * first one, yielding labels like "fruits a_coque").
 */
function getAllergens(item: CantineMenuItem): string[] {
  return Object.keys(item)
    .filter(
      (key) =>
        key.startsWith('allerg_') && item[key] !== 0 && item[key] !== undefined,
    )
    .map((key) => key.slice('allerg_'.length).replace(/_/g, ' '));
}

function normalizeDish(item: CantineMenuItem, index: number): CantineDish {
  const designation = item.designationMenu?.trim();
  return {
    id: `${item.type}-${index}`,
    label: designation || item.nom,
    vegetarien: Boolean(item.vegetarien),
    faitmaison: Boolean(item.faitmaison),
    bio: Boolean(item.bio),
    local: Boolean(item.local),
    allergens: getAllergens(item),
  };
}

function buildSections(menu: CantineMenuItem[]): CantineSection[] {
  return CANTINE_CATEGORIES.map((category) => ({
    category,
    items: menu
      .filter((item) => item.type === category)
      .map((item, index) => normalizeDish(item, index)),
  })).filter((section) => section.items.length > 0);
}

export function cantineMenuQueryOptions(uai: string, date: string) {
  return queryOptions({
    queryKey: ['cantine', uai, date],
    enabled: Boolean(uai),
    // The menu is keyed by day and proxied from a slow upstream service, so
    // this caches it for 5 minutes instead of refetching on every remount.
    staleTime: 5 * 60 * 1000, // 5 minutes
    queryFn: async () => {
      const http = odeServices.http();
      uai = '0770038Y';
      const body = await http.get<CantineMenuResponse>(
        `/appregistry/${encodeURIComponent(uai)}/cantine/menu?date=${date}`,
      );

      if (http.isResponseError()) {
        throw new Error(http.latestResponse.statusText);
      }
      // The date-limit guard answers HTTP 200 with the raw Webgerest empty
      // envelope ({error, nbObjet, contenu}) instead of the normal
      // {menu, dinnerAvailable, …} shape, so this checks `menu` is actually
      // an array before returning it.
      return Array.isArray(body?.menu) ? body.menu : [];
    },
  });
}

/**
 * `loading` also covers "no school selected yet". The school comes from the
 * session, so an absent UAI leaves `enabled: false` and the query never
 * starts.
 */
function getStatus({
  hasError,
  isReady,
  hasSections,
}: {
  hasError: boolean;
  isReady: boolean;
  hasSections: boolean;
}): CantineStatus {
  if (hasError) return 'error';
  if (!isReady) return 'loading';
  return hasSections ? 'default' : 'empty';
}

/**
 * Loads today's canteen menu for the school currently selected by the user
 * (see `useUserSchools`), and groups its dishes by category.
 *
 * Only lunch is exposed. The design has no lunch/dinner toggle, unlike the
 * legacy AngularJS widget.
 */
export function useCantine() {
  const { selectedSchool } = useUserSchools();
  const uai = selectedSchool?.UAI ?? '';
  const date = dayjs().format('YYYY-MM-DD');

  const { data, isPending, error } = useQuery(
    cantineMenuQueryOptions(uai, date),
  );

  const sections = useMemo(() => buildSections(data ?? []), [data]);

  const status = getStatus({
    hasError: Boolean(error),
    isReady: Boolean(uai) && !isPending,
    hasSections: sections.length > 0,
  });

  return { sections, status };
}
