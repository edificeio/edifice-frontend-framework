import { NotificationModel } from '@edifice.io/client';
import {
  InfiniteData,
  infiniteQueryOptions,
  queryOptions,
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { notificationService } from '../api';

export const notificationQueryKeys = {
  all: () => ['notifications'] as const,
  notifications: (types: string[] = []) =>
    [...notificationQueryKeys.all(), 'list', types] as const,
  types: () => [...notificationQueryKeys.all(), 'types'] as const,
};

export const notificationQueryOptions = {
  getNotifications(types: string[], enabled: boolean) {
    return infiniteQueryOptions({
      queryKey: notificationQueryKeys.notifications(types),
      queryFn: ({ pageParam = 0 }) => {
        return notificationService.getNotifications(types, pageParam);
      },
      staleTime: 5 * 60 * 1000, // 5 minutes
      initialPageParam: 0,
      select(data) {
        // Filter duplicate notifications that may appear when user switch between types
        const seenIds = new Set<string>();
        const uniqueNotifications = data.pages.flat().filter((notification) => {
          if (seenIds.has(notification._id)) {
            return false;
          }
          seenIds.add(notification._id);
          return true;
        });
        return uniqueNotifications;
      },
      getNextPageParam: (
        lastPage: NotificationModel[],
        _allPages: NotificationModel[][],
        lastPageParam: number,
      ) => {
        if (lastPage?.length !== 0) {
          return lastPageParam + 1;
        }
        return undefined;
      },
      enabled,
    });
  },
  getNotificationTypes() {
    return queryOptions({
      queryKey: notificationQueryKeys.types(),
      queryFn: async (): Promise<string[]> =>
        notificationService.getNotificationTypes(),
    });
  },
};

export const useNotifications = (
  types: string[] = [],
  enabled: boolean = true,
) => {
  return useInfiniteQuery(
    notificationQueryOptions.getNotifications(types, enabled),
  );
};

export const useNotificationTypes = () => {
  return useQuery(notificationQueryOptions.getNotificationTypes());
};

export const useReportNotification = () => {
  return useMutation({
    mutationFn: (id: string) => notificationService.reportNotification(id),
  });
};

export const useDeleteNotification = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => notificationService.deleteNotification(id),
    onSuccess: (_data, id) => {
      queryClient.setQueriesData<InfiniteData<NotificationModel[]>>(
        { queryKey: [...notificationQueryKeys.all(), 'list'] },
        (data) =>
          data && {
            ...data,
            pages: data.pages.map((page) =>
              page.filter((notification) => notification._id !== id),
            ),
          },
      );
    },
  });
};
