import { act, renderHook, waitFor } from '~/setup';
import useWorkspaceSearch from './useWorkspaceSearch';

const { hasWorkflowRight, listDocuments } = vi.hoisted(() => ({
  hasWorkflowRight: vi.fn(),
  listDocuments: vi.fn(),
}));

vi.mock('@edifice.io/client', async (importOriginal) => {
  const actual = await importOriginal<Record<string, unknown>>();
  return {
    ...actual,
    odeServices: {
      rights: () => ({ sessionHasWorkflowRight: hasWorkflowRight }),
      workspace: () => ({ listDocuments }),
    },
  };
});

function image(id: string, name: string) {
  return {
    _id: id,
    name,
    eType: 'file',
    metadata: { 'content-type': 'image/png' },
  };
}

function pdf(id: string, name: string) {
  return {
    _id: id,
    name,
    eType: 'file',
    metadata: { 'content-type': 'application/pdf' },
  };
}

function folder(id: string, name: string) {
  return { _id: id, name, eType: 'folder' };
}

async function renderReady(format: any = null) {
  hasWorkflowRight.mockResolvedValue(true);
  const utils = renderHook(() =>
    useWorkspaceSearch('root-id', 'Root', 'all' as any, format),
  );
  await waitFor(() => expect(hasWorkflowRight).toHaveBeenCalledTimes(2));
  // Being called twice only proves the effects fired, not that their
  // resolved value has been applied to state yet. Await the actual
  // promises the hook is waiting on, inside act(), so the resulting
  // setState calls are flushed before the test proceeds.
  await act(async () => {
    await Promise.all(hasWorkflowRight.mock.results.map((r) => r.value));
  });
  return utils;
}

describe('useWorkspaceSearch', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('does nothing while the workflow rights have not resolved yet', async () => {
    hasWorkflowRight.mockReturnValue(new Promise(() => {}));
    listDocuments.mockResolvedValue([folder('f-1', 'Folder 1')]);

    const { result } = renderHook(() =>
      useWorkspaceSearch('root-id', 'Root', 'all' as any, null),
    );

    act(() => {
      result.current.loadContent('root-id');
    });

    expect(listDocuments).not.toHaveBeenCalled();
    expect(result.current.root.children).toBeUndefined();
  });

  it('does nothing when one of the two workflow rights resolves false', async () => {
    hasWorkflowRight.mockImplementation((workflow: string) =>
      Promise.resolve(workflow.endsWith('listDocuments')),
    );
    listDocuments.mockResolvedValue([folder('f-1', 'Folder 1')]);

    const { result } = renderHook(() =>
      useWorkspaceSearch('root-id', 'Root', 'all' as any, null),
    );
    await waitFor(() => expect(hasWorkflowRight).toHaveBeenCalledTimes(2));

    act(() => {
      result.current.loadContent('root-id');
    });

    expect(listDocuments).not.toHaveBeenCalled();
  });

  it('loads the root content, splitting subfolders and files', async () => {
    listDocuments.mockResolvedValue([
      folder('folder-1', 'Folder 1'),
      pdf('file-1', 'report.pdf'),
    ]);

    const { result } = await renderReady();

    await act(async () => {
      await result.current.loadContent('root-id');
    });

    expect(listDocuments).toHaveBeenCalledWith('all', '');
    expect(result.current.root.children).toEqual([
      { id: 'folder-1', name: 'Folder 1' },
    ]);
    expect(result.current.root.files).toEqual([pdf('file-1', 'report.pdf')]);
  });

  it('loads a nested folder content under the matching tree node', async () => {
    listDocuments
      .mockResolvedValueOnce([folder('folder-1', 'Folder 1')])
      .mockResolvedValueOnce([pdf('file-2', 'nested.pdf')]);

    const { result } = await renderReady();

    await act(async () => {
      await result.current.loadContent('root-id');
    });
    await act(async () => {
      await result.current.loadContent('folder-1');
    });

    expect(listDocuments).toHaveBeenLastCalledWith('all', 'folder-1');
    expect(result.current.root.children?.[0]).toEqual({
      id: 'folder-1',
      name: 'Folder 1',
      children: [],
      files: [pdf('file-2', 'nested.pdf')],
    });
  });

  it('always keeps folders regardless of the format filter', async () => {
    listDocuments.mockResolvedValue([
      folder('folder-1', 'Folder 1'),
      image('img-1', 'photo.png'),
    ]);

    const { result } = await renderReady('pdf');

    await act(async () => {
      await result.current.loadContent('root-id');
    });

    expect(result.current.root.children).toEqual([
      { id: 'folder-1', name: 'Folder 1' },
    ]);
    expect(result.current.root.files).toEqual([]);
  });

  it('keeps only files matching a single format role', async () => {
    listDocuments.mockResolvedValue([
      image('img-1', 'photo.png'),
      pdf('pdf-1', 'report.pdf'),
    ]);

    const { result } = await renderReady('img');

    await act(async () => {
      await result.current.loadContent('root-id');
    });

    expect(result.current.root.files).toEqual([image('img-1', 'photo.png')]);
  });

  it('keeps files matching any role in a format array', async () => {
    listDocuments.mockResolvedValue([
      image('img-1', 'photo.png'),
      pdf('pdf-1', 'report.pdf'),
    ]);

    const { result } = await renderReady(['img', 'pdf']);

    await act(async () => {
      await result.current.loadContent('root-id');
    });

    expect(result.current.root.files).toEqual([
      image('img-1', 'photo.png'),
      pdf('pdf-1', 'report.pdf'),
    ]);
  });
});
