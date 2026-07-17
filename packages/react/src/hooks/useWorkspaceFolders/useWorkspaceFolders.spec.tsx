import { ReactNode } from 'react';

import { IUserInfo } from '@edifice.io/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, renderHook, waitFor } from '~/setup';
import { EdificeClientContext } from '../../providers/EdificeClientProvider/EdificeClientProvider.context';
import useWorkspaceFolders from './useWorkspaceFolders';

const { listOwnerFolders, listSharedFolders, createFolder } = vi.hoisted(
  () => ({
    listOwnerFolders: vi.fn(),
    listSharedFolders: vi.fn(),
    createFolder: vi.fn(),
  }),
);

vi.mock('@edifice.io/client', () => ({
  odeServices: {
    workspace: () => ({ listOwnerFolders, listSharedFolders, createFolder }),
  },
}));

const { toastCustom } = vi.hoisted(() => ({ toastCustom: vi.fn() }));
vi.mock('react-hot-toast', () => ({
  default: { custom: toastCustom },
}));

const user = { userId: 'user-1', groupsIds: ['group-1'] } as IUserInfo;

// Each test gets its own QueryClient + EdificeClientContext to avoid cache
// pollution from the module-level singleton used by the shared MockedProvider.
function createWrapper(currentUser: IUserInfo | undefined = user) {
  const queryClient = new QueryClient();
  return function Wrapper({ children }: { children: ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>
        <EdificeClientContext.Provider value={{ user: currentUser } as any}>
          {children}
        </EdificeClientContext.Provider>
      </QueryClientProvider>
    );
  };
}

describe('useWorkspaceFolders', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('is loading until both owner and shared folders resolve, then merges them', async () => {
    listOwnerFolders.mockResolvedValue([{ _id: 'owner-1', name: 'Owner 1' }]);
    listSharedFolders.mockResolvedValue([
      { _id: 'shared-1', name: 'Shared 1' },
    ]);

    const { result } = renderHook(() => useWorkspaceFolders(), {
      wrapper: createWrapper(),
    });

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.folders).toEqual([
      { _id: 'owner-1', name: 'Owner 1' },
      { _id: 'shared-1', name: 'Shared 1' },
    ]);
  });

  it('adds a newly created owner folder to the folders list', async () => {
    listOwnerFolders.mockResolvedValue([]);
    listSharedFolders.mockResolvedValue([]);
    const newFolder = { _id: 'new-1', name: 'New Folder', isShared: false };
    createFolder.mockResolvedValue(newFolder);

    const { result } = renderHook(() => useWorkspaceFolders(), {
      wrapper: createWrapper(),
    });
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    act(() => {
      result.current.createFolderMutation.mutate({ folderName: 'New Folder' });
    });

    await waitFor(() =>
      expect(result.current.createFolderMutation.isSuccess).toBe(true),
    );
    expect(result.current.folders).toContainEqual(newFolder);
  });

  it('adds a newly created shared folder under the shared list', async () => {
    listOwnerFolders.mockResolvedValue([]);
    listSharedFolders.mockResolvedValue([]);
    const newFolder = { _id: 'new-2', name: 'Shared New', isShared: true };
    createFolder.mockResolvedValue(newFolder);

    const { result } = renderHook(() => useWorkspaceFolders(), {
      wrapper: createWrapper(),
    });
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    act(() => {
      result.current.createFolderMutation.mutate({
        folderName: 'Shared New',
        folderParentId: 'parent-1',
      });
    });

    await waitFor(() =>
      expect(result.current.createFolderMutation.isSuccess).toBe(true),
    );
    expect(result.current.folders).toContainEqual(newFolder);
    expect(createFolder).toHaveBeenCalledWith('Shared New', 'parent-1');
  });

  it('shows an error toast when folder creation fails', async () => {
    listOwnerFolders.mockResolvedValue([]);
    listSharedFolders.mockResolvedValue([]);
    createFolder.mockRejectedValue(new Error('boom'));

    const { result } = renderHook(() => useWorkspaceFolders(), {
      wrapper: createWrapper(),
    });
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    act(() => {
      result.current.createFolderMutation.mutate({ folderName: 'x' });
    });

    await waitFor(() =>
      expect(result.current.createFolderMutation.isError).toBe(true),
    );
    expect(toastCustom).toHaveBeenCalled();
  });

  describe('canCopyFileIntoFolder', () => {
    it('returns true when the current user owns the folder', async () => {
      listOwnerFolders.mockResolvedValue([
        { _id: 'f-1', owner: 'user-1', inheritedShares: [] },
      ]);
      listSharedFolders.mockResolvedValue([]);

      const { result } = renderHook(() => useWorkspaceFolders(), {
        wrapper: createWrapper(),
      });
      await waitFor(() => expect(result.current.isLoading).toBe(false));

      expect(result.current.canCopyFileIntoFolder('f-1')).toBe(true);
    });

    it('returns true when an inherited share grants the update-document right', async () => {
      listOwnerFolders.mockResolvedValue([]);
      listSharedFolders.mockResolvedValue([
        {
          _id: 'f-2',
          owner: 'someone-else',
          inheritedShares: [
            {
              'userId': 'user-1',
              'org-entcore-workspace-controllers-WorkspaceController|updateDocument': true,
            },
          ],
        },
      ]);

      const { result } = renderHook(() => useWorkspaceFolders(), {
        wrapper: createWrapper(),
      });
      await waitFor(() => expect(result.current.isLoading).toBe(false));

      expect(result.current.canCopyFileIntoFolder('f-2')).toBe(true);
    });

    it('returns false when the user has no matching right or ownership', async () => {
      listOwnerFolders.mockResolvedValue([]);
      listSharedFolders.mockResolvedValue([
        { _id: 'f-3', owner: 'someone-else', inheritedShares: [] },
      ]);

      const { result } = renderHook(() => useWorkspaceFolders(), {
        wrapper: createWrapper(),
      });
      await waitFor(() => expect(result.current.isLoading).toBe(false));

      expect(result.current.canCopyFileIntoFolder('f-3')).toBe(false);
    });

    it('returns false for an unknown folder id', async () => {
      listOwnerFolders.mockResolvedValue([]);
      listSharedFolders.mockResolvedValue([]);

      const { result } = renderHook(() => useWorkspaceFolders(), {
        wrapper: createWrapper(),
      });
      await waitFor(() => expect(result.current.isLoading).toBe(false));

      expect(result.current.canCopyFileIntoFolder('missing')).toBe(false);
    });
  });
});
