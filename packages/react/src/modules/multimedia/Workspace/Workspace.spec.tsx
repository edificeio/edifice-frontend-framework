import { Role, WorkspaceElement } from '@edifice.io/client';
import { render, screen, waitFor } from '~/setup';
import Workspace from './Workspace';

const { useWorkspaceSearch, findTreeNode } = vi.hoisted(() => ({
  useWorkspaceSearch: vi.fn(),
  findTreeNode: vi.fn(),
}));

// Only the workspace search is replaced: the real components pulled in by this
// spec (Dropdown, SearchBar) rely on other hooks of the same barrel.
vi.mock('../../../hooks', async (importOriginal) => ({
  ...(await importOriginal<typeof import('../../../hooks')>()),
  useWorkspaceSearch,
}));

vi.mock('../../../components/TreeView/utilities', () => ({ findTreeNode }));

// Each TreeView is replaced by a button per filter, plus a spy on the
// imperative `unselectAll` the component uses to reset the other trees.
const unselectAll = vi.fn();
vi.mock('../../../components', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../../../components')>();
  const { forwardRef, useImperativeHandle } = await import('react');

  return {
    ...actual,
    TreeView: forwardRef(
      (
        {
          data,
          onTreeItemClick,
        }: {
          data: { id: string; name: string };
          onTreeItemClick: (nodeId: string) => void;
        },
        ref,
      ) => {
        useImperativeHandle(ref, () => ({
          unselectAll,
          select: (nodeId: string) => onTreeItemClick(nodeId),
        }));

        return (
          <button
            data-testid={`tree-${data.name}`}
            onClick={() => onTreeItemClick('node-1')}
          >
            {data.name}
          </button>
        );
      },
    ),
  };
});

vi.mock('../FileCard', () => ({
  FileCard: ({
    doc,
    isSelected,
    onClick,
  }: {
    doc: WorkspaceElement;
    isSelected: boolean;
    onClick: () => void;
  }) => (
    <button
      data-testid={`file-${doc._id}`}
      data-selected={isSelected}
      onClick={onClick}
    >
      {doc.name}
    </button>
  ),
}));

function element(
  partial: Partial<WorkspaceElement> & { _id: string; modified?: string },
): WorkspaceElement {
  return {
    name: `file-${partial._id}`,
    modified: '2026-01-01',
    ...partial,
  } as unknown as WorkspaceElement;
}

function root(name: string, files?: WorkspaceElement[]) {
  return { id: 'root', name, files, children: [] };
}

function setup(
  options: {
    files?: WorkspaceElement[] | undefined;
    multiple?: boolean;
    showPublicFolder?: boolean;
    defaultFolder?: 'owner' | 'shared' | 'protected' | 'public';
  } = {},
) {
  const { multiple = true, showPublicFolder = false, defaultFolder } = options;
  // An explicit `files: undefined` means "folder not loaded yet" and must
  // survive, hence the key check rather than a default parameter.
  const files = 'files' in options ? options.files : [element({ _id: 'a' })];
  const loaders: Record<string, ReturnType<typeof vi.fn>> = {};
  const roots: Record<string, ReturnType<typeof root>> = {};

  // The roots must keep their identity across renders — the real hook holds them
  // in a reducer. A fresh object per render would retrigger the effect that
  // rebuilds the document list, and the component would re-render forever.
  useWorkspaceSearch.mockImplementation(
    (_id: string, name: string, filter: string) => {
      loaders[filter] = loaders[filter] ?? vi.fn();
      roots[filter] = roots[filter] ?? root(name, files);
      return { root: roots[filter], loadContent: loaders[filter] };
    },
  );
  findTreeNode.mockImplementation((node: { files?: unknown }) => node);

  const onSelect = vi.fn();

  return {
    ...render(
      <Workspace
        roles={'img' as Role}
        onSelect={onSelect}
        multiple={multiple}
        showPublicFolder={showPublicFolder}
        defaultFolder={defaultFolder}
      />,
    ),
    onSelect,
    loaders,
  };
}

describe('Workspace', () => {
  it('shows one tree per workspace filter', () => {
    setup();

    expect(screen.getByTestId('tree-My folder')).toBeInTheDocument();
    expect(screen.getByTestId('tree-Shared')).toBeInTheDocument();
    expect(screen.getByTestId('tree-Private')).toBeInTheDocument();
  });

  it('hides the public folder by default', () => {
    setup();

    expect(screen.queryByTestId('tree-Public folder')).not.toBeInTheDocument();
  });

  it('shows the public folder on demand', () => {
    setup({ showPublicFolder: true });

    expect(screen.getByTestId('tree-Public folder')).toBeInTheDocument();
  });

  it('queries every filter for the requested roles', () => {
    setup();

    expect(useWorkspaceSearch).toHaveBeenCalledWith(
      'root',
      'My folder',
      'owner',
      'img',
    );
    expect(useWorkspaceSearch).toHaveBeenCalledWith(
      'root',
      'Shared',
      'shared',
      'img',
    );
  });

  describe('default folder', () => {
    it('starts on the owner folder', async () => {
      const { loaders } = setup();

      await waitFor(() => expect(loaders.owner).toHaveBeenCalled());
    });

    it('honors the shared folder', async () => {
      const { loaders } = setup({ defaultFolder: 'shared' });

      await waitFor(() => expect(loaders.shared).toHaveBeenCalled());
    });

    it('honors the protected folder', async () => {
      const { loaders } = setup({ defaultFolder: 'protected' });

      await waitFor(() => expect(loaders.protected).toHaveBeenCalled());
    });

    it('honors the public folder when it is visible', async () => {
      const { loaders } = setup({
        defaultFolder: 'public',
        showPublicFolder: true,
      });

      await waitFor(() => expect(loaders.public).toHaveBeenCalled());
    });

    it('falls back to the protected folder when the public one is hidden', async () => {
      const { loaders } = setup({ defaultFolder: 'public' });

      await waitFor(() => expect(loaders.protected).toHaveBeenCalled());
      expect(loaders.public).not.toHaveBeenCalled();
    });
  });

  describe('documents', () => {
    it('shows a spinner while the folder has no file list', () => {
      setup({ files: undefined });

      expect(screen.queryByTestId(/^file-/)).not.toBeInTheDocument();
    });

    it('lists the documents of the current folder', async () => {
      setup({ files: [element({ _id: 'a' }), element({ _id: 'b' })] });

      expect(await screen.findByTestId('file-a')).toBeInTheDocument();
      expect(screen.getByTestId('file-b')).toBeInTheDocument();
    });

    it('shows an empty screen on an empty folder', async () => {
      setup({ files: [] });

      expect(await screen.findByText("It's empty here!")).toBeInTheDocument();
    });

    it('filters the documents by name', async () => {
      const { user } = setup({
        files: [
          element({ _id: 'a', name: 'photo-classe.png' }),
          element({ _id: 'b', name: 'rapport.pdf' }),
        ],
      });
      await screen.findByTestId('file-a');

      await user.type(screen.getByRole('searchbox'), 'photo');

      await waitFor(() =>
        expect(screen.queryByTestId('file-b')).not.toBeInTheDocument(),
      );
      expect(screen.getByTestId('file-a')).toBeInTheDocument();
    });
  });

  describe('sort order', () => {
    it('sorts by last change by default', async () => {
      setup({
        files: [
          element({ _id: 'old', modified: '2025-01-01' }),
          element({ _id: 'recent', modified: '2026-06-01' }),
        ],
      });

      await screen.findByTestId('file-recent');
      const cards = screen.getAllByTestId(/^file-/);
      expect(cards[0]).toHaveAttribute('data-testid', 'file-recent');
      expect(screen.getByText('Last changes')).toBeInTheDocument();
    });

    it('sorts by ascending name on demand', async () => {
      const { user } = setup({
        files: [
          element({ _id: 'b', name: 'beta' }),
          element({ _id: 'a', name: 'alpha' }),
        ],
      });
      await screen.findByTestId('file-a');

      await user.click(screen.getByRole('button', { name: 'Last changes' }));
      await user.click(screen.getByRole('menuitem', { name: 'Asc order' }));

      const cards = screen.getAllByTestId(/^file-/);
      expect(cards[0]).toHaveAttribute('data-testid', 'file-a');
    });

    it('sorts by descending name on demand', async () => {
      const { user } = setup({
        files: [
          element({ _id: 'a', name: 'alpha' }),
          element({ _id: 'b', name: 'beta' }),
        ],
      });
      await screen.findByTestId('file-a');

      await user.click(screen.getByRole('button', { name: 'Last changes' }));
      await user.click(screen.getByRole('menuitem', { name: 'Desc order' }));

      const cards = screen.getAllByTestId(/^file-/);
      expect(cards[0]).toHaveAttribute('data-testid', 'file-b');
    });

    it('comes back to the last changes order', async () => {
      const { user } = setup();
      await screen.findByTestId('file-a');

      await user.click(screen.getByRole('button', { name: 'Last changes' }));
      await user.click(screen.getByRole('menuitem', { name: 'Asc order' }));
      await user.click(screen.getByRole('button', { name: 'Asc order' }));
      await user.click(screen.getByRole('menuitem', { name: 'Last changes' }));

      expect(
        screen.getByRole('button', { name: 'Last changes' }),
      ).toBeInTheDocument();
    });
  });

  describe('selection', () => {
    it('selects a document and reports it', async () => {
      const { user, onSelect } = setup();
      const card = await screen.findByTestId('file-a');

      await user.click(card);

      expect(onSelect).toHaveBeenLastCalledWith([
        expect.objectContaining({ _id: 'a' }),
      ]);
      expect(screen.getByTestId('file-a')).toHaveAttribute(
        'data-selected',
        'true',
      );
    });

    it('accumulates the selection in multiple mode', async () => {
      const { user, onSelect } = setup({
        files: [element({ _id: 'a' }), element({ _id: 'b' })],
      });
      await screen.findByTestId('file-a');

      await user.click(screen.getByTestId('file-a'));
      await user.click(screen.getByTestId('file-b'));

      expect(onSelect).toHaveBeenLastCalledWith([
        expect.objectContaining({ _id: 'a' }),
        expect.objectContaining({ _id: 'b' }),
      ]);
    });

    it('deselects a document clicked twice', async () => {
      const { user, onSelect } = setup();
      await screen.findByTestId('file-a');

      await user.click(screen.getByTestId('file-a'));
      await user.click(screen.getByTestId('file-a'));

      expect(onSelect).toHaveBeenLastCalledWith([]);
    });

    it('replaces the selection in single mode', async () => {
      const { user, onSelect } = setup({
        multiple: false,
        files: [element({ _id: 'a' }), element({ _id: 'b' })],
      });
      await screen.findByTestId('file-a');

      await user.click(screen.getByTestId('file-a'));
      await user.click(screen.getByTestId('file-b'));

      expect(onSelect).toHaveBeenLastCalledWith([
        expect.objectContaining({ _id: 'b' }),
      ]);
    });
  });

  describe('switching folder', () => {
    it('loads the content of the picked tree and resets the others', async () => {
      const { user, loaders } = setup();
      unselectAll.mockClear();

      await user.click(screen.getByTestId('tree-Shared'));

      await waitFor(() => expect(loaders.shared).toHaveBeenCalled());
      expect(unselectAll).toHaveBeenCalled();
    });

    it('keeps the current node when the target is unknown', async () => {
      findTreeNode.mockReturnValue(undefined);
      const { user } = setup();

      await user.click(screen.getByTestId('tree-Shared'));

      expect(screen.getByTestId('tree-Shared')).toBeInTheDocument();
    });
  });

  it('appends the custom classes to the workspace', () => {
    const stableRoots: Record<string, ReturnType<typeof root>> = {};
    useWorkspaceSearch.mockImplementation((_id: string, name: string) => {
      stableRoots[name] = stableRoots[name] ?? root(name, []);
      return { root: stableRoots[name], loadContent: vi.fn() };
    });
    findTreeNode.mockImplementation((node: unknown) => node);

    render(
      <Workspace roles={null} onSelect={vi.fn()} className="my-workspace" />,
    );

    expect(document.querySelector('.workspace')).toHaveClass('my-workspace');
  });
});
