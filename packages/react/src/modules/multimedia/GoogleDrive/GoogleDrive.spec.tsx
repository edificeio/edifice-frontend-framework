import { GoogleDriveDocument } from '@edifice.io/client';
import { render, screen, waitFor } from '~/setup';
import { GoogleDriveFolderNode } from '../../../hooks/useGoogleDriveSearch/useGoogleDriveSearch';
import GoogleDrive from './GoogleDrive';

const { role, getFileUrl, useThumbnail, useGoogleDriveSearch, useUser } =
  vi.hoisted(() => ({
    role: vi.fn(() => 'doc'),
    getFileUrl: vi.fn(() => '/preview'),
    useThumbnail: vi.fn(() => false),
    useGoogleDriveSearch: vi.fn(),
    useUser: vi.fn(() => ({ user: { userId: 'user-1' } })),
  }));

vi.mock('@edifice.io/client', () => ({
  DocumentHelper: { role },
  odeServices: { googledrive: () => ({ getFileUrl }) },
}));

vi.mock('../../../hooks/useThumbnail', () => ({ useThumbnail }));

vi.mock('../../../hooks', async (importOriginal) => ({
  ...(await importOriginal<typeof import('../../../hooks')>()),
  useGoogleDriveSearch,
  useUser,
}));

function file(partial: Partial<GoogleDriveDocument> = {}): GoogleDriveDocument {
  return {
    id: 'file-a',
    name: 'a.txt',
    isFolder: false,
    ...partial,
  };
}

function defaultSearch() {
  const root: GoogleDriveFolderNode = {
    id: 'root',
    name: 'Mon Drive',
    section: true,
    files: [file({ id: 'file-b', name: 'b.txt', lastModified: '2024-01-01' })],
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
  useGoogleDriveSearch.mockReturnValue({ ...defaultSearch(), ...overrides });
}

describe('GoogleDrive', () => {
  beforeEach(() => {
    role.mockReturnValue('doc');
    useUser.mockReturnValue({ user: { userId: 'user-1' } });
  });

  it('loads the Drive root on mount', () => {
    const loadContent = vi.fn();
    mockSearch({ loadContent });

    render(<GoogleDrive onSelect={vi.fn()} />);

    expect(loadContent).toHaveBeenCalledWith('root');
  });

  it('goes straight to the files, with no connection screen', () => {
    mockSearch();

    render(<GoogleDrive onSelect={vi.fn()} />);

    expect(screen.getByText('b.txt')).toBeInTheDocument();
  });

  it('shows an error state with a retry when a folder fails to load', async () => {
    const loadContent = vi.fn();
    mockSearch({ loadError: new Error('boom'), loadContent });

    render(<GoogleDrive onSelect={vi.fn()} />);

    const retry = screen.getByRole('button', { name: 'retry' });
    retry.click();

    await waitFor(() => expect(loadContent).toHaveBeenCalledWith('root'));
  });

  it('filters the files by search term', async () => {
    mockSearch({
      root: {
        id: 'root',
        name: 'Mon Drive',
        section: true,
        files: [
          file({ id: '1', name: 'budget.xlsx' }),
          file({ id: '2', name: 'photo.png' }),
        ],
      },
    });

    render(<GoogleDrive onSelect={vi.fn()} />);
    const search = screen.getByRole('searchbox');
    const { fireEvent } = await import('@testing-library/react');
    fireEvent.change(search, { target: { value: 'budg' } });

    await waitFor(() => {
      expect(screen.getByText('budget.xlsx')).toBeInTheDocument();
      expect(screen.queryByText('photo.png')).not.toBeInTheDocument();
    });
  });

  it('filters the files by role', () => {
    role.mockImplementation((contentType: unknown) =>
      contentType === 'image/png' ? 'img' : 'doc',
    );
    mockSearch({
      root: {
        id: 'root',
        name: 'Mon Drive',
        section: true,
        files: [
          file({ id: '1', name: 'budget.xlsx', contentType: 'application/x' }),
          file({ id: '2', name: 'photo.png', contentType: 'image/png' }),
        ],
      },
    });

    render(<GoogleDrive onSelect={vi.fn()} roles="img" />);

    expect(screen.getByText('photo.png')).toBeInTheDocument();
    expect(screen.queryByText('budget.xlsx')).not.toBeInTheDocument();
  });

  describe('selection', () => {
    const docs = [
      file({ id: '1', name: 'one.txt' }),
      file({ id: '2', name: 'two.txt' }),
    ];

    // Files carry no `lastModified`, so the default 'modified desc' sort is a
    // no-op (stable sort) and cards render in `docs` order.
    const cardButtons = () =>
      screen.getAllByRole('button', { name: 'card.open.resource' });

    beforeEach(() => {
      mockSearch({
        root: { id: 'root', name: 'Mon Drive', section: true, files: docs },
      });
    });

    it('accumulates multiple selections and reports them', async () => {
      const onSelect = vi.fn();
      const { user } = render(<GoogleDrive onSelect={onSelect} multiple />);

      await user.click(cardButtons()[0]);
      await user.click(cardButtons()[1]);

      expect(onSelect).toHaveBeenLastCalledWith([docs[0], docs[1]]);
    });

    it('toggles a selection off by id, even across a fresh object for the same file', async () => {
      const onSelect = vi.fn();
      mockSearch({
        root: {
          id: 'root',
          name: 'Mon Drive',
          section: true,
          // A fresh object carrying the same id must still deselect.
          files: [file({ id: '1', name: 'one.txt' })],
        },
      });
      const { user } = render(<GoogleDrive onSelect={onSelect} multiple />);

      await user.click(cardButtons()[0]);
      await user.click(cardButtons()[0]);

      expect(onSelect).toHaveBeenLastCalledWith([]);
    });

    it('keeps only the last selection when multiple is false', async () => {
      const onSelect = vi.fn();
      const { user } = render(
        <GoogleDrive onSelect={onSelect} multiple={false} />,
      );

      await user.click(cardButtons()[0]);
      await user.click(cardButtons()[1]);

      expect(onSelect).toHaveBeenLastCalledWith([docs[1]]);
    });
  });
});
