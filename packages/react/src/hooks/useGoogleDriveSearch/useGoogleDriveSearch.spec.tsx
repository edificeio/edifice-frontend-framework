import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import { act, renderHook, waitFor } from '~/setup';
import useGoogleDriveSearch from './useGoogleDriveSearch';

const { listDocuments, listSharedDocuments } = vi.hoisted(() => ({
  listDocuments: vi.fn(),
  listSharedDocuments: vi.fn(),
}));

vi.mock('@edifice.io/client', () => ({
  odeServices: {
    googledrive: () => ({ listDocuments, listSharedDocuments }),
  },
}));

const ROOT_ID = 'root';

const folder = {
  id: 'folder-1',
  name: 'Photos',
  isFolder: true,
  canCopyToWorkspace: true,
};
const file = {
  id: 'file-1',
  name: 'Rapport.pdf',
  contentType: 'application/pdf',
  isFolder: false,
};

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

describe('useGoogleDriveSearch', () => {
  beforeEach(() => {
    listDocuments.mockReset();
    listSharedDocuments.mockReset();
  });

  it('never requires authentication', async () => {
    listDocuments.mockResolvedValue([]);

    const { result } = renderHook(
      () => useGoogleDriveSearch(ROOT_ID, 'Mon Drive', 'user-1'),
      { wrapper: createWrapper() },
    );

    expect(result.current.needsAuth).toBe(false);
    expect(result.current.isCheckingAuth).toBe(false);
    expect(result.current.isAuthError).toBe(false);
  });

  it('does not call the backend without a userId', async () => {
    const { result } = renderHook(
      () => useGoogleDriveSearch(ROOT_ID, 'Mon Drive', undefined),
      { wrapper: createWrapper() },
    );

    await act(async () => {
      await result.current.loadContent(ROOT_ID);
    });

    expect(listDocuments).not.toHaveBeenCalled();
  });

  it('lists the Drive root without a parent id', async () => {
    listDocuments.mockResolvedValue([folder, file]);

    const { result } = renderHook(
      () => useGoogleDriveSearch(ROOT_ID, 'Mon Drive', 'user-1'),
      { wrapper: createWrapper() },
    );

    await act(async () => {
      await result.current.loadContent(ROOT_ID);
    });

    expect(listDocuments).toHaveBeenCalledWith('user-1', undefined);
    expect(result.current.root.children).toEqual([
      { id: 'folder-1', name: 'Photos' },
    ]);
    expect(result.current.root.files).toEqual([file]);
  });

  it('attaches a subfolder content to its own node', async () => {
    listDocuments.mockResolvedValueOnce([folder]);
    const nested = { id: 'file-2', name: 'Photo.png', isFolder: false };
    listDocuments.mockResolvedValueOnce([nested]);

    const { result } = renderHook(
      () => useGoogleDriveSearch(ROOT_ID, 'Mon Drive', 'user-1'),
      { wrapper: createWrapper() },
    );

    await act(async () => {
      await result.current.loadContent(ROOT_ID);
    });
    await act(async () => {
      await result.current.loadContent('folder-1');
    });

    expect(listDocuments).toHaveBeenLastCalledWith('user-1', 'folder-1');
    const child = result.current.root.children?.[0] as { files?: unknown[] };
    expect(child.files).toEqual([nested]);
  });

  it('skips the queried folder when the backend echoes it back', async () => {
    listDocuments.mockResolvedValueOnce([folder]);
    listDocuments.mockResolvedValueOnce([
      folder,
      { id: 'file-2', name: 'Photo.png', isFolder: false },
    ]);

    const { result } = renderHook(
      () => useGoogleDriveSearch(ROOT_ID, 'Mon Drive', 'user-1'),
      { wrapper: createWrapper() },
    );

    await act(async () => {
      await result.current.loadContent(ROOT_ID);
    });
    await act(async () => {
      await result.current.loadContent('folder-1');
    });

    const child = result.current.root.children?.[0] as {
      children?: unknown[];
      files?: { id: string }[];
    };
    expect(child.children).toEqual([]);
    expect(child.files?.map((f) => f.id)).toEqual(['file-2']);
  });

  it('exposes a load error, then clears it on the next success', async () => {
    listDocuments.mockRejectedValueOnce(new Error('boom'));

    const { result } = renderHook(
      () => useGoogleDriveSearch(ROOT_ID, 'Mon Drive', 'user-1'),
      { wrapper: createWrapper() },
    );

    await act(async () => {
      await result.current.loadContent(ROOT_ID);
    });
    await waitFor(() => expect(result.current.loadError).toBeTruthy());

    listDocuments.mockResolvedValueOnce([file]);
    await act(async () => {
      await result.current.loadContent(ROOT_ID);
    });

    await waitFor(() => expect(result.current.loadError).toBeNull());
  });

  /**
   * `Tree` fires onTreeItemClick and onTreeItemUnfold for the same node on a
   * single click, and revisiting a folder should not hit the network again.
   * Both are the reason loadContent goes through queryClient.fetchQuery.
   */
  it('dedupes concurrent loads of the same folder into one request', async () => {
    listDocuments.mockResolvedValue([file]);

    const { result } = renderHook(
      () => useGoogleDriveSearch(ROOT_ID, 'Mon Drive', 'user-1'),
      { wrapper: createWrapper() },
    );

    await act(async () => {
      await Promise.all([
        result.current.loadContent(ROOT_ID),
        result.current.loadContent(ROOT_ID),
      ]);
    });

    expect(listDocuments).toHaveBeenCalledTimes(1);
  });

  describe('shared filter', () => {
    const SHARED_ID = 'shared';

    function renderSharedSearch() {
      return renderHook(
        () => useGoogleDriveSearch(SHARED_ID, 'Partagés', 'user-1', 'shared'),
        { wrapper: createWrapper() },
      );
    }

    it('lists its root through the shared documents listing', async () => {
      listSharedDocuments.mockResolvedValue([folder, file]);

      const { result } = renderSharedSearch();
      await act(async () => {
        await result.current.loadContent(SHARED_ID);
      });

      expect(listSharedDocuments).toHaveBeenCalledWith('user-1');
      expect(listDocuments).not.toHaveBeenCalled();
      expect(result.current.root.children).toEqual([
        { id: 'folder-1', name: 'Photos' },
      ]);
      expect(result.current.root.files).toEqual([file]);
    });

    it('browses a shared folder through the regular listing', async () => {
      listSharedDocuments.mockResolvedValue([folder]);
      listDocuments.mockResolvedValue([file]);

      const { result } = renderSharedSearch();
      await act(async () => {
        await result.current.loadContent(SHARED_ID);
      });
      await act(async () => {
        await result.current.loadContent('folder-1');
      });

      expect(listDocuments).toHaveBeenCalledWith('user-1', 'folder-1');
    });

    it('hides a folder shared without edit rights', async () => {
      listSharedDocuments.mockResolvedValue([
        folder,
        {
          id: 'folder-2',
          name: 'Consignes',
          isFolder: true,
          canCopyToWorkspace: false,
        },
      ]);

      const { result } = renderSharedSearch();
      await act(async () => {
        await result.current.loadContent(SHARED_ID);
      });

      expect(result.current.root.children).toEqual([
        { id: 'folder-1', name: 'Photos' },
      ]);
    });
  });

  it('serves a revisited folder from cache without refetching', async () => {
    listDocuments.mockResolvedValueOnce([folder]);
    listDocuments.mockResolvedValueOnce([file]);

    const { result } = renderHook(
      () => useGoogleDriveSearch(ROOT_ID, 'Mon Drive', 'user-1'),
      { wrapper: createWrapper() },
    );

    await act(async () => {
      await result.current.loadContent(ROOT_ID);
    });
    await act(async () => {
      await result.current.loadContent('folder-1');
    });
    expect(listDocuments).toHaveBeenCalledTimes(2);

    await act(async () => {
      await result.current.loadContent('folder-1');
    });

    expect(listDocuments).toHaveBeenCalledTimes(2);
  });
});
