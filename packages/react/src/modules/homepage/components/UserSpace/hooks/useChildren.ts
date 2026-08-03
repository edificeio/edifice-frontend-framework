import { Child, odeServices, StructureChildren } from '@edifice.io/client';
import { queryOptions, useQuery } from '@tanstack/react-query';

export const childrenQueryKeys = {
  all: (userId: string) => ['children', userId] as const,
};

/** Merges children from every structure into a single deduplicated list. */
function flattenChildrenByStructure(structures: StructureChildren[]): Child[] {
  const seenIds = new Set<string>();
  return structures
    .flatMap((structure) => structure.children)
    .filter((child) => {
      if (seenIds.has(child.id)) return false;
      seenIds.add(child.id);
      return true;
    });
}

export const childrenQueryOptions = (
  userId: string | undefined,
  enabled: boolean,
) =>
  queryOptions({
    queryKey: childrenQueryKeys.all(userId ?? ''),
    queryFn: () => odeServices.directory().getChildren(userId as string),
    enabled: enabled && !!userId,
    select: flattenChildrenByStructure,
  });

/**
 * Fetches the children of a "Relative" user across all their structures,
 * merged into a single list.
 */
export function useChildren(userId: string | undefined, enabled: boolean) {
  return useQuery(childrenQueryOptions(userId, enabled));
}
