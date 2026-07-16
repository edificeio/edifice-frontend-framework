import { act, renderHook, waitFor } from '~/setup';
import useUploadFiles from './useUploadFiles';

const {
  useDropzoneContext,
  useUpload,
  remove,
  createOrUpdate,
  resizeImageFile,
  addTimestampToImageUrl,
  uploadFile,
  uploadAlternateFile,
} = vi.hoisted(() => ({
  useDropzoneContext: vi.fn(),
  useUpload: vi.fn(),
  remove: vi.fn(),
  createOrUpdate: vi.fn(),
  resizeImageFile: vi.fn(),
  addTimestampToImageUrl: vi.fn(),
  uploadFile: vi.fn(),
  uploadAlternateFile: vi.fn(),
}));

vi.mock('../../components', () => ({
  useDropzoneContext,
}));

vi.mock('../useUpload', () => ({
  useUpload,
}));

vi.mock('../useWorkspaceFile', () => ({
  useWorkspaceFile: () => ({ remove, createOrUpdate }),
}));

vi.mock('@edifice.io/utilities', () => ({
  ImageResizer: { resizeImageFile },
  addTimestampToImageUrl,
}));

function createFile(name: string, type: string) {
  return new File(['content'], name, { type });
}

// Stateful upload-status backing store shared by the mocked useUpload helpers.
// It mirrors the real hook closely enough to stop the upload useEffect from
// re-uploading the same file on every re-render.
let statusMap: Map<string, string>;

const deleteFile = vi.fn();
const replaceFileAt = vi.fn();

function setup(files: File[]) {
  const handleOnChange = vi.fn();
  const inputRef = { current: { value: '' } as HTMLInputElement };

  useDropzoneContext.mockReturnValue({
    files,
    deleteFile,
    replaceFileAt,
    inputRef,
  });

  const view = renderHook(() => useUploadFiles({ handleOnChange }));
  return { ...view, handleOnChange };
}

describe('useUploadFiles', () => {
  beforeEach(() => {
    statusMap = new Map();
    useUpload.mockReturnValue({
      getUploadStatus: (file: File) => statusMap.get(file.name),
      setUploadStatus: (file: File, status: string) =>
        statusMap.set(file.name, status),
      clearUploadStatus: (file: File) => statusMap.delete(file.name),
      uploadFile,
      uploadAlternateFile,
    });
  });

  it('notifies with an empty list when there are no files', async () => {
    const { handleOnChange } = setup([]);

    await waitFor(() => expect(handleOnChange).toHaveBeenCalledWith([]));
  });

  it('resizes and uploads an image via uploadAlternateFile', async () => {
    const file = createFile('photo.png', 'image/png');
    const replacement = createFile('photo.png', 'image/png');
    const resource = { _id: 'res-1', name: 'photo.png' };
    resizeImageFile.mockResolvedValue(replacement);
    uploadAlternateFile.mockResolvedValue(resource);

    const { handleOnChange } = setup([file]);

    await waitFor(() =>
      expect(uploadAlternateFile).toHaveBeenCalledWith(file, replacement),
    );
    expect(replaceFileAt).toHaveBeenCalledWith(0, replacement);
    await waitFor(() =>
      expect(handleOnChange).toHaveBeenCalledWith([resource]),
    );
  });

  it('uploads a non-image file via uploadFile', async () => {
    const file = createFile('doc.pdf', 'application/pdf');
    const resource = { _id: 'res-2', name: 'doc.pdf' };
    uploadFile.mockResolvedValue(resource);

    const { handleOnChange } = setup([file]);

    await waitFor(() => expect(uploadFile).toHaveBeenCalledWith(file));
    expect(uploadAlternateFile).not.toHaveBeenCalled();
    await waitFor(() =>
      expect(handleOnChange).toHaveBeenCalledWith([resource]),
    );
  });

  describe('getUrl', () => {
    it('builds a workspace document url', () => {
      const { result } = setup([]);

      expect(result.current.getUrl({ _id: 'doc-1' } as any)).toBe(
        '/workspace/document/doc-1',
      );
    });

    it('uses the public path for a public resource', () => {
      const { result } = setup([]);

      expect(result.current.getUrl({ _id: 'doc-1', public: true } as any)).toBe(
        '/workspace/pub/document/doc-1',
      );
    });

    it('appends a timestamp when requested', () => {
      addTimestampToImageUrl.mockReturnValue('/workspace/document/doc-1?ts=1');
      const { result } = setup([]);

      expect(result.current.getUrl({ _id: 'doc-1' } as any, true)).toBe(
        '/workspace/document/doc-1?ts=1',
      );
      expect(addTimestampToImageUrl).toHaveBeenCalledWith(
        '/workspace/document/doc-1',
      );
    });

    it('returns an empty string when there is no resource', () => {
      const { result } = setup([]);

      expect(result.current.getUrl(undefined)).toBe('');
    });
  });

  it('removes an uploaded file and clears its status', async () => {
    const file = createFile('doc.pdf', 'application/pdf');
    const resource = { _id: 'res-2', name: 'doc.pdf' };
    uploadFile.mockResolvedValue(resource);

    const { result, handleOnChange } = setup([file]);

    // Wait for the file to be uploaded first.
    await waitFor(() =>
      expect(handleOnChange).toHaveBeenCalledWith([resource]),
    );

    await act(async () => {
      await result.current.removeFile(file);
    });

    expect(remove).toHaveBeenCalledWith(resource);
    expect(deleteFile).toHaveBeenCalledWith(file);
  });
});
