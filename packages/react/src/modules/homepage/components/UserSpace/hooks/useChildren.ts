import { Child, odeServices } from '@edifice.io/client';
import { queryOptions, useQuery } from '@tanstack/react-query';

export const childrenQueryKeys = {
  all: (userId: string) => ['children', userId] as const,
};

export const childrenQueryOptions = (
  userId: string | undefined,
  enabled: boolean,
) =>
  queryOptions({
    queryKey: childrenQueryKeys.all(userId ?? ''),
    queryFn: () => odeServices.directory().getChildren(userId as string),
    enabled: enabled && !!userId,
  });

/** Fetches the children of a "Relative" user, including their classes. */
export function useChildren(userId: string | undefined, enabled: boolean) {
  return useQuery<Child[]>(childrenQueryOptions(userId, enabled));
}
