import { WorkspaceElement } from '@edifice.io/client';

import { render, screen } from '~/setup';

import NewFolderForm from './NewFolderForm';

const { createFolderMutation } = vi.hoisted(() => ({
  createFolderMutation: {
    mutate: vi.fn(),
    isPending: false,
  },
}));

// Only useWorkspaceFolders is doubled: the barrel also feeds the FormControl and
// IconButton rendered here, and a wholesale mock would strip their hooks.
vi.mock('../../../../hooks', async (importOriginal) => ({
  ...(await importOriginal<typeof import('../../../../hooks')>()),
  useWorkspaceFolders: () => ({ createFolderMutation }),
}));

const setup = () => {
  const onClose = vi.fn();
  const onFolderCreated = vi.fn();
  const view = render(
    <NewFolderForm
      onClose={onClose}
      folderParentId="parent-id"
      onFolderCreated={onFolderCreated}
    />,
  );
  return { ...view, onClose, onFolderCreated };
};

const nameInput = () =>
  screen.getByPlaceholderText('workspace.folder.new.placeholder');
const submitButton = () =>
  screen.getByRole('button', { name: 'workspace.folder.new.create' });

/** Replays the mutation's onSuccess callback with the folder the API returned. */
const succeedWith = (folder: Partial<WorkspaceElement>) => {
  const [, options] = createFolderMutation.mutate.mock.calls[0];
  options.onSuccess(folder as WorkspaceElement);
};

describe('NewFolderForm', () => {
  beforeEach(() => {
    createFolderMutation.isPending = false;
  });

  it('focuses the name field on mount', () => {
    setup();

    expect(nameInput()).toHaveFocus();
  });

  it('creates the folder under the given parent', async () => {
    const { user } = setup();

    await user.type(nameInput(), 'Photos');
    await user.click(submitButton());

    expect(createFolderMutation.mutate).toHaveBeenCalledWith(
      { folderName: 'Photos', folderParentId: 'parent-id' },
      expect.anything(),
    );
  });

  it('submits on Enter too', async () => {
    const { user } = setup();

    await user.type(nameInput(), 'Photos{Enter}');

    expect(createFolderMutation.mutate).toHaveBeenCalled();
  });

  it('refuses to create a folder without a name', async () => {
    const { user } = setup();

    await user.click(submitButton());

    expect(createFolderMutation.mutate).not.toHaveBeenCalled();
  });

  describe('once the folder is created', () => {
    it('reports the new folder and closes', async () => {
      const { user, onClose, onFolderCreated } = setup();

      await user.type(nameInput(), 'Photos');
      await user.click(submitButton());
      succeedWith({ _id: 'new-folder-id' });

      expect(onFolderCreated).toHaveBeenCalledWith('new-folder-id');
      expect(onClose).toHaveBeenCalled();
    });

    it('closes anyway when the API answers without an id', async () => {
      const { user, onClose, onFolderCreated } = setup();

      await user.type(nameInput(), 'Photos');
      await user.click(submitButton());
      succeedWith({});

      expect(onFolderCreated).not.toHaveBeenCalled();
      expect(onClose).toHaveBeenCalled();
    });
  });

  it('locks the submit button while the creation is in flight', () => {
    createFolderMutation.isPending = true;

    setup();

    expect(submitButton()).toBeDisabled();
  });
});
