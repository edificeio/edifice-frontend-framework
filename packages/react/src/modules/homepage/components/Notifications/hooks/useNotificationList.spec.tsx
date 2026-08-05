import { NotificationModel } from '@edifice.io/client';
import { renderHook } from '~/setup';
import { useNotificationListContainer } from './useNotificationList';

const {
  useNotifications,
  useNotificationTypes,
  useTimelinePreference,
  useSaveTimelinePreference,
} = vi.hoisted(() => ({
  useNotifications: vi.fn(),
  useNotificationTypes: vi.fn(),
  useTimelinePreference: vi.fn(),
  useSaveTimelinePreference: vi.fn(),
}));

vi.mock('../services/queries/notification', () => ({
  useNotifications,
  useNotificationTypes,
  useTimelinePreference,
  useSaveTimelinePreference,
}));

const notification = (id: string) =>
  ({ _id: id }) as unknown as NotificationModel;

function setup({
  types,
  typesLoading = false,
  typesFetched = true,
  typesError = null,
  notifications,
  notificationsLoading = false,
  notificationsError = null,
  hasNextPage = false,
}: {
  types?: string[];
  typesLoading?: boolean;
  typesFetched?: boolean;
  typesError?: Error | null;
  notifications?: NotificationModel[];
  notificationsLoading?: boolean;
  notificationsError?: Error | null;
  hasNextPage?: boolean;
} = {}) {
  const fetchNextPage = vi.fn();
  const saveTimelinePreference = vi.fn();

  // No saved preference by default — selectedTypes falls back to
  // notificationTypes, matching this suite's existing expectations. Not
  // under test here (added alongside the type filter): see
  // useNotificationList.ts.
  useTimelinePreference.mockReturnValue({ data: undefined, isFetched: true });
  useSaveTimelinePreference.mockReturnValue({
    mutate: saveTimelinePreference,
  });

  useNotificationTypes.mockReturnValue({
    data: types,
    isLoading: typesLoading,
    isFetched: typesFetched,
    error: typesError,
  });
  useNotifications.mockReturnValue({
    data: notifications,
    hasNextPage,
    isLoading: notificationsLoading,
    error: notificationsError,
    fetchNextPage,
  });

  return {
    ...renderHook(() => useNotificationListContainer()),
    fetchNextPage,
  };
}

describe('useNotificationListContainer', () => {
  it('exposes the notifications and their types', () => {
    const { result } = setup({
      types: ['BLOG'],
      notifications: [notification('n1')],
      hasNextPage: true,
    });

    expect(result.current.notificationTypes).toEqual(['BLOG']);
    expect(result.current.notifications).toEqual([notification('n1')]);
    expect(result.current.hasNextPage).toBe(true);
  });

  it('waits for the types before enabling the notification query', () => {
    setup({ types: undefined, typesFetched: false });

    expect(useNotifications).toHaveBeenCalledWith([], false);
  });

  it('enables the notification query once the types are fetched', () => {
    setup({ types: ['BLOG', 'NEWS'] });

    expect(useNotifications).toHaveBeenCalledWith(['BLOG', 'NEWS'], true);
  });

  it('keeps the query disabled when the fetch returned no type', () => {
    setup({ types: undefined, typesFetched: true });

    expect(useNotifications).toHaveBeenCalledWith([], false);
  });

  it('loads the next page on demand', () => {
    const { result, fetchNextPage } = setup({ types: ['BLOG'] });

    result.current.loadNextPage();

    expect(fetchNextPage).toHaveBeenCalledTimes(1);
  });

  describe('loading state', () => {
    it('is true while the types are loading', () => {
      const { result } = setup({ typesLoading: true });

      expect(result.current.isLoading).toBe(true);
    });

    it('is true while the notifications are loading', () => {
      const { result } = setup({
        types: ['BLOG'],
        notificationsLoading: true,
      });

      expect(result.current.isLoading).toBe(true);
    });

    it('is false once both queries settled', () => {
      const { result } = setup({ types: ['BLOG'] });

      expect(result.current.isLoading).toBe(false);
    });
  });

  describe('error state', () => {
    it('surfaces the type query error first', () => {
      const typesError = new Error('types down');
      const { result } = setup({
        typesError,
        notificationsError: new Error('notifications down'),
      });

      expect(result.current.error).toBe(typesError);
    });

    it('surfaces the notification query error', () => {
      const notificationsError = new Error('notifications down');
      const { result } = setup({ types: ['BLOG'], notificationsError });

      expect(result.current.error).toBe(notificationsError);
    });

    it('is null without any error', () => {
      const { result } = setup({ types: ['BLOG'] });

      expect(result.current.error).toBeNull();
    });
  });
});
