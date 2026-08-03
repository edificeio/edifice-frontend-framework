import { render, screen, waitFor } from '~/setup';
import {
  WORKSPACE_SHARED_FOLDER_ID,
  WORKSPACE_USER_FOLDER_ID,
} from '../../../hooks/useWorkspaceFolders';
import WorkspaceFolders from './WorkspaceFolders';

const {
  useWorkspaceFolders,
  useWorkspaceFoldersTree,
  canCopyFileIntoFolder,
  filterTree,
} = vi.hoisted(() => ({
  useWorkspaceFolders: vi.fn(),
  useWorkspaceFoldersTree: vi.fn(),
  canCopyFileIntoFolder: vi.fn(),
  filterTree: vi.fn(),
}));

vi.mock('../../../hooks', () => ({
  useWorkspaceFolders,
  useWorkspaceFoldersTree,
}));

// The tree has its own specs; here it only needs to let a folder be picked.
vi.mock('../../../components', async (importOriginal) => ({
  ...(await importOriginal<typeof import('../../../components')>()),
  Tree: ({
    nodes,
    onTreeItemClick,
  }: {
    nodes: { id: string; name: string }[];
    onTreeItemClick: (id: string) => void;
  }) => (
    <div>
      {nodes.map((node) => (
        <button key={node.id} onClick={() => onTreeItemClick(node.id)}>
          {node.name}
        </button>
      ))}
    </div>
  ),
}));

vi.mock('./components/NewFolderForm', () => ({
  default: ({
    folderParentId,
    onFolderCreated,
    onClose,
  }: {
    folderParentId: string;
    onFolderCreated: (id: string) => void;
    onClose: () => void;
  }) => (
    <div data-testid="new-folder-form" data-parent={folderParentId}>
      <button onClick={() => onFolderCreated('created-folder')}>create</button>
      <button onClick={onClose}>close</button>
    </div>
  ),
}));

const foldersTree = [
  { id: WORKSPACE_USER_FOLDER_ID, name: 'Mes documents' },
  { id: WORKSPACE_SHARED_FOLDER_ID, name: 'Partagés avec moi' },
  { id: 'folder-1', name: 'Photos de classe' },
];

function setup({ isLoading = false }: { isLoading?: boolean } = {}) {
  const onFolderSelected = vi.fn();

  useWorkspaceFolders.mockReturnValue({
    folders: [],
    isLoading,
    canCopyFileIntoFolder,
  });
  useWorkspaceFoldersTree.mockReturnValue({ foldersTree, filterTree });

  return {
    ...render(<WorkspaceFolders onFolderSelected={onFolderSelected} />),
    onFolderSelected,
  };
}

const createButton = () =>
  screen.getByRole('button', { name: /workspace.folder.create/ });

describe('WorkspaceFolders', () => {
  beforeEach(() => {
    canCopyFileIntoFolder.mockReturnValue(true);
  });

  it('shows a spinner while the folders load', () => {
    setup({ isLoading: true });

    expect(screen.queryByText('Mes documents')).not.toBeInTheDocument();
  });

  it('lists the folder tree once loaded', () => {
    setup();

    expect(screen.getByText('Mes documents')).toBeInTheDocument();
    expect(screen.getByText('Photos de classe')).toBeInTheDocument();
  });

  it('filters the tree on search submit', async () => {
    const { user } = setup();

    await user.type(screen.getByPlaceholderText('Search'), 'photo');
    await user.click(screen.getByRole('button', { name: 'Search' }));

    expect(filterTree).toHaveBeenCalledWith('photo');
  });

  describe('selecting a folder', () => {
    it('reports a regular folder and its copy permission', async () => {
      const { user, onFolderSelected } = setup();

      await user.click(screen.getByText('Photos de classe'));

      await waitFor(() =>
        expect(onFolderSelected).toHaveBeenCalledWith('folder-1', true),
      );
    });

    it('reports the user root as an empty parent id, as the API expects', async () => {
      const { user, onFolderSelected } = setup();

      await user.click(screen.getByText('Mes documents'));

      await waitFor(() =>
        expect(onFolderSelected).toHaveBeenCalledWith('', true),
      );
    });

    it('refuses copying into the shared root', async () => {
      const { user, onFolderSelected } = setup();

      await user.click(screen.getByText('Partagés avec moi'));

      await waitFor(() =>
        expect(onFolderSelected).toHaveBeenCalledWith(
          WORKSPACE_SHARED_FOLDER_ID,
          false,
        ),
      );
    });

    it('honors a folder the user cannot write into', async () => {
      canCopyFileIntoFolder.mockReturnValue(false);
      const { user, onFolderSelected } = setup();

      await user.click(screen.getByText('Photos de classe'));

      await waitFor(() =>
        expect(onFolderSelected).toHaveBeenCalledWith('folder-1', false),
      );
    });

    it('reports nothing until a folder is picked', () => {
      const { onFolderSelected } = setup();

      expect(onFolderSelected).not.toHaveBeenCalled();
    });
  });

  describe('creating a folder', () => {
    it('is disabled until a writable folder is selected', () => {
      setup();

      expect(createButton()).toBeDisabled();
    });

    it('is enabled once a writable folder is selected', async () => {
      const { user } = setup();

      await user.click(screen.getByText('Photos de classe'));

      await waitFor(() => expect(createButton()).toBeEnabled());
    });

    it('stays disabled on a read-only folder', async () => {
      canCopyFileIntoFolder.mockReturnValue(false);
      const { user } = setup();

      await user.click(screen.getByText('Photos de classe'));

      expect(createButton()).toBeDisabled();
    });

    it('opens the form on the selected folder', async () => {
      const { user } = setup();

      await user.click(screen.getByText('Photos de classe'));
      await user.click(createButton());

      expect(screen.getByTestId('new-folder-form')).toHaveAttribute(
        'data-parent',
        'folder-1',
      );
    });

    it('selects the folder it just created', async () => {
      const { user, onFolderSelected } = setup();

      await user.click(screen.getByText('Photos de classe'));
      await user.click(createButton());
      await user.click(screen.getByRole('button', { name: 'create' }));

      await waitFor(() =>
        expect(onFolderSelected).toHaveBeenCalledWith('created-folder', true),
      );
      expect(screen.queryByTestId('new-folder-form')).not.toBeInTheDocument();
    });

    it('closes the form on demand', async () => {
      const { user } = setup();

      await user.click(screen.getByText('Photos de classe'));
      await user.click(createButton());
      await user.click(screen.getByRole('button', { name: 'close' }));

      expect(screen.queryByTestId('new-folder-form')).not.toBeInTheDocument();
    });

    it('closes the form when another folder is picked', async () => {
      const { user } = setup();

      await user.click(screen.getByText('Photos de classe'));
      await user.click(createButton());
      await user.click(screen.getByText('Mes documents'));

      expect(screen.queryByTestId('new-folder-form')).not.toBeInTheDocument();
    });
  });
});
