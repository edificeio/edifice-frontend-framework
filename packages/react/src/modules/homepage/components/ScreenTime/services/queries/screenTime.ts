import { queryOptions, useQuery } from '@tanstack/react-query';
import { screenTimeService } from '../api';
import { isNotFoundError } from '../api/screenTimeService';

const STALE_TIME = 5 * 60 * 1000; // 5 minutes

// "No data" won't change by retrying.
const retryUnlessNotFound = (failureCount: number, error: Error) =>
  !isNotFoundError(error) && failureCount < 3;

export const screenTimeQueryKeys = {
  all: () => ['screen-time'] as const,
  daily: (kidId: string, date: string) =>
    [...screenTimeQueryKeys.all(), 'daily', kidId, date] as const,
  weekly: (kidId: string, startDate: string, endDate: string) =>
    [
      ...screenTimeQueryKeys.all(),
      'weekly',
      kidId,
      startDate,
      endDate,
    ] as const,
};

export const screenTimeQueryOptions = {
  getDaily(kidId: string, date: string) {
    return queryOptions({
      queryKey: screenTimeQueryKeys.daily(kidId, date),
      queryFn: () => screenTimeService.getDaily(kidId, date),
      staleTime: STALE_TIME,
      retry: retryUnlessNotFound,
    });
  },
  getWeekly(kidId: string, startDate: string, endDate: string) {
    return queryOptions({
      queryKey: screenTimeQueryKeys.weekly(kidId, startDate, endDate),
      queryFn: () => screenTimeService.getWeekly(kidId, startDate, endDate),
      staleTime: STALE_TIME,
      retry: retryUnlessNotFound,
    });
  },
};

export const useDailyScreenTime = (
  kidId: string | undefined,
  date: string,
  { enabled = true } = {},
) => {
  return useQuery({
    ...screenTimeQueryOptions.getDaily(kidId ?? '', date),
    enabled: enabled && !!kidId,
  });
};

export const useWeeklyScreenTime = (
  kidId: string | undefined,
  startDate: string,
  endDate: string,
  { enabled = true } = {},
) => {
  return useQuery({
    ...screenTimeQueryOptions.getWeekly(kidId ?? '', startDate, endDate),
    enabled: enabled && !!kidId,
  });
};
