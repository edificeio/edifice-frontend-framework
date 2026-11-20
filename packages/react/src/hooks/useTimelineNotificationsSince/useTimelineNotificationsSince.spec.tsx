import { NotificationSummary } from '@edifice.io/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import { renderHook, waitFor } from '~/setup';
import {
  getDayAnchor,
  MAX_NOTIFICATIONS_SINCE,
  selectNotificationsSince,
} from './timelineNotificationsSince';
import useTimelineNotificationsSince from './useTimelineNotificationsSince';

const { getNotificationsSince } = vi.hoisted(() => ({
  getNotificationsSince: vi.fn(),
}));

vi.mock('@edifice.io/client', () => ({
  odeServices: { timeline: () => ({ getNotificationsSince }) },
}));

const notification = (id: string, date: Date): NotificationSummary => ({
  '_id': id,
  'type': 'MESSAGERIE',
  'event-type': 'SEND-MESSAGE',
  'resource': `resource-${id}`,
  'date': { $date: date.toISOString() },
});

/** Local dates, so that the day anchor does not depend on the test timezone. */
const at = (day: number, hours: number, minutes = 0) =>
  new Date(2026, 10, day, hours, minutes);

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

describe('selectNotificationsSince', () => {
  it('keeps only notifications received since the exact date', () => {
    const results = [
      notification('n2', at(20, 10)),
      notification('n1', at(20, 8)),
    ];

    expect(selectNotificationsSince(results, at(20, 9))).toEqual({
      notifications: [results[0]],
      isTruncated: false,
    });
  });

  it('is truncated when the cap is reached before the requested date', () => {
    const results = Array.from({ length: MAX_NOTIFICATIONS_SINCE }, (_, i) =>
      notification(`n${i}`, at(20, 12)),
    );

    expect(selectNotificationsSince(results, at(20, 9)).isTruncated).toBe(true);
  });

  it('is not truncated when the capped results cover the requested date', () => {
    const results = Array.from({ length: MAX_NOTIFICATIONS_SINCE }, (_, i) =>
      notification(`n${i}`, at(20, 8)),
    );
    results[0] = notification('recent', at(20, 12));

    expect(selectNotificationsSince(results, at(20, 10)).isTruncated).toBe(
      false,
    );
  });
});

describe('useTimelineNotificationsSince', () => {
  beforeEach(() => {
    getNotificationsSince.mockReset();
  });

  it('queries from the start of the day, without error notifications', async () => {
    getNotificationsSince.mockResolvedValue([]);

    const { result } = renderHook(
      () => useTimelineNotificationsSince(at(20, 9, 37)),
      { wrapper: createWrapper() },
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(getNotificationsSince).toHaveBeenCalledWith(
      getDayAnchor(at(20, 9, 37)),
      { disableNotifications: true },
    );
  });

  it('narrows the results to the exact date', async () => {
    getNotificationsSince.mockResolvedValue([
      notification('n2', at(20, 10)),
      notification('n1', at(20, 8)),
    ]);

    const { result } = renderHook(
      () => useTimelineNotificationsSince(at(20, 9)),
      { wrapper: createWrapper() },
    );

    await waitFor(() =>
      expect(result.current.data?.notifications.map(({ _id }) => _id)).toEqual([
        'n2',
      ]),
    );
  });

  it('shares a single backend call for every date of the same day', async () => {
    getNotificationsSince.mockResolvedValue([
      notification('n2', at(20, 10)),
      notification('n1', at(20, 8)),
    ]);

    const { result } = renderHook(
      () => ({
        morning: useTimelineNotificationsSince(at(20, 7)),
        later: useTimelineNotificationsSince(at(20, 9, 37)),
      }),
      { wrapper: createWrapper() },
    );

    await waitFor(() => expect(result.current.later.isSuccess).toBe(true));
    expect(getNotificationsSince).toHaveBeenCalledTimes(1);
    expect(result.current.morning.data?.notifications).toHaveLength(2);
    expect(result.current.later.data?.notifications).toHaveLength(1);
  });

  it('makes one backend call per day', async () => {
    getNotificationsSince.mockResolvedValue([]);

    const { result } = renderHook(
      () => ({
        yesterday: useTimelineNotificationsSince(at(19, 18)),
        today: useTimelineNotificationsSince(at(20, 9)),
      }),
      { wrapper: createWrapper() },
    );

    await waitFor(() => expect(result.current.today.isSuccess).toBe(true));
    await waitFor(() => expect(result.current.yesterday.isSuccess).toBe(true));
    expect(getNotificationsSince).toHaveBeenCalledTimes(2);
  });

  it('does not query without a date', () => {
    renderHook(() => useTimelineNotificationsSince(undefined), {
      wrapper: createWrapper(),
    });

    expect(getNotificationsSince).not.toHaveBeenCalled();
  });

  it('exposes the error without retrying', async () => {
    getNotificationsSince.mockRejectedValue(new Error('network down'));

    const { result } = renderHook(
      () => useTimelineNotificationsSince(at(20, 9)),
      { wrapper: createWrapper() },
    );

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(getNotificationsSince).toHaveBeenCalledTimes(1);
  });
});
