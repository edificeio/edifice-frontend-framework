import { render, screen, waitFor } from '~/setup';
import NextcloudFolders from './NextcloudFolders';
import { NextcloudFolderNode } from '../../../hooks/useNextcloudSearch/useNextcloudSearch';

const { createFolder, useNextcloudSearch, useUser } = vi.hoisted(() => ({
  createFolder: vi.fn(),
  useNextcloudSearch: vi.fn(),
  useUser: vi.fn(() => ({ user: { userId: 'user-1' } })),
}));

vi.mock('@edifice.io/client', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@edifice.io/client')>()),
  odeServices: { nextcloud: () => ({ createFolder }) },
}));

vi.mock('../../../hooks', async (importOriginal) => ({
  ...(await importOriginal<typeof import('../../../hooks')>()),
  useNextcloudSearch,
  useUser,
}));

function defaultSearch() {
  const root: NextcloudFolderNode = {
    id: 'root',
    name: 'Nextcloud',
    section: true,
    children: [{ id: '/Documents/', name: 'Documents' }],
  };
  return {
    root,
    needsAuth: false,
    isCheckingAuth: false,
    isAuthError: false,
    refetchAuthStatus: vi.fn(),
    loadContent: vi.fn(),
    loadError: null,
  };
}

function mockSearch(overrides: Partial<ReturnType<typeof defaultSearch>> = {}) {
  const search = { ...defaultSearch(), ...overrides };
  useNextcloudSearch.mockReturnValue(search);
  return search;
}

describe('NextcloudFolders', () => {
  beforeEach(() => {
    createFolder.mockReset();
    useUser.mockReturnValue({ user: { userId: 'user-1' } });
  });

  it('shows the login screen with the given description when not connected', () => {
    mockSearch({ needsAuth: true });

    render(
      <NextcloudFolders
        onFolderSelected={vi.fn()}
        loginDescription="Send your documents to Nextcloud"
      />,
    );

    expect(
      screen.getByText('Send your documents to Nextcloud'),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'nextcloud.auth.connect' }),
    ).toBeInTheDocument();
  });

  it('retries the auth check when it fails', async () => {
    const { refetchAuthStatus } = mockSearch({
      needsAuth: true,
      isAuthError: true,
    });

    const { user } = render(<NextcloudFolders onFolderSelected={vi.fn()} />);

    await user.click(screen.getByRole('button', { name: 'retry' }));
    expect(refetchAuthStatus).toHaveBeenCalled();
  });

  it('reports the path of the selected folder, "/" for the root', async () => {
    const { loadContent } = mockSearch();
    const onFolderSelected = vi.fn();

    const { user } = render(
      <NextcloudFolders onFolderSelected={onFolderSelected} />,
    );

    await user.click(screen.getByText('Nextcloud'));
    expect(onFolderSelected).toHaveBeenLastCalledWith('/');

    await user.click(screen.getByText('Documents'));
    expect(onFolderSelected).toHaveBeenLastCalledWith('/Documents/');
    expect(loadContent).toHaveBeenCalledWith('/Documents/');
  });

  it('disables the folder creation until a folder is selected', () => {
    mockSearch();

    render(<NextcloudFolders onFolderSelected={vi.fn()} />);

    expect(
      screen.getByRole('button', { name: /workspace.folder.create/ }),
    ).toBeDisabled();
  });

  it('creates a folder in the selected folder and selects it', async () => {
    createFolder.mockResolvedValue(undefined);
    const { loadContent } = mockSearch();
    const onFolderSelected = vi.fn();

    const { user } = render(
      <NextcloudFolders onFolderSelected={onFolderSelected} />,
    );

    await user.click(screen.getByText('Nextcloud'));
    await user.click(screen.getByText('Documents'));
    await user.click(
      screen.getByRole('button', { name: /workspace.folder.create/ }),
    );
    await user.type(
      screen.getByPlaceholderText('workspace.folder.new.placeholder'),
      'Casier',
    );
    await user.click(
      screen.getByRole('button', { name: 'workspace.folder.new.create' }),
    );

    await waitFor(() =>
      expect(onFolderSelected).toHaveBeenLastCalledWith('/Documents/Casier/'),
    );
    expect(createFolder).toHaveBeenCalledWith('user-1', '/Documents/Casier/');
    expect(loadContent).toHaveBeenCalledWith('/Documents/', true);
  });

  async function createFolderNamed(name: string) {
    const utils = render(<NextcloudFolders onFolderSelected={vi.fn()} />);
    await utils.user.click(screen.getByText('Nextcloud'));
    await utils.user.click(screen.getByText('Documents'));
    await utils.user.click(
      screen.getByRole('button', { name: /workspace.folder.create/ }),
    );
    await utils.user.type(
      screen.getByPlaceholderText('workspace.folder.new.placeholder'),
      name,
    );
    await utils.user.click(
      screen.getByRole('button', { name: 'workspace.folder.new.create' }),
    );
  }

  it('selects the created folder only once its parent is refreshed', async () => {
    createFolder.mockResolvedValue(undefined);
    let resolveRefresh: () => void = () => {};
    const loadContent = vi.fn((_folderId?: string, force?: boolean) =>
      force
        ? new Promise<void>((resolve) => {
            resolveRefresh = resolve;
          })
        : Promise.resolve(),
    );
    mockSearch({ loadContent });
    const onFolderSelected = vi.fn();

    const { user } = render(
      <NextcloudFolders onFolderSelected={onFolderSelected} />,
    );
    await user.click(screen.getByText('Nextcloud'));
    await user.click(screen.getByText('Documents'));
    await user.click(
      screen.getByRole('button', { name: /workspace.folder.create/ }),
    );
    await user.type(
      screen.getByPlaceholderText('workspace.folder.new.placeholder'),
      'Casier',
    );
    await user.click(
      screen.getByRole('button', { name: 'workspace.folder.new.create' }),
    );

    await waitFor(() =>
      expect(loadContent).toHaveBeenCalledWith('/Documents/', true),
    );
    expect(onFolderSelected).not.toHaveBeenCalledWith('/Documents/Casier/');

    resolveRefresh();

    await waitFor(() =>
      expect(onFolderSelected).toHaveBeenLastCalledWith('/Documents/Casier/'),
    );
  });

  it.each(['.', '..'])('does not create a folder named "%s"', async (name) => {
    mockSearch();

    await createFolderNamed(name);

    expect(createFolder).not.toHaveBeenCalled();
  });

  it('replaces the path separators in the folder name', async () => {
    createFolder.mockResolvedValue(undefined);
    mockSearch();

    await createFolderNamed('Cours/2026\\Maths');

    await waitFor(() =>
      expect(createFolder).toHaveBeenCalledWith(
        'user-1',
        '/Documents/Cours-2026-Maths/',
      ),
    );
  });
});
