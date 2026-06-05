import { IFlashMessageModel } from '@edifice.io/client';
import {
  queryOptions,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { messageFlashService } from '..';

export const messagesFlashQueryKeys = {
  all: () => ['messagesFlash'] as const,
};

/**
 * Provides query options for config-related operations.
 */
export const messagesFlashQueryOptions = {
  getMessagesFlash() {
    return queryOptions({
      queryKey: messagesFlashQueryKeys.all(),
      queryFn: async (): Promise<IFlashMessageModel[]> =>
        messageFlashService.getMessagesFlash(),
    });
  },
};

export const useMessagesFlash = () => {
  return useQuery(messagesFlashQueryOptions.getMessagesFlash());
};

export const useMarkAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (message: IFlashMessageModel) =>
      messageFlashService.markAsRead(message),
    onMutate: async (message) => {
      // Optimistic update
      queryClient.setQueryData(
        messagesFlashQueryKeys.all(),
        (oldMessages: IFlashMessageModel[]) => {
          oldMessages.filter((msg) => msg.id !== message.id);
        },
      );
    },
    onError(error, variables, onMutateResult, context) {
      queryClient.invalidateQueries({ queryKey: messagesFlashQueryKeys.all() });
    },
  });
};
