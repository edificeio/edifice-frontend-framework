import {
  Group,
  ShareRight,
  ShareRightWithVisibles,
  ShareSubject,
  User,
} from '@edifice.io/client';

import { act, renderHook, waitFor, wrapper } from '~/setup';
import type { ShareAction } from './useShare';
import { useSearch } from './useSearch';

const { isAdml, searchShareSubjects, getBookMarkById } = vi.hoisted(() => ({
  isAdml: vi.fn(),
  searchShareSubjects: vi.fn(),
  getBookMarkById: vi.fn(),
}));

vi.mock('@edifice.io/client', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@edifice.io/client')>();
  return {
    ...actual,
    odeServices: {
      session: () => ({
        isAdml,
      }),
      share: () => ({
        searchShareSubjects,
      }),
      directory: () => ({
        getBookMarkById,
      }),
    },
  };
});

const buildShareSubject = (
  overrides: Partial<ShareSubject> = {},
): ShareSubject => ({
  id: 'subject-1',
  displayName: 'Subject 1',
  avatarUrl: '',
  directoryUrl: '',
  type: 'user',
  ...overrides,
});

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
  resourceId: 'resource-1',
  resourceCreatorId: 'creator-id',
  shareRights: buildShareRights(),
  shareDispatch: vi.fn() as (action: ShareAction) => void,
};

// Simulates typing into the search input then flushing the 500ms debounce
// so the effect that triggers `search` runs.
const typeAndFlush = async (
  result: { current: ReturnType<typeof useSearch> },
  value: string,
) => {
  act(() => {
    result.current.handleSearchInputChange({
      target: { value },
    } as React.ChangeEvent<HTMLInputElement>);
  });

  await act(async () => {
    await vi.advanceTimersByTimeAsync(500);
  });
};

describe('useSearch', () => {
  beforeEach(() => {
    // `shouldAdvanceTime` lets real time keep nudging the fake clock forward,
    // which is required for `waitFor`'s internal polling (itself based on
    // `setInterval`) to ever fire while fake timers are active.
    vi.useFakeTimers({ shouldAdvanceTime: true });
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.clearAllMocks();
  });

  describe('search', () => {
    it('does not call searchShareSubjects when resourceId is falsy', async () => {
      isAdml.mockResolvedValue(false);
      const { result } = renderHook(
        () => useSearch({ ...baseProps, resourceId: '' }),
        { wrapper },
      );

      await waitFor(() => expect(isAdml).toHaveBeenCalled());

      await typeAndFlush(result, 'a');

      expect(searchShareSubjects).not.toHaveBeenCalled();
    });

    it('fires the search from 1 character for a non adml user', async () => {
      isAdml.mockResolvedValue(false);
      searchShareSubjects.mockResolvedValue([]);
      const { result } = renderHook(() => useSearch({ ...baseProps }), {
        wrapper,
      });

      await waitFor(() => expect(isAdml).toHaveBeenCalled());

      await typeAndFlush(result, 'a');

      await waitFor(() => expect(searchShareSubjects).toHaveBeenCalled());
      expect(searchShareSubjects).toHaveBeenCalledWith(
        'wiki',
        'resource-1',
        'a',
        undefined,
      );
    });

    it('does not fire the search below 3 characters for an adml user', async () => {
      isAdml.mockResolvedValue(true);
      searchShareSubjects.mockResolvedValue([]);
      const { result } = renderHook(() => useSearch({ ...baseProps }), {
        wrapper,
      });

      await waitFor(() => expect(isAdml).toHaveBeenCalled());

      await typeAndFlush(result, 'ab');

      expect(searchShareSubjects).not.toHaveBeenCalled();
      expect(result.current.state.searchResults).toEqual([]);
      expect(result.current.state.isSearching).toBe(false);
    });

    it('fires the search from 3 characters for an adml user', async () => {
      isAdml.mockResolvedValue(true);
      searchShareSubjects.mockResolvedValue([]);
      const { result } = renderHook(() => useSearch({ ...baseProps }), {
        wrapper,
      });

      await waitFor(() => expect(isAdml).toHaveBeenCalled());

      await typeAndFlush(result, 'abc');

      await waitFor(() => expect(searchShareSubjects).toHaveBeenCalled());
      expect(searchShareSubjects).toHaveBeenCalledWith(
        'wiki',
        'resource-1',
        'abc',
        undefined,
      );
    });

    it('passes urlResourceRights through to searchShareSubjects', async () => {
      isAdml.mockResolvedValue(false);
      searchShareSubjects.mockResolvedValue([]);
      const { result } = renderHook(
        () =>
          useSearch({
            ...baseProps,
            urlResourceRights: 'resource:rights',
          }),
        { wrapper },
      );

      await waitFor(() => expect(isAdml).toHaveBeenCalled());

      await typeAndFlush(result, 'a');

      await waitFor(() => expect(searchShareSubjects).toHaveBeenCalled());
      expect(searchShareSubjects).toHaveBeenCalledWith(
        'wiki',
        'resource-1',
        'a',
        'resource:rights',
      );
    });

    it('filters out subjects already present in shareRights and the resource owner, and adapts the labels/icon', async () => {
      isAdml.mockResolvedValue(false);
      const alreadyShared = buildShareSubject({
        id: 'already-shared',
        displayName: 'Already Shared',
      });
      const owner = buildShareSubject({
        id: 'creator-id',
        displayName: 'Owner',
        type: 'user',
      });
      const userWithProfile = buildShareSubject({
        id: 'user-with-profile',
        displayName: 'Jane',
        type: 'user',
        profile: 'Teacher',
      });
      const groupWithStructure = buildShareSubject({
        id: 'group-1',
        displayName: 'Group A',
        type: 'group',
        structureName: 'School A',
      });
      const plainUser = buildShareSubject({
        id: 'plain-user',
        displayName: 'Plain',
        type: 'user',
      });
      const bookmark = buildShareSubject({
        id: 'bookmark-1',
        displayName: 'My Bookmark',
        type: 'sharebookmark',
      });

      searchShareSubjects.mockResolvedValue([
        alreadyShared,
        owner,
        userWithProfile,
        groupWithStructure,
        plainUser,
        bookmark,
      ]);

      const { result } = renderHook(
        () =>
          useSearch({
            ...baseProps,
            shareRights: buildShareRights({
              rights: [buildShareRight({ id: 'already-shared' })],
            }),
          }),
        { wrapper },
      );

      await waitFor(() => expect(isAdml).toHaveBeenCalled());

      await typeAndFlush(result, 'a');

      await waitFor(() =>
        expect(result.current.state.searchResults).toHaveLength(4),
      );

      const results = result.current.state.searchResults;
      expect(results.map((r) => r.value)).toEqual([
        'user-with-profile',
        'group-1',
        'plain-user',
        'bookmark-1',
      ]);

      const userResult = results.find((r) => r.value === 'user-with-profile');
      expect(userResult?.label).toBe('Jane (Teacher)');
      expect(userResult?.icon).toBeNull();

      const groupResult = results.find((r) => r.value === 'group-1');
      expect(groupResult?.label).toBe('Group A (School A)');
      expect(groupResult?.icon).toBeNull();

      const plainResult = results.find((r) => r.value === 'plain-user');
      expect(plainResult?.label).toBe('Plain');
      expect(plainResult?.icon).toBeNull();

      const bookmarkResult = results.find((r) => r.value === 'bookmark-1');
      expect(bookmarkResult?.label).toBe('My Bookmark');
      expect(bookmarkResult?.icon).not.toBeNull();

      expect(result.current.state.isSearching).toBe(false);
    });

    it('keeps the raw API results in state for later lookup by handleSearchResultsChange', async () => {
      isAdml.mockResolvedValue(false);
      const subject = buildShareSubject({ id: 'subject-1' });
      searchShareSubjects.mockResolvedValue([subject]);

      const { result } = renderHook(() => useSearch({ ...baseProps }), {
        wrapper,
      });

      await waitFor(() => expect(isAdml).toHaveBeenCalled());

      await typeAndFlush(result, 'a');

      await waitFor(() =>
        expect(result.current.state.searchAPIResults).toEqual([subject]),
      );
    });
  });

  describe('handleSearchResultsChange', () => {
    it('does nothing when model[0] does not match any searchAPIResult', async () => {
      isAdml.mockResolvedValue(false);
      const shareDispatch = vi.fn();
      const { result } = renderHook(
        () => useSearch({ ...baseProps, shareDispatch }),
        { wrapper },
      );

      await waitFor(() => expect(isAdml).toHaveBeenCalled());

      await act(async () => {
        await result.current.handleSearchResultsChange(['unknown-id']);
      });

      expect(shareDispatch).not.toHaveBeenCalled();
    });

    it('adds a single right for a non bookmark subject and removes it from local results', async () => {
      isAdml.mockResolvedValue(false);
      const shareDispatch = vi.fn();
      const subject = buildShareSubject({
        id: 'subject-1',
        displayName: 'Subject 1',
      });
      searchShareSubjects.mockResolvedValue([subject]);

      const shareRights = buildShareRights();
      const { result } = renderHook(
        () => useSearch({ ...baseProps, shareRights, shareDispatch }),
        { wrapper },
      );

      await waitFor(() => expect(isAdml).toHaveBeenCalled());

      await typeAndFlush(result, 'a');

      await waitFor(() =>
        expect(result.current.state.searchResults).toHaveLength(1),
      );

      await act(async () => {
        await result.current.handleSearchResultsChange(['subject-1']);
      });

      expect(shareDispatch).toHaveBeenCalledWith({
        type: 'updateShareRights',
        payload: {
          ...shareRights,
          rights: [
            {
              ...subject,
              actions: [
                { id: 'read', displayName: 'read' },
                { id: 'comment', displayName: 'comment' },
              ],
            },
          ],
        },
      });
      expect(getBookMarkById).not.toHaveBeenCalled();
      expect(result.current.state.searchResults).toHaveLength(0);
    });

    it('uses the provided defaultActions when building a non bookmark right', async () => {
      isAdml.mockResolvedValue(false);
      const shareDispatch = vi.fn();
      const subject = buildShareSubject({ id: 'subject-1' });
      searchShareSubjects.mockResolvedValue([subject]);
      const defaultActions = [
        { id: 'manage' as const, displayName: 'manage' as const },
      ];

      const { result } = renderHook(
        () =>
          useSearch({
            ...baseProps,
            shareDispatch,
            defaultActions,
          }),
        { wrapper },
      );

      await waitFor(() => expect(isAdml).toHaveBeenCalled());

      await typeAndFlush(result, 'a');

      await waitFor(() =>
        expect(result.current.state.searchResults).toHaveLength(1),
      );

      await act(async () => {
        await result.current.handleSearchResultsChange(['subject-1']);
      });

      expect(shareDispatch).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'updateShareRights',
          payload: expect.objectContaining({
            rights: [expect.objectContaining({ actions: defaultActions })],
          }),
        }),
      );
    });

    it('expands a sharebookmark subject into a bookmark right plus its users and groups, excluding existing rights', async () => {
      isAdml.mockResolvedValue(false);
      const shareDispatch = vi.fn();
      const bookmarkSubject = buildShareSubject({
        id: 'bookmark-1',
        displayName: 'My Bookmark',
        type: 'sharebookmark',
      });
      searchShareSubjects.mockResolvedValue([bookmarkSubject]);

      const existingUser = buildUser({ id: 'existing-user' });
      const newUser = buildUser({ id: 'new-user' });
      const existingGroup = buildGroup({ id: 'existing-group' });
      const newGroup = buildGroup({ id: 'new-group' });

      getBookMarkById.mockResolvedValue({
        id: 'bookmark-1',
        displayName: 'My Bookmark',
        notVisibleCount: 0,
        users: [existingUser, newUser],
        groups: [existingGroup, newGroup],
      });

      const shareRights = buildShareRights({
        rights: [
          buildShareRight({ id: 'existing-user', type: 'user' }),
          buildShareRight({ id: 'existing-group', type: 'group' }),
        ],
      });

      const { result } = renderHook(
        () => useSearch({ ...baseProps, shareRights, shareDispatch }),
        { wrapper },
      );

      await waitFor(() => expect(isAdml).toHaveBeenCalled());

      await typeAndFlush(result, 'a');

      await waitFor(() =>
        expect(result.current.state.searchResults).toHaveLength(1),
      );

      await act(async () => {
        await result.current.handleSearchResultsChange(['bookmark-1']);
      });

      expect(getBookMarkById).toHaveBeenCalledWith('bookmark-1');

      const dispatched = shareDispatch.mock.calls[0][0];
      expect(dispatched.type).toBe('updateShareRights');

      const addedRights = dispatched.payload.rights.slice(
        shareRights.rights.length,
      );
      // bookmark right + new-user + new-group (existing-user/existing-group
      // are already in shareRights and must not be duplicated)
      expect(addedRights).toHaveLength(3);

      const bookmarkRight = addedRights.find(
        (right: ShareRight) => right.type === 'sharebookmark',
      );
      expect(bookmarkRight).toMatchObject({
        id: 'bookmark-1',
        type: 'sharebookmark',
        avatarUrl: '',
        directoryUrl: '',
      });

      const newUserRight = addedRights.find(
        (right: ShareRight) => right.id === 'new-user',
      );
      expect(newUserRight).toMatchObject({
        id: 'new-user',
        type: 'user',
        isBookmarkMember: true,
      });

      const newGroupRight = addedRights.find(
        (right: ShareRight) => right.id === 'new-group',
      );
      expect(newGroupRight).toMatchObject({
        id: 'new-group',
        type: 'group',
        isBookmarkMember: true,
      });

      // existing-user and existing-group must NOT be duplicated
      expect(
        addedRights.find((right: ShareRight) => right.id === 'existing-user'),
      ).toBeUndefined();
      expect(
        addedRights.find((right: ShareRight) => right.id === 'existing-group'),
      ).toBeUndefined();

      expect(result.current.state.searchResults).toHaveLength(0);
    });
  });

  describe('derived booleans', () => {
    it('showSearchNoResults is false while isSearching is true, even with an empty result and enough characters', async () => {
      isAdml.mockResolvedValue(false);
      // never resolves, so isSearching stays true during the assertion
      searchShareSubjects.mockReturnValue(new Promise(() => undefined));

      const { result } = renderHook(() => useSearch({ ...baseProps }), {
        wrapper,
      });

      await waitFor(() => expect(isAdml).toHaveBeenCalled());

      act(() => {
        result.current.handleSearchInputChange({
          target: { value: 'a' },
        } as React.ChangeEvent<HTMLInputElement>);
      });

      await act(async () => {
        await vi.advanceTimersByTimeAsync(500);
      });

      await waitFor(() =>
        expect(result.current.showSearchLoading()).toBe(true),
      );
      expect(result.current.showSearchNoResults()).toBe(false);
    });

    it('showSearchNoResults is true for a non adml user once search settles empty above 0 chars', async () => {
      isAdml.mockResolvedValue(false);
      searchShareSubjects.mockResolvedValue([]);

      const { result } = renderHook(() => useSearch({ ...baseProps }), {
        wrapper,
      });

      await waitFor(() => expect(isAdml).toHaveBeenCalled());

      await typeAndFlush(result, 'a');

      await waitFor(() =>
        expect(result.current.showSearchLoading()).toBe(false),
      );
      expect(result.current.showSearchNoResults()).toBe(true);
    });

    it('showSearchNoResults requires more than 3 chars for an adml user', async () => {
      isAdml.mockResolvedValue(true);
      searchShareSubjects.mockResolvedValue([]);

      const { result } = renderHook(() => useSearch({ ...baseProps }), {
        wrapper,
      });

      await waitFor(() => expect(isAdml).toHaveBeenCalled());

      // exactly 3 chars: search does not even fire, so no-results must stay false
      await typeAndFlush(result, 'abc');
      expect(result.current.showSearchNoResults()).toBe(false);

      // 4 chars: search fires and resolves empty
      await typeAndFlush(result, 'abcd');
      await waitFor(() =>
        expect(result.current.showSearchLoading()).toBe(false),
      );
      expect(result.current.showSearchNoResults()).toBe(true);
    });

    it('showSearchAdmlHint is true only for an adml user under 3 characters', async () => {
      isAdml.mockResolvedValue(true);
      const { result } = renderHook(() => useSearch({ ...baseProps }), {
        wrapper,
      });

      await waitFor(() => expect(isAdml).toHaveBeenCalled());
      expect(result.current.showSearchAdmlHint()).toBe(true);

      act(() => {
        result.current.handleSearchInputChange({
          target: { value: 'abc' },
        } as React.ChangeEvent<HTMLInputElement>);
      });
      expect(result.current.showSearchAdmlHint()).toBe(false);
    });

    it('showSearchAdmlHint is false for a non adml user regardless of input length', async () => {
      isAdml.mockResolvedValue(false);
      const { result } = renderHook(() => useSearch({ ...baseProps }), {
        wrapper,
      });

      await waitFor(() => expect(isAdml).toHaveBeenCalled());
      expect(result.current.showSearchAdmlHint()).toBe(false);
    });

    it('getSearchMinLength returns 3 for adml and 1 for non adml', async () => {
      isAdml.mockResolvedValue(true);
      const { result: admlResult } = renderHook(
        () => useSearch({ ...baseProps }),
        { wrapper },
      );
      await waitFor(() =>
        expect(admlResult.current.getSearchMinLength()).toBe(3),
      );

      isAdml.mockResolvedValue(false);
      const { result: nonAdmlResult } = renderHook(
        () => useSearch({ ...baseProps }),
        { wrapper },
      );
      await waitFor(() =>
        expect(nonAdmlResult.current.getSearchMinLength()).toBe(1),
      );
    });
  });
});
