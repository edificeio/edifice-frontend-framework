import { NextcloudDocument } from '@edifice.io/client';
import { render, screen, waitFor } from '~/setup';
import Nextcloud from './Nextcloud';
import { NextcloudFolderNode } from '../../../hooks/useNextcloudSearch/useNextcloudSearch';

const { role, getFileUrl, useThumbnail, useNextcloudSearch, useUser } =
  vi.hoisted(() => ({
    role: vi.fn(() => 'doc'),
    getFileUrl: vi.fn(() => '/preview'),
    useThumbnail: vi.fn(() => false),
    useNextcloudSearch: vi.fn(),
    useUser: vi.fn(() => ({ user: { userId: 'user-1' } })),
  }));

vi.mock('@edifice.io/client', () => ({
  DocumentHelper: { role },
  odeServices: { nextcloud: () => ({ getFileUrl }) },
}));

vi.mock('../../../hooks/useThumbnail', () => ({ useThumbnail }));

vi.mock('../../../hooks', async (importOriginal) => ({
  ...(await importOriginal<typeof import('../../../hooks')>()),
  useNextcloudSearch,
  useUser,
}));

function file(partial: Partial<NextcloudDocument> = {}): NextcloudDocument {
  return {
    path: '/a.txt',
    name: 'a.txt',
    isFolder: false,
    ...partial,
  };
}

function defaultSearch() {
  const root: NextcloudFolderNode = {
    id: 'root',
    name: 'Nextcloud',
    section: true,
    files: [
      file({ path: '/b.txt', name: 'b.txt', lastModified: '2024-01-01' }),
    ],
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
  useNextcloudSearch.mockReturnValue({ ...defaultSearch(), ...overrides });
}

describe('Nextcloud', () => {
  beforeEach(() => {
    role.mockReturnValue('doc');
    useUser.mockReturnValue({ user: { userId: 'user-1' } });
  });

  it('shows a loading screen while checking auth', () => {
    mockSearch({ isCheckingAuth: true });

    render(<Nextcloud onSelect={vi.fn()} />);

    expect(screen.getByAltText('loading')).toBeInTheDocument();
  });

  it('shows an error state with a retry when the auth check fails', async () => {
    const refetchAuthStatus = vi.fn();
    mockSearch({ isAuthError: true, refetchAuthStatus });

    const { user } = render(<Nextcloud onSelect={vi.fn()} />);

    await user.click(screen.getByRole('button', { name: 'retry' }));
    expect(refetchAuthStatus).toHaveBeenCalled();
  });

  it('offers a connect button when authentication is needed', async () => {
    mockSearch({ needsAuth: true });
    const openSpy = vi
      .spyOn(window, 'open')
      .mockReturnValue({ closed: false } as Window);

    const { user } = render(<Nextcloud onSelect={vi.fn()} />);

    await user.click(
      screen.getByRole('button', { name: 'nextcloud.auth.connect' }),
    );

    expect(openSpy).toHaveBeenCalledWith(
      expect.stringContaining('/nextcloud/user/oauth2/init'),
      '',
      expect.any(String),
    );
    openSpy.mockRestore();
  });

  it('shows an error state with a retry when loading a folder fails', async () => {
    const loadContent = vi.fn();
    mockSearch({ loadError: new Error('boom'), loadContent });

    const { user } = render(<Nextcloud onSelect={vi.fn()} />);

    await user.click(screen.getByRole('button', { name: 'retry' }));
    expect(loadContent).toHaveBeenCalledWith('root');
  });

  it('filters files case-insensitively by search term', async () => {
    mockSearch({
      root: {
        id: 'root',
        name: 'Nextcloud',
        section: true,
        files: [file({ path: '/Report.pdf', name: 'Report.pdf' })],
      },
    });

    const { user } = render(<Nextcloud onSelect={vi.fn()} />);

    await user.type(screen.getByRole('searchbox'), 'report');

    await waitFor(() =>
      expect(screen.getByText('Report.pdf')).toBeInTheDocument(),
    );

    await user.clear(screen.getByRole('searchbox'));
    await user.type(screen.getByRole('searchbox'), 'zzz');

    await waitFor(() =>
      expect(screen.queryByText('Report.pdf')).not.toBeInTheDocument(),
    );
  });

  it('only shows files matching the roles filter', () => {
    role.mockImplementation((contentType: string) =>
      contentType === 'image/png' ? 'img' : 'doc',
    );
    mockSearch({
      root: {
        id: 'root',
        name: 'Nextcloud',
        section: true,
        files: [
          file({ path: '/pic.png', name: 'pic.png', contentType: 'image/png' }),
          file({
            path: '/doc.txt',
            name: 'doc.txt',
            contentType: 'text/plain',
          }),
        ],
      },
    });

    render(<Nextcloud onSelect={vi.fn()} roles="img" />);

    expect(screen.getByText('pic.png')).toBeInTheDocument();
    expect(screen.queryByText('doc.txt')).not.toBeInTheDocument();
  });

  describe('sorting', () => {
    // Regression test for the reviewed `compare()` helper: two undefined
    // values must be treated as equal (not just "not greater"), and an
    // undefined `lastModified` must sort as the oldest/smallest value.
    it('sorts by last-modified descending by default, pushing undefined dates last', () => {
      mockSearch({
        root: {
          id: 'root',
          name: 'Nextcloud',
          section: true,
          files: [
            file({
              path: '/old.txt',
              name: 'old.txt',
              lastModified: '2024-01-01',
            }),
            file({ path: '/no-date.txt', name: 'no-date.txt' }),
            file({
              path: '/new.txt',
              name: 'new.txt',
              lastModified: '2024-06-01',
            }),
          ],
        },
      });

      render(<Nextcloud onSelect={vi.fn()} />);

      const names = screen.getAllByText(/\.txt$/).map((el) => el.textContent);
      expect(names).toEqual(['new.txt', 'old.txt', 'no-date.txt']);
    });

    it('sorts by name alphabetically when requested from the sort dropdown', async () => {
      mockSearch({
        root: {
          id: 'root',
          name: 'Nextcloud',
          section: true,
          files: [
            file({ path: '/b.txt', name: 'b.txt' }),
            file({ path: '/a.txt', name: 'a.txt' }),
          ],
        },
      });

      const { user } = render(<Nextcloud onSelect={vi.fn()} />);

      await user.click(screen.getByRole('button', { name: 'Last changes' }));
      await user.click(screen.getByRole('menuitem', { name: 'Asc order' }));

      const names = screen.getAllByText(/\.txt$/).map((el) => el.textContent);
      expect(names).toEqual(['a.txt', 'b.txt']);
    });
  });

  describe('selection', () => {
    const docs = [
      file({ path: '/a.txt', name: 'a.txt' }),
      file({ path: '/b.txt', name: 'b.txt' }),
    ];

    // Files carry no `lastModified`, so the default 'modified desc' sort is a
    // no-op (stable sort) and cards render in `docs` order.
    const cardButtons = () =>
      screen.getAllByRole('button', { name: 'card.open.resource' });

    beforeEach(() => {
      mockSearch({
        root: { id: 'root', name: 'Nextcloud', section: true, files: docs },
      });
    });

    it('accumulates multiple selections and reports them', async () => {
      const onSelect = vi.fn();
      const { user } = render(<Nextcloud onSelect={onSelect} multiple />);

      await user.click(cardButtons()[0]);
      await user.click(cardButtons()[1]);

      expect(onSelect).toHaveBeenLastCalledWith([docs[0], docs[1]]);
    });

    it('toggles a selection off by path, even across a fresh object for the same file', async () => {
      const onSelect = vi.fn();
      const { user, rerender } = render(
        <Nextcloud onSelect={onSelect} multiple />,
      );

      await user.click(cardButtons()[0]);
      expect(onSelect).toHaveBeenLastCalledWith([docs[0]]);

      // Simulate a refetch returning a brand new object instance for the same path.
      mockSearch({
        root: {
          id: 'root',
          name: 'Nextcloud',
          section: true,
          files: [file({ path: '/a.txt', name: 'a.txt' }), docs[1]],
        },
      });
      rerender(<Nextcloud onSelect={onSelect} multiple />);

      await user.click(cardButtons()[0]);

      // Clicking the already-selected file again should deselect it, not duplicate it.
      expect(onSelect).toHaveBeenLastCalledWith([]);
    });

    it('keeps only the last selection when multiple is false', async () => {
      const onSelect = vi.fn();
      const { user } = render(
        <Nextcloud onSelect={onSelect} multiple={false} />,
      );

      await user.click(cardButtons()[0]);
      await user.click(cardButtons()[1]);

      expect(onSelect).toHaveBeenLastCalledWith([docs[1]]);
    });
  });
});
