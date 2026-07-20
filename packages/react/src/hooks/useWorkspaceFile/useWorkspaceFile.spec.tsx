import { renderHook } from '~/setup';
import useWorkspaceFile from './useWorkspaceFile';

const { searchDocuments, updateFile, saveFile, deleteFile } = vi.hoisted(
  () => ({
    searchDocuments: vi.fn(),
    updateFile: vi.fn(),
    saveFile: vi.fn(),
    deleteFile: vi.fn(),
  }),
);

vi.mock('@edifice.io/client', () => ({
  odeServices: {
    workspace: () => ({
      searchDocuments,
      updateFile,
      saveFile,
      deleteFile,
    }),
  },
}));

describe('useWorkspaceFile', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('createOrUpdate', () => {
    it('creates a new file when uri is not a workspace document URI', async () => {
      saveFile.mockResolvedValue({ _id: 'new-id', public: false });
      const { result } = renderHook(() => useWorkspaceFile());

      const src = await result.current.createOrUpdate({
        blob: new Blob(['x']),
        application: 'blog',
        parentId: 'folder-1',
      });

      expect(saveFile).toHaveBeenCalledWith(expect.any(Blob), {
        application: 'blog',
        parentId: 'folder-1',
        visibility: undefined,
      });
      expect(src).toBe('/workspace/document/new-id');
    });

    it('uses the public path when the created file is public', async () => {
      saveFile.mockResolvedValue({ _id: 'new-id', public: true });
      const { result } = renderHook(() => useWorkspaceFile());

      const src = await result.current.createOrUpdate({
        blob: new Blob(['x']),
      });

      expect(src).toBe('/workspace/pub/document/new-id');
    });

    it('updates the existing file when uri points to a workspace document', async () => {
      searchDocuments
        .mockResolvedValueOnce([{ _id: 'abc-123', name: 'old-name.png' }])
        .mockResolvedValueOnce([
          { _id: 'abc-123', name: 'old-name.png', public: false },
        ]);
      updateFile.mockResolvedValue(undefined);
      const { result } = renderHook(() => useWorkspaceFile());

      const updated = await result.current.createOrUpdate({
        blob: new Blob(['x']),
        uri: '/workspace/document/abc-123',
        alt: 'new alt',
        legend: 'new legend',
      });

      expect(updateFile).toHaveBeenCalledWith('abc-123', expect.any(Blob), {
        alt: 'new alt',
        legend: 'new legend',
        name: 'old-name.png',
      });
      expect(updated).toEqual({
        file: { _id: 'abc-123', name: 'old-name.png', public: false },
        src: '/workspace/document/abc-123',
      });
    });

    it('uses the public path when the updated file is public', async () => {
      searchDocuments
        .mockResolvedValueOnce([{ _id: 'abc-123', name: 'old-name.png' }])
        .mockResolvedValueOnce([
          { _id: 'abc-123', name: 'old-name.png', public: true },
        ]);
      updateFile.mockResolvedValue(undefined);
      const { result } = renderHook(() => useWorkspaceFile());

      const updated = await result.current.createOrUpdate({
        blob: new Blob(['x']),
        uri: '/workspace/document/abc-123',
      });

      expect(updated.src).toBe('/workspace/pub/document/abc-123');
    });
  });

  describe('create', () => {
    it('saves a file through the workspace service', async () => {
      const resource = { _id: 'res-1' };
      saveFile.mockResolvedValue(resource);
      const { result } = renderHook(() => useWorkspaceFile());
      const file = new File(['x'], 'a.png', { type: 'image/png' });

      const saved = await result.current.create(file, {
        application: 'media-library',
      });

      expect(saveFile).toHaveBeenCalledWith(file, {
        application: 'media-library',
      });
      expect(saved).toBe(resource);
    });
  });

  describe('remove', () => {
    it('deletes a single file wrapped in an array', async () => {
      const { result } = renderHook(() => useWorkspaceFile());
      const file = { _id: 'f-1' } as any;

      await result.current.remove(file);

      expect(deleteFile).toHaveBeenCalledWith([file]);
    });

    it('deletes an array of files as-is', async () => {
      const { result } = renderHook(() => useWorkspaceFile());
      const files = [{ _id: 'f-1' }, { _id: 'f-2' }] as any;

      await result.current.remove(files);

      expect(deleteFile).toHaveBeenCalledWith(files);
    });

    it('is a no-op for an empty array', async () => {
      const { result } = renderHook(() => useWorkspaceFile());

      await result.current.remove([]);

      expect(deleteFile).not.toHaveBeenCalled();
    });
  });
});
