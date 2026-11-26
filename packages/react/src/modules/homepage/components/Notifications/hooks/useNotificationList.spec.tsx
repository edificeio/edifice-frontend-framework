import { NotificationModel } from '@edifice.io/client';
import { act, renderHook } from '~/setup';
import {
  DELETE_PENDING_NOTIFICATION_TYPES,
  useHasNotificationToday,
  useNotificationListContainer,
} from './useNotificationList';

const {
  useNotifications,
  useNotificationTypes,
  useTimelinePreference,
  useSaveTimelinePreference,
  useUser,
} = vi.hoisted(() => ({
  useUser: vi.fn(),
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

vi.mock('../../../../../hooks', async (importOriginal) => ({
  ...(await importOriginal<typeof import('../../../../../hooks')>()),
  useUser,
  useDate: () => ({ dateIsToday: () => false }),
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
  preferredTypes,
  deletePending = false,
}: {
  types?: string[];
  typesLoading?: boolean;
  typesFetched?: boolean;
  typesError?: Error | null;
  notifications?: NotificationModel[];
  notificationsLoading?: boolean;
  notificationsError?: Error | null;
  hasNextPage?: boolean;
  preferredTypes?: string[];
  deletePending?: boolean;
} = {}) {
  const fetchNextPage = vi.fn();
  const saveTimelinePreference = vi.fn();

  useUser.mockReturnValue({ user: { deletePending } });

  // No saved preference by default — selectedTypes falls back to
  // notificationTypes.
  useTimelinePreference.mockReturnValue({
    data: preferredTypes ? { type: preferredTypes } : undefined,
    isFetched: true,
  });
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
    saveTimelinePreference,
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

  describe('type filter', () => {
    it('fetches the saved preferred types', () => {
      setup({ types: ['BLOG', 'NEWS'], preferredTypes: ['NEWS'] });

      expect(useNotifications).toHaveBeenLastCalledWith(['NEWS'], true);
    });

    it('keeps an empty saved selection instead of falling back to every type', () => {
      const { result } = setup({
        types: ['BLOG', 'NEWS'],
        preferredTypes: [],
      });

      expect(result.current.selectedTypes).toEqual([]);
    });

    it('does not query and exposes no notification when no type is selected', () => {
      const { result } = setup({
        types: ['BLOG', 'NEWS'],
        preferredTypes: [],
        notifications: [notification('n1')],
        hasNextPage: true,
      });

      expect(useNotifications).toHaveBeenLastCalledWith([], false);
      expect(result.current.notifications).toEqual([]);
      expect(result.current.hasNextPage).toBe(false);
    });

    it('stops querying once the user deselects every type', () => {
      const { result, rerender } = setup({
        types: ['BLOG', 'NEWS'],
        notifications: [notification('n1')],
      });

      act(() => result.current.setSelectedTypes([]));
      rerender();

      expect(useNotifications).toHaveBeenLastCalledWith([], false);
      expect(result.current.notifications).toEqual([]);
    });
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

    it('is true while the saved filter is not read yet', () => {
      useUser.mockReturnValue({ user: { deletePending: false } });
      useTimelinePreference.mockReturnValue({
        data: undefined,
        isFetched: false,
      });
      useSaveTimelinePreference.mockReturnValue({ mutate: vi.fn() });
      useNotificationTypes.mockReturnValue({
        data: ['BLOG'],
        isLoading: false,
        isFetched: true,
        error: null,
      });
      useNotifications.mockReturnValue({
        data: undefined,
        isLoading: false,
        error: null,
      });

      const { result } = renderHook(() => useNotificationListContainer());

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

  it('lets the user manage notifications', () => {
    const { result } = setup({ types: ['BLOG'] });

    expect(result.current.canManageNotifications).toBe(true);
  });

  it('saves the selected types as the user preference', () => {
    const { result, saveTimelinePreference } = setup({
      types: ['BLOG', 'NEWS'],
    });

    act(() => result.current.setSelectedTypes(['BLOG']));

    expect(saveTimelinePreference).toHaveBeenCalledWith({ type: ['BLOG'] });
  });

  describe('when the user account is pending deletion', () => {
    it('only exposes the ARCHIVE and NEWS types', () => {
      const { result } = setup({
        deletePending: true,
        types: ['BLOG', 'NEWS', 'MESSAGERIE'],
      });

      expect(result.current.notificationTypes).toEqual(['ARCHIVE', 'NEWS']);
    });

    it('fetches both types, ignoring the saved preference', () => {
      const { result } = setup({
        deletePending: true,
        types: ['BLOG', 'NEWS'],
        preferredTypes: ['BLOG'],
      });

      expect(result.current.selectedTypes).toEqual(['ARCHIVE', 'NEWS']);
      expect(useNotifications).toHaveBeenLastCalledWith(
        ['ARCHIVE', 'NEWS'],
        true,
      );
    });

    it('does not wait for the platform types', () => {
      const { result } = setup({
        deletePending: true,
        types: undefined,
        typesLoading: true,
        typesFetched: false,
      });

      expect(useNotifications).toHaveBeenLastCalledWith(
        ['ARCHIVE', 'NEWS'],
        true,
      );
      expect(result.current.isLoading).toBe(false);
    });

    it('does not save the selected types as the user preference', () => {
      const { result, saveTimelinePreference } = setup({
        deletePending: true,
      });

      act(() => result.current.setSelectedTypes(['NEWS']));

      expect(result.current.selectedTypes).toEqual(['NEWS']);
      expect(saveTimelinePreference).not.toHaveBeenCalled();
    });

    it('prevents the user from managing notifications', () => {
      const { result } = setup({ deletePending: true });

      expect(result.current.canManageNotifications).toBe(false);
    });
  });
});

describe('useHasNotificationToday', () => {
  function setupToday(deletePending: boolean) {
    useUser.mockReturnValue({ user: { deletePending } });
    useNotificationTypes.mockReturnValue({
      data: ['BLOG', 'NEWS'],
      isFetched: true,
    });
    useNotifications.mockReturnValue({ data: [] });
    renderHook(() => useHasNotificationToday());
  }

  it('checks every platform type', () => {
    setupToday(false);

    expect(useNotifications).toHaveBeenLastCalledWith(['BLOG', 'NEWS'], true);
  });

  it('only checks the ARCHIVE and NEWS types for a user pending deletion', () => {
    setupToday(true);

    expect(useNotifications).toHaveBeenLastCalledWith(
      DELETE_PENDING_NOTIFICATION_TYPES,
      true,
    );
  });
});
