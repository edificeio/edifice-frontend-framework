import { act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import { renderHook, waitFor } from '~/setup';
import useNextcloudSearch from './useNextcloudSearch';

const { listDocuments, getOauth2Status } = vi.hoisted(() => ({
  listDocuments: vi.fn(),
  getOauth2Status: vi.fn(),
}));

vi.mock('@edifice.io/client', () => ({
  odeServices: { nextcloud: () => ({ listDocuments, getOauth2Status }) },
}));

const ROOT_ID = 'root';

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

describe('useNextcloudSearch', () => {
  beforeEach(() => {
    listDocuments.mockReset();
    getOauth2Status.mockReset();
  });

  it('needs auth while the connection status is unknown, then reflects it', async () => {
    getOauth2Status.mockResolvedValue({ connected: false });

    const { result } = renderHook(
      () => useNextcloudSearch(ROOT_ID, 'Nextcloud', 'user-1'),
      { wrapper: createWrapper() },
    );

    expect(result.current.isCheckingAuth).toBe(true);
    expect(result.current.needsAuth).toBe(true);

    await waitFor(() => expect(result.current.isCheckingAuth).toBe(false));
    expect(result.current.needsAuth).toBe(true);
  });

  it('does not check auth status without a userId', () => {
    renderHook(() => useNextcloudSearch(ROOT_ID, 'Nextcloud', undefined), {
      wrapper: createWrapper(),
    });

    expect(getOauth2Status).not.toHaveBeenCalled();
  });

  it('reports connected once the status query resolves', async () => {
    getOauth2Status.mockResolvedValue({ connected: true });

    const { result } = renderHook(
      () => useNextcloudSearch(ROOT_ID, 'Nextcloud', 'user-1'),
      { wrapper: createWrapper() },
    );

    await waitFor(() => expect(result.current.needsAuth).toBe(false));
  });

  it('exposes an auth error when the status check fails', async () => {
    getOauth2Status.mockRejectedValue(new Error('network down'));

    const { result } = renderHook(
      () => useNextcloudSearch(ROOT_ID, 'Nextcloud', 'user-1'),
      { wrapper: createWrapper() },
    );

    await waitFor(() => expect(result.current.isAuthError).toBe(true));
  });

  it('splits the root folder content into subfolders and files, skipping the folder itself', async () => {
    getOauth2Status.mockResolvedValue({ connected: true });
    listDocuments.mockResolvedValue([
      { path: '/', name: 'root', isFolder: true },
      { path: '/Documents/', name: 'Documents', isFolder: true },
      { path: '/report.pdf', name: 'report.pdf', isFolder: false },
    ]);

    const { result } = renderHook(
      () => useNextcloudSearch(ROOT_ID, 'Nextcloud', 'user-1'),
      { wrapper: createWrapper() },
    );

    await act(() => result.current.loadContent(ROOT_ID));

    expect(listDocuments).toHaveBeenCalledWith('user-1', undefined);
    expect(result.current.root.children).toEqual([
      { id: '/Documents/', name: 'Documents' },
    ]);
    expect(result.current.root.files).toEqual([
      { path: '/report.pdf', name: 'report.pdf', isFolder: false },
    ]);
  });

  it('loads a subfolder using its path and attaches its content to the matching node', async () => {
    getOauth2Status.mockResolvedValue({ connected: true });
    listDocuments
      .mockResolvedValueOnce([
        { path: '/Documents/', name: 'Documents', isFolder: true },
      ])
      .mockResolvedValueOnce([
        { path: '/Documents/notes.txt', name: 'notes.txt', isFolder: false },
      ]);

    const { result } = renderHook(
      () => useNextcloudSearch(ROOT_ID, 'Nextcloud', 'user-1'),
      { wrapper: createWrapper() },
    );

    await act(() => result.current.loadContent(ROOT_ID));
    await act(() => result.current.loadContent('/Documents/'));

    expect(listDocuments).toHaveBeenLastCalledWith('user-1', '/Documents/');
    const documentsNode = result.current.root.children?.find(
      (c) => c.id === '/Documents/',
    ) as { files?: unknown };
    expect(documentsNode?.files).toEqual([
      { path: '/Documents/notes.txt', name: 'notes.txt', isFolder: false },
    ]);
  });

  it('sets a load error when listing documents fails, without touching the tree', async () => {
    getOauth2Status.mockResolvedValue({ connected: true });
    listDocuments.mockRejectedValue(new Error('server error'));

    const { result } = renderHook(
      () => useNextcloudSearch(ROOT_ID, 'Nextcloud', 'user-1'),
      { wrapper: createWrapper() },
    );

    await act(() => result.current.loadContent(ROOT_ID));

    expect(result.current.loadError).not.toBeNull();
    expect(result.current.root.files).toBeUndefined();
  });

  it('clears a previous load error on a subsequent successful load', async () => {
    getOauth2Status.mockResolvedValue({ connected: true });
    listDocuments
      .mockRejectedValueOnce(new Error('server error'))
      .mockResolvedValueOnce([]);

    const { result } = renderHook(
      () => useNextcloudSearch(ROOT_ID, 'Nextcloud', 'user-1'),
      { wrapper: createWrapper() },
    );

    await act(() => result.current.loadContent(ROOT_ID));
    expect(result.current.loadError).not.toBeNull();

    await act(() => result.current.loadContent(ROOT_ID));
    expect(result.current.loadError).toBeNull();
  });
});
