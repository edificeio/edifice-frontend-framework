import { NotificationSummary } from '@edifice.io/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import { renderHook, waitFor } from '~/setup';
import { MAX_NOTIFICATIONS_SINCE } from '../useTimelineNotificationsSince';
import { countNotifications } from './countNotifications';
import useTimelineNotificationCount from './useTimelineNotificationCount';

const { getNotificationsSince } = vi.hoisted(() => ({
  getNotificationsSince: vi.fn(),
}));

vi.mock('@edifice.io/client', () => ({
  odeServices: { timeline: () => ({ getNotificationsSince }) },
}));

const at = (hours: number) => new Date(2026, 10, 20, hours);

const notification = (
  overrides: Partial<NotificationSummary>,
): NotificationSummary => ({
  '_id': Math.random().toString(36),
  'type': 'BLOG',
  'event-type': 'POST-PUBLISH',
  'date': { $date: at(10).toISOString() },
  ...overrides,
});

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

describe('countNotifications', () => {
  const notifications = [
    notification({ 'resource': 'blog1', 'sub-resource': 'post1' }),
    notification({ 'resource': 'blog1', 'sub-resource': 'post2' }),
    notification({
      'resource': 'blog1',
      'sub-resource': 'post2',
      'event-type': 'POST-UPDATE',
    }),
    notification({ resource: 'blog2' }),
    notification({ type: 'NEWS', resource: 'blog1' }),
  ];

  it('counts by resource, with 0 for ids without notification', () => {
    expect(
      countNotifications(notifications, {
        type: 'BLOG',
        resourceIds: ['blog1', 'blog2', 'blog3'],
      }),
    ).toEqual({ blog1: 3, blog2: 1, blog3: 0 });
  });

  it('counts by sub-resource', () => {
    expect(
      countNotifications(notifications, {
        type: 'BLOG',
        resourceIds: ['post1', 'post2'],
        groupBy: 'sub-resource',
      }),
    ).toEqual({ post1: 1, post2: 2 });
  });

  it('only counts the requested event types', () => {
    expect(
      countNotifications(notifications, {
        type: 'BLOG',
        resourceIds: ['post2'],
        groupBy: 'sub-resource',
        eventTypes: ['POST-UPDATE'],
      }),
    ).toEqual({ post2: 1 });
  });
});

describe('useTimelineNotificationCount', () => {
  beforeEach(() => {
    getNotificationsSince.mockReset();
  });

  it('counts the notifications received since the date', async () => {
    getNotificationsSince.mockResolvedValue([
      notification({
        resource: 'blog1',
        date: { $date: at(12).toISOString() },
      }),
      notification({ resource: 'blog1', date: { $date: at(8).toISOString() } }),
    ]);

    const { result } = renderHook(
      () =>
        useTimelineNotificationCount({
          since: at(9),
          type: 'BLOG',
          resourceIds: ['blog1', 'blog2'],
        }),
      { wrapper: createWrapper() },
    );

    await waitFor(() =>
      expect(result.current.counts).toEqual({ blog1: 1, blog2: 0 }),
    );
    expect(result.current.isTruncated).toBe(false);
  });

  it('shares a single backend call between different counts', async () => {
    getNotificationsSince.mockResolvedValue([
      notification({ 'resource': 'blog1', 'sub-resource': 'post1' }),
    ]);

    const { result } = renderHook(
      () => ({
        blogs: useTimelineNotificationCount({
          since: at(9),
          type: 'BLOG',
          resourceIds: ['blog1'],
        }),
        posts: useTimelineNotificationCount({
          since: at(7),
          type: 'BLOG',
          resourceIds: ['post1'],
          groupBy: 'sub-resource',
        }),
      }),
      { wrapper: createWrapper() },
    );

    await waitFor(() => expect(result.current.posts.counts.post1).toBe(1));
    expect(result.current.blogs.counts.blog1).toBe(1);
    expect(getNotificationsSince).toHaveBeenCalledTimes(1);
  });

  it('keeps the same counts object across renders with inline arrays', async () => {
    getNotificationsSince.mockResolvedValue([]);

    const { result, rerender } = renderHook(
      () =>
        useTimelineNotificationCount({
          since: at(9),
          type: 'BLOG',
          resourceIds: ['blog1'],
        }),
      { wrapper: createWrapper() },
    );

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    const { counts } = result.current;
    rerender();
    expect(result.current.counts).toBe(counts);
  });

  it('resets the counts once the date is removed', async () => {
    getNotificationsSince.mockResolvedValue([
      notification({
        resource: 'blog1',
        date: { $date: at(12).toISOString() },
      }),
    ]);

    const { result, rerender } = renderHook(
      ({ since }: { since: Date | undefined }) =>
        useTimelineNotificationCount({
          since,
          type: 'BLOG',
          resourceIds: ['blog1'],
        }),
      { wrapper: createWrapper(), initialProps: { since: at(9) } },
    );

    await waitFor(() => expect(result.current.counts.blog1).toBe(1));
    rerender({ since: undefined });
    expect(result.current.counts).toEqual({ blog1: 0 });
  });

  it('flags partial counts when the backend cap is reached', async () => {
    getNotificationsSince.mockResolvedValue(
      Array.from({ length: MAX_NOTIFICATIONS_SINCE }, () =>
        notification({
          resource: 'blog1',
          date: { $date: at(12).toISOString() },
        }),
      ),
    );

    const { result } = renderHook(
      () =>
        useTimelineNotificationCount({
          since: at(9),
          type: 'BLOG',
          resourceIds: ['blog1'],
        }),
      { wrapper: createWrapper() },
    );

    await waitFor(() => expect(result.current.isTruncated).toBe(true));
  });
});
