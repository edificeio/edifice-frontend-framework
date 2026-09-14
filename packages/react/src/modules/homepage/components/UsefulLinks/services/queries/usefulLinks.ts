import { UsefulLink, UsefulLinkPayload } from '@edifice.io/client';
import {
  queryOptions,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { usefulLinksService } from '../api';

export const usefulLinksQueryKeys = {
  all: () => ['usefulLinks'] as const,
};

export const usefulLinksQueryOptions = {
  getUsefulLinks() {
    return queryOptions({
      queryKey: usefulLinksQueryKeys.all(),
      queryFn: async (): Promise<UsefulLink[]> =>
        usefulLinksService.getUsefulLinks(),
    });
  },
};

export const useUsefulLinks = () => {
  return useQuery(usefulLinksQueryOptions.getUsefulLinks());
};

export const useCreateUsefulLink = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UsefulLinkPayload) =>
      usefulLinksService.createUsefulLink(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: usefulLinksQueryKeys.all() });
    },
  });
};

export const useUpdateUsefulLink = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UsefulLinkPayload }) =>
      usefulLinksService.updateUsefulLink(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: usefulLinksQueryKeys.all() });
    },
  });
};

export const useDeleteUsefulLink = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => usefulLinksService.deleteUsefulLink(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: usefulLinksQueryKeys.all() });
      const previousLinks = queryClient.getQueryData<UsefulLink[]>(
        usefulLinksQueryKeys.all(),
      );
      queryClient.setQueryData<UsefulLink[]>(
        usefulLinksQueryKeys.all(),
        (links) => links?.filter((link) => link.id !== id),
      );
      return { previousLinks };
    },
    onError: (_error, _id, context) => {
      if (context?.previousLinks) {
        queryClient.setQueryData(
          usefulLinksQueryKeys.all(),
          context.previousLinks,
        );
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: usefulLinksQueryKeys.all() });
    },
  });
};
