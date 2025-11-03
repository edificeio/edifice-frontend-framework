import { InvalidateQueryFilters, QueryClient } from '@tanstack/react-query';

/**
 * Invalidates queries and resets infinite query data to only contain the first page.
 *
 * This utility function is useful when you want to invalidate a query but also ensure
 * that any infinite query data is reset to show only the first page, removing any
 * previously loaded subsequent pages.
 *
 * @param queryClient - The TanStack Query client instance used to manage queries
 * @param options - The invalidate query filters that specify which queries to invalidate
 * @returns The result of the invalidateQueries operation, or undefined if no queryKey is provided
 *
 * @example
 * ```typescript
 * // Invalidate user queries and reset to first page only
 * invalidateQueriesWithFirstPage(queryClient, {
 *   queryKey: ['users']
 * });
 * ```
 */
export function invalidateQueriesWithFirstPage(
  queryClient: QueryClient,
  options: InvalidateQueryFilters,
) {
  if (!options.queryKey) return;

  queryClient.setQueriesData({ queryKey: options.queryKey }, (oldData: any) => {
    if (!oldData?.pages) return oldData;
    return {
      ...oldData,
      pages: [oldData.pages[0]],
      pageParams: [oldData.pageParams[0]],
    };
  });

  return queryClient.invalidateQueries(options);
}
