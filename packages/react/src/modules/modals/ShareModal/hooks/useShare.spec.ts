import {
  Group,
  ShareRight,
  ShareRightAction,
  ShareRightWithVisibles,
  User,
} from '@edifice.io/client';

import { mockUser } from '../../../../providers/MockedProvider/MockedProvider.mocks';
import { act, renderHook, waitFor, wrapper } from '~/setup';
import useShare from './useShare';

const {
  getActionsForApp,
  getRightsForResource,
  saveRights,
  searchShareSubjects,
  clearCache,
} = vi.hoisted(() => ({
  getActionsForApp: vi.fn(),
  getRightsForResource: vi.fn(),
  saveRights: vi.fn(),
  searchShareSubjects: vi.fn(),
  clearCache: vi.fn(),
}));

vi.mock('@edifice.io/client', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@edifice.io/client')>();
  return {
    ...actual,
    odeServices: {
      share: () => ({
        getActionsForApp,
        getRightsForResource,
        saveRights,
        searchShareSubjects,
      }),
      cache: () => ({
        clearCache,
      }),
    },
  };
});

// Minimal ShareRightAction fixtures with a "requires" cascade:
// manage requires contrib, contrib requires read.
const readAction: ShareRightAction = { id: 'read', displayName: 'read' };
const contribAction: ShareRightAction = {
  id: 'contrib',
  displayName: 'contrib',
  requires: ['read'],
};
const manageAction: ShareRightAction = {
  id: 'manage',
  displayName: 'manage',
  requires: ['read', 'contrib'],
};

const buildShareRight = (overrides: Partial<ShareRight> = {}): ShareRight => ({
  id: 'right-1',
  type: 'user',
  displayName: 'Right 1',
  avatarUrl: '',
  directoryUrl: '',
  actions: [],
  ...overrides,
});

const buildShareRights = (
  overrides: Partial<ShareRightWithVisibles> = {},
): ShareRightWithVisibles => ({
  rights: [],
  visibleUsers: [],
  visibleGroups: [],
  visibleBookmarks: [],
  ...overrides,
});

const buildUser = (overrides: Partial<User> = {}): User => ({
  id: 'user-1',
  displayName: 'User 1',
  profile: 'Teacher',
  lastName: 'Last',
  firstName: 'First',
  login: 'user.login',
  ...overrides,
});

const buildGroup = (overrides: Partial<Group> = {}): Group => ({
  id: 'group-1',
  displayName: 'Group 1',
  ...overrides,
});

const baseProps = {
  resourceId: '',
  resourceRights: [] as string[],
  resourceCreatorId: 'creator-id',
  onSuccess: vi.fn(),
};

describe('useShare', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('mount effect', () => {
    it('does not fetch anything when resourceId is falsy', () => {
      const { result } = renderHook(() => useShare({ ...baseProps }), {
        wrapper,
      });

      expect(getActionsForApp).not.toHaveBeenCalled();
      expect(getRightsForResource).not.toHaveBeenCalled();
      expect(result.current.state.shareRightActions).toEqual([]);
    });

    it('fetches actions and rights in parallel and dispatches init', async () => {
      getActionsForApp.mockResolvedValue([readAction, contribAction]);
      getRightsForResource.mockResolvedValue(
        buildShareRights({ rights: [buildShareRight()] }),
      );
      const setIsLoading = vi.fn();

      const { result } = renderHook(
        () =>
          useShare({
            ...baseProps,
            resourceId: 'resource-1',
            setIsLoading,
          }),
        { wrapper },
      );

      await waitFor(() =>
        expect(result.current.state.shareRightActions).toHaveLength(2),
      );

      expect(getActionsForApp).toHaveBeenCalledWith('wiki', undefined);
      expect(getRightsForResource).toHaveBeenCalledWith(
        'wiki',
        'resource-1',
        undefined,
      );
      expect(result.current.state.shareRights.rights).toHaveLength(1);
      expect(setIsLoading).toHaveBeenCalledWith(false);
    });

    it('filters the fetched actions when filteredActions is provided', async () => {
      getActionsForApp.mockResolvedValue([
        readAction,
        contribAction,
        manageAction,
      ]);
      getRightsForResource.mockResolvedValue(buildShareRights());

      const { result } = renderHook(
        () =>
          useShare({
            ...baseProps,
            resourceId: 'resource-1',
            filteredActions: ['read'],
          }),
        { wrapper },
      );

      await waitFor(() =>
        expect(result.current.state.shareRightActions).toHaveLength(1),
      );
      expect(result.current.state.shareRightActions[0].id).toBe('read');
    });

    it('logs the error and does not crash when fetching fails', async () => {
      const consoleErrorSpy = vi
        .spyOn(console, 'error')
        .mockImplementation(() => undefined);
      getActionsForApp.mockResolvedValue([readAction]);
      getRightsForResource.mockRejectedValue(new Error('network error'));

      renderHook(() => useShare({ ...baseProps, resourceId: 'resource-1' }), {
        wrapper,
      });

      await waitFor(() => expect(consoleErrorSpy).toHaveBeenCalled());
    });
  });

  describe('toggleRight', () => {
    it('adds an action along with the actions it requires', () => {
      const shareRight = buildShareRight({ id: 'user-1', actions: [] });
      const { result } = renderHook(() => useShare({ ...baseProps }), {
        wrapper,
      });

      act(() => {
        result.current.dispatch({
          type: 'init',
          payload: {
            shareRightActions: [readAction, contribAction, manageAction],
            shareRights: buildShareRights({ rights: [shareRight] }),
          },
        });
      });

      act(() => {
        result.current.toggleRight(shareRight, 'contrib');
      });

      const updated = result.current.state.shareRights.rights[0];
      expect(updated.actions.map((a) => a.id).sort()).toEqual([
        'contrib',
        'read',
      ]);
    });

    it('removes an action along with actions that depend on it', () => {
      const shareRight = buildShareRight({
        id: 'user-1',
        actions: [readAction, contribAction, manageAction],
      });
      const { result } = renderHook(() => useShare({ ...baseProps }), {
        wrapper,
      });

      act(() => {
        result.current.dispatch({
          type: 'init',
          payload: {
            shareRightActions: [readAction, contribAction, manageAction],
            shareRights: buildShareRights({ rights: [shareRight] }),
          },
        });
      });

      act(() => {
        result.current.toggleRight(shareRight, 'read');
      });

      const updated = result.current.state.shareRights.rights[0];
      // contrib and manage both (transitively) require read, so removing
      // read cascades and removes them too.
      expect(updated.actions).toEqual([]);
    });

    it('propagates the bookmark actions to its member users and groups', () => {
      const bookmarkRight = buildShareRight({
        id: 'bookmark-1',
        type: 'sharebookmark',
        actions: [],
        users: [buildUser({ id: 'user-1' })],
        groups: [buildGroup({ id: 'group-1' })],
      });
      const userRow = buildShareRight({ id: 'user-1', type: 'user' });
      const groupRow = buildShareRight({ id: 'group-1', type: 'group' });

      const { result } = renderHook(() => useShare({ ...baseProps }), {
        wrapper,
      });

      act(() => {
        result.current.dispatch({
          type: 'init',
          payload: {
            shareRightActions: [readAction],
            shareRights: buildShareRights({
              rights: [bookmarkRight, userRow, groupRow],
            }),
          },
        });
      });

      act(() => {
        result.current.toggleRight(bookmarkRight, 'read');
      });

      const rights = result.current.state.shareRights.rights;
      const user = rights.find((r) => r.id === 'user-1');
      const group = rights.find((r) => r.id === 'group-1');
      expect(user?.actions.map((a) => a.id)).toEqual(['read']);
      expect(group?.actions.map((a) => a.id)).toEqual(['read']);
    });
  });

  describe('isDirty', () => {
    it('starts false and becomes true after a toggleRight-like action', () => {
      const shareRight = buildShareRight({ id: 'user-1', actions: [] });
      const { result } = renderHook(() => useShare({ ...baseProps }), {
        wrapper,
      });

      expect(result.current.isDirty).toBe(false);

      act(() => {
        result.current.dispatch({
          type: 'updateShareRights',
          payload: buildShareRights({ rights: [shareRight] }),
        });
      });

      expect(result.current.isDirty).toBe(true);
    });
  });

  describe('handleShare', () => {
    it('calls odeServices.share().saveRights when no shareResource is given', async () => {
      saveRights.mockResolvedValue({ 'notify-timeline-array': [] });
      const onSuccess = vi.fn();

      const { result } = renderHook(
        () => useShare({ ...baseProps, resourceId: 'resource-1', onSuccess }),
        { wrapper },
      );

      await act(async () => {
        await result.current.handleShare();
      });

      expect(saveRights).toHaveBeenCalledWith(
        'wiki',
        'resource-1',
        [],
        undefined,
      );
      expect(onSuccess).toHaveBeenCalled();
      expect(result.current.state.isSharing).toBe(false);
    });

    it('calls shareResource.mutateAsync instead of saveRights when provided', async () => {
      const mutateAsync = vi
        .fn()
        .mockResolvedValue({ 'notify-timeline-array': [] });
      const onSuccess = vi.fn();

      const { result } = renderHook(
        () =>
          useShare({
            ...baseProps,
            resourceId: 'resource-1',
            onSuccess,
            shareResource: { mutateAsync } as any,
          }),
        { wrapper },
      );

      await act(async () => {
        await result.current.handleShare();
      });

      expect(mutateAsync).toHaveBeenCalledWith({
        resourceId: 'resource-1',
        rights: [],
      });
      expect(saveRights).not.toHaveBeenCalled();
      expect(onSuccess).toHaveBeenCalled();
    });

    it('logs the failure when the resolved value has an "error" key', async () => {
      const consoleErrorSpy = vi
        .spyOn(console, 'error')
        .mockImplementation(() => undefined);
      saveRights.mockResolvedValue({ error: 'some.error.key' });

      const { result } = renderHook(
        () => useShare({ ...baseProps, resourceId: 'resource-1' }),
        { wrapper },
      );

      await act(async () => {
        await result.current.handleShare();
      });

      expect(consoleErrorSpy).toHaveBeenCalledWith('Failed to save share', {
        error: 'some.error.key',
      });
    });

    it('merges "my rights" derived from resourceRights into the payload', async () => {
      saveRights.mockResolvedValue({ 'notify-timeline-array': [] });

      const { result } = renderHook(
        () =>
          useShare({
            ...baseProps,
            resourceId: 'resource-1',
            resourceRights: [`user:${mockUser.userId}:read`],
          }),
        { wrapper },
      );

      await act(async () => {
        await result.current.handleShare();
      });

      expect(saveRights).toHaveBeenCalledWith(
        'wiki',
        'resource-1',
        [
          expect.objectContaining({
            id: mockUser.userId,
            type: 'user',
            actions: [{ displayName: 'read', id: 'read' }],
          }),
        ],
        undefined,
      );
    });

    it('logs a string error thrown by the save call', async () => {
      const consoleErrorSpy = vi
        .spyOn(console, 'error')
        .mockImplementation(() => undefined);
      saveRights.mockRejectedValue('a string error');

      const { result } = renderHook(
        () => useShare({ ...baseProps, resourceId: 'resource-1' }),
        { wrapper },
      );

      await act(async () => {
        await result.current.handleShare();
      });

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Failed to save share',
        'a string error',
      );
      expect(result.current.state.isSharing).toBe(false);
    });

    it('logs an object error ({ error }) thrown by the save call', async () => {
      const consoleErrorSpy = vi
        .spyOn(console, 'error')
        .mockImplementation(() => undefined);
      const objectError = { error: 'explorer.some.key' };
      saveRights.mockRejectedValue(objectError);

      const { result } = renderHook(
        () => useShare({ ...baseProps, resourceId: 'resource-1' }),
        { wrapper },
      );

      await act(async () => {
        await result.current.handleShare();
      });

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Failed to save share',
        objectError,
      );
      expect(result.current.state.isSharing).toBe(false);
    });

    it('logs a plain Error thrown by the save call', async () => {
      const consoleErrorSpy = vi
        .spyOn(console, 'error')
        .mockImplementation(() => undefined);
      const error = new Error('boom');
      saveRights.mockRejectedValue(error);

      const { result } = renderHook(
        () => useShare({ ...baseProps, resourceId: 'resource-1' }),
        { wrapper },
      );

      await act(async () => {
        await result.current.handleShare();
      });

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Failed to save share',
        error,
      );
      expect(result.current.state.isSharing).toBe(false);
    });

    it('clears the cache when shareUrls.getResourceRights is set', async () => {
      saveRights.mockResolvedValue({ 'notify-timeline-array': [] });

      const { result } = renderHook(
        () =>
          useShare({
            ...baseProps,
            resourceId: 'resource-1',
            shareUrls: { getResourceRights: '/api/shares' },
          }),
        { wrapper },
      );

      await act(async () => {
        await result.current.handleShare();
      });

      expect(clearCache).toHaveBeenCalledWith('/api/shares');
    });

    it('does not clear the cache when shareUrls.getResourceRights is missing', async () => {
      saveRights.mockResolvedValue({ 'notify-timeline-array': [] });

      const { result } = renderHook(
        () => useShare({ ...baseProps, resourceId: 'resource-1' }),
        { wrapper },
      );

      await act(async () => {
        await result.current.handleShare();
      });

      expect(clearCache).not.toHaveBeenCalled();
    });
  });

  describe('handleDeleteRow', () => {
    it('removes the right and the users/groups that were its bookmark members', () => {
      const bookmarkRight = buildShareRight({
        id: 'bookmark-1',
        type: 'sharebookmark',
        users: [buildUser({ id: 'user-1' })],
        groups: [buildGroup({ id: 'group-1' })],
      });
      const userRow = buildShareRight({ id: 'user-1', type: 'user' });
      const groupRow = buildShareRight({ id: 'group-1', type: 'group' });
      const otherRow = buildShareRight({ id: 'other', type: 'user' });

      const { result } = renderHook(() => useShare({ ...baseProps }), {
        wrapper,
      });

      act(() => {
        result.current.dispatch({
          type: 'init',
          payload: {
            shareRightActions: [],
            shareRights: buildShareRights({
              rights: [bookmarkRight, userRow, groupRow, otherRow],
            }),
          },
        });
      });

      act(() => {
        result.current.handleDeleteRow(bookmarkRight);
      });

      expect(result.current.state.shareRights.rights.map((r) => r.id)).toEqual([
        'other',
      ]);
    });
  });

  describe('currentIsAuthor', () => {
    it('returns true when resourceCreatorId matches the current user', () => {
      const { result } = renderHook(
        () => useShare({ ...baseProps, resourceCreatorId: mockUser.userId }),
        { wrapper },
      );

      expect(result.current.currentIsAuthor()).toBe(true);
    });

    it('returns false when resourceCreatorId does not match the current user', () => {
      const { result } = renderHook(
        () => useShare({ ...baseProps, resourceCreatorId: 'someone-else' }),
        { wrapper },
      );

      expect(result.current.currentIsAuthor()).toBe(false);
    });
  });
});
