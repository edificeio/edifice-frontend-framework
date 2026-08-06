import { createRef } from 'react';

import {
  ShareRight,
  ShareRightAction,
  ShareRightWithVisibles,
} from '@edifice.io/client';

import { mockUser } from '../../../providers/MockedProvider/MockedProvider.mocks';
import { act, render, screen, waitFor } from '~/setup';
import ShareResources, {
  ShareOptions,
  ShareResourcesRef,
} from './ShareResources';

// Mock the same odeServices surface as useShare.spec.ts and useSearch.spec.tsx
// merged together, since ShareResources wires both hooks at once.
const {
  getActionsForApp,
  getRightsForResource,
  saveRights,
  searchShareSubjects,
  clearCache,
  isAdml,
  getBookMarkById,
  saveBookmarks,
  getAvatarUrl,
} = vi.hoisted(() => ({
  getActionsForApp: vi.fn(),
  getRightsForResource: vi.fn(),
  saveRights: vi.fn(),
  searchShareSubjects: vi.fn(),
  clearCache: vi.fn(),
  isAdml: vi.fn(),
  getBookMarkById: vi.fn(),
  saveBookmarks: vi.fn(),
  getAvatarUrl: vi.fn(),
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
      session: () => ({
        isAdml,
      }),
      directory: () => ({
        getBookMarkById,
        saveBookmarks,
        getAvatarUrl,
      }),
    },
  };
});

const readAction: ShareRightAction = { id: 'read', displayName: 'read' };

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

const baseShareOptions: ShareOptions = {
  resourceId: 'resource-1',
  resourceRights: [],
  resourceCreatorId: 'creator-id',
};

describe('ShareResources', () => {
  beforeEach(() => {
    isAdml.mockResolvedValue(false);
    getActionsForApp.mockResolvedValue([readAction]);
    getRightsForResource.mockResolvedValue(buildShareRights());
    saveRights.mockResolvedValue({ 'notify-timeline-array': [] });
    searchShareSubjects.mockResolvedValue([]);
    getAvatarUrl.mockReturnValue('http://avatar/creator');
    saveBookmarks.mockResolvedValue({ id: 'bookmark-99' });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('shows a loading screen until the mount fetch resolves, then renders the rights table', async () => {
    let resolveActions!: (value: ShareRightAction[]) => void;
    let resolveRights!: (value: ShareRightWithVisibles) => void;
    getActionsForApp.mockImplementation(
      () =>
        new Promise((resolve) => {
          resolveActions = resolve;
        }),
    );
    getRightsForResource.mockImplementation(
      () =>
        new Promise((resolve) => {
          resolveRights = resolve;
        }),
    );

    render(<ShareResources shareOptions={baseShareOptions} />);

    expect(screen.getByAltText('loading')).toBeInTheDocument();
    expect(screen.queryByRole('table')).not.toBeInTheDocument();

    await act(async () => {
      resolveActions([readAction]);
      resolveRights(buildShareRights());
    });

    await waitFor(() => expect(screen.getByRole('table')).toBeInTheDocument());
    expect(screen.queryByAltText('loading')).not.toBeInTheDocument();
  });

  it('shows "me" and the current user avatar in the disabled owner row when the current user is the author', async () => {
    render(
      <ShareResources
        shareOptions={{
          ...baseShareOptions,
          resourceCreatorId: mockUser.userId,
        }}
      />,
    );

    await waitFor(() => expect(screen.getByRole('table')).toBeInTheDocument());

    expect(screen.getByText('share.me')).toBeInTheDocument();
    const ownerAvatar = screen.getByAltText(
      'explorer.modal.share.avatar.me.alt',
    );
    expect(ownerAvatar).toHaveAttribute(
      'src',
      '/userbook/avatar/91c22b66-ba1b-4fde-a3fe-95219cc18d4a',
    );
    expect(getAvatarUrl).not.toHaveBeenCalled();
  });

  it('shows the resource creator display name and avatar when the current user is not the author', async () => {
    render(
      <ShareResources
        shareOptions={{
          ...baseShareOptions,
          resourceCreatorId: 'someone-else',
          resourceCreatorDisplayName: 'Jane Creator',
        }}
      />,
    );

    await waitFor(() => expect(screen.getByRole('table')).toBeInTheDocument());

    expect(screen.getByText('Jane Creator')).toBeInTheDocument();
    const ownerAvatar = screen.getByAltText(
      'explorer.modal.share.avatar.me.alt',
    );
    expect(ownerAvatar).toHaveAttribute('src', 'http://avatar/creator');
    expect(getAvatarUrl).toHaveBeenCalledWith('someone-else', 'user');
  });

  it('falls back to a generic author label when the creator has no display name', async () => {
    render(
      <ShareResources
        shareOptions={{
          ...baseShareOptions,
          resourceCreatorId: 'someone-else',
        }}
      />,
    );

    await waitFor(() => expect(screen.getByRole('table')).toBeInTheDocument());
    expect(screen.getByText('share.author')).toBeInTheDocument();
  });

  it('calls onChange with the updated rights and isDirty flag when a right is toggled from the UI', async () => {
    const shareRight = buildShareRight({ id: 'user-1', type: 'user' });
    getRightsForResource.mockResolvedValue(
      buildShareRights({ rights: [shareRight] }),
    );
    const onChange = vi.fn();

    const { user } = render(
      <ShareResources shareOptions={baseShareOptions} onChange={onChange} />,
    );

    await waitFor(() => expect(screen.getByRole('table')).toBeInTheDocument());
    expect(onChange).toHaveBeenCalledWith([shareRight], false);

    const checkbox = screen.getByTestId('share-right-read-checkbox');
    await user.click(checkbox);

    await waitFor(() =>
      expect(onChange).toHaveBeenLastCalledWith(
        expect.arrayContaining([
          expect.objectContaining({ id: 'user-1', actions: [readAction] }),
        ]),
        true,
      ),
    );
  });

  it('calls onSubmit(true) then onSubmit(false) while handleShare is in flight', async () => {
    const onSubmit = vi.fn();
    const ref = createRef<ShareResourcesRef>();

    render(
      <ShareResources
        ref={ref}
        shareOptions={baseShareOptions}
        onSubmit={onSubmit}
      />,
    );

    await waitFor(() => expect(screen.getByRole('table')).toBeInTheDocument());
    expect(onSubmit).toHaveBeenLastCalledWith(false);
    onSubmit.mockClear();

    // Call handleShare without awaiting its internal promise so the
    // synchronous "isSharing: true" dispatch flushes on its own, before the
    // mocked saveRights promise resolves and flips it back to false.
    act(() => {
      ref.current?.handleShare();
    });
    expect(onSubmit).toHaveBeenCalledWith(true);

    await waitFor(() => expect(onSubmit).toHaveBeenLastCalledWith(false));
    expect(saveRights).toHaveBeenCalled();
  });

  it('exposes handleShare through the imperative ref and triggers the real save flow', async () => {
    const ref = createRef<ShareResourcesRef>();

    render(<ShareResources ref={ref} shareOptions={baseShareOptions} />);
    await waitFor(() => expect(screen.getByRole('table')).toBeInTheDocument());

    await act(async () => {
      await ref.current?.handleShare();
    });

    expect(saveRights).toHaveBeenCalledWith(
      'wiki',
      'resource-1',
      [],
      undefined,
    );
  });

  it('reveals the bookmark form when the bookmark toggle button is clicked', async () => {
    const { user } = render(<ShareResources shareOptions={baseShareOptions} />);
    await waitFor(() => expect(screen.getByRole('table')).toBeInTheDocument());

    expect(
      screen.queryByTestId('share-bookmark-name-input'),
    ).not.toBeInTheDocument();

    await user.click(screen.getByTestId('share-bookmark-show-button'));

    expect(screen.getByTestId('share-bookmark-name-input')).toBeInTheDocument();
  });

  it('calls onSubmit while a new bookmark is being saved from the UI', async () => {
    const onSubmit = vi.fn();

    const { user } = render(
      <ShareResources shareOptions={baseShareOptions} onSubmit={onSubmit} />,
    );
    await waitFor(() => expect(screen.getByRole('table')).toBeInTheDocument());

    await user.click(screen.getByTestId('share-bookmark-show-button'));
    await user.type(
      screen.getByTestId('share-bookmark-name-input'),
      'My favorites',
    );
    onSubmit.mockClear();

    await user.click(screen.getByTestId('share-bookmark-save-button'));

    await waitFor(() => expect(saveBookmarks).toHaveBeenCalled());
    expect(onSubmit).toHaveBeenCalledWith(true);
    await waitFor(() => expect(onSubmit).toHaveBeenLastCalledWith(false));
  });

  it('shows the adml search hint placeholder for adml users', async () => {
    isAdml.mockResolvedValue(true);

    render(<ShareResources shareOptions={baseShareOptions} />);

    await waitFor(() => expect(screen.getByRole('table')).toBeInTheDocument());
    await waitFor(() =>
      expect(screen.getByTestId('combobox-search-input')).toHaveAttribute(
        'placeholder',
        'explorer.search.adml.hint',
      ),
    );
  });

  it('shows the default search placeholder for non adml users', async () => {
    isAdml.mockResolvedValue(false);

    render(<ShareResources shareOptions={baseShareOptions} />);

    await waitFor(() => expect(screen.getByRole('table')).toBeInTheDocument());
    await waitFor(() =>
      expect(screen.getByTestId('combobox-search-input')).toHaveAttribute(
        'placeholder',
        'Search users, groups or favorites',
      ),
    );
  });
});
