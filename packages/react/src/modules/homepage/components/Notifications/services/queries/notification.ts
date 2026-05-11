import { NotificationModel } from '@edifice.io/client';
import { queryOptions, useQuery } from '@tanstack/react-query';
import { notificationService } from '../api';

export const notificationQueryKeys = {
  all: () => ['notifications'] as const,
};

export const notificationQueryOptions = {
  getNotifications(types: string[], page: number = 0) {
    return queryOptions({
      queryKey: notificationQueryKeys.all(),
      queryFn: async (): Promise<NotificationModel[]> =>
        notificationService.getNotifications(types, page),
    });
  },
};

export const useNotifications = (types: string[] = [], page: number = 0) => {
  return useQuery(notificationQueryOptions.getNotifications(types, page));
};
