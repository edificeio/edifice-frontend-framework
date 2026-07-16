import { act, renderHook } from '~/setup';
import useUpload from './useUpload';

const { upload, create, getOrGenerateBlobId, useBrowserInfo } = vi.hoisted(
  () => ({
    upload: vi.fn(),
    create: vi.fn(),
    getOrGenerateBlobId: vi.fn(),
    useBrowserInfo: vi.fn(),
  }),
);

vi.mock('@edifice.io/client', () => ({
  odeServices: {
    video: () => ({ upload }),
  },
  ERROR_CODE: { NOT_SUPPORTED: 'NOT_SUPPORTED' },
}));

vi.mock('@edifice.io/utilities', () => ({
  getOrGenerateBlobId,
}));

vi.mock('../../hooks', () => ({
  useBrowserInfo,
}));

vi.mock('../useWorkspaceFile', () => ({
  useWorkspaceFile: () => ({ create }),
}));

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

function createFile(name: string, type: string) {
  return new File(['content'], name, { type });
}

describe('useUpload', () => {
  beforeEach(() => {
    // Use the file/blob name as its blob id so statuses are keyed predictably.
    getOrGenerateBlobId.mockImplementation((blob: File | Blob) =>
      'name' in blob && blob.name ? blob.name : 'blob',
    );
    useBrowserInfo.mockReturnValue({
      browser: { name: 'chrome', version: '120' },
      device: { type: 'desktop' },
    });
  });

  it('tracks and clears upload status through the helpers', () => {
    const { result } = renderHook(() => useUpload());
    const file = createFile('a.png', 'image/png');

    expect(result.current.getUploadStatus(file)).toBeUndefined();

    act(() => result.current.setUploadStatus(file, 'success'));
    expect(result.current.getUploadStatus(file)).toBe('success');

    act(() => result.current.clearUploadStatus(file));
    expect(result.current.getUploadStatus(file)).toBeUndefined();
  });

  it('uploads a non-video file through the workspace and marks it success', async () => {
    const resource = { _id: 'res-1', name: 'a.png' };
    create.mockResolvedValue(resource);
    const { result } = renderHook(() => useUpload());
    const file = createFile('a.png', 'image/png');

    let uploaded;
    await act(async () => {
      uploaded = await result.current.uploadFile(file);
    });

    expect(create).toHaveBeenCalledWith(file, {
      application: 'media-library',
      visibility: undefined,
    });
    expect(uploaded).toBe(resource);
    expect(result.current.getUploadStatus(file)).toBe('success');
  });

  it('reencodes a video file through the video service in media-library', async () => {
    upload.mockResolvedValue({
      state: 'succeed',
      videoworkspaceid: 'ws-1',
      videoid: 'vid-1',
    });
    const { result } = renderHook(() => useUpload());
    const file = createFile('clip.mp4', 'video/mp4');

    let uploaded: any;
    await act(async () => {
      uploaded = await result.current.uploadFile(file);
    });

    expect(upload).toHaveBeenCalled();
    expect(create).not.toHaveBeenCalled();
    expect(uploaded._id).toBe('ws-1');
    expect(uploaded.file).toBe('vid-1');
    expect(result.current.getUploadStatus(file)).toBe('success');
  });

  it('marks the file as error and returns null when the upload fails', async () => {
    create.mockRejectedValue(new Error('boom'));
    const { result } = renderHook(() => useUpload());
    const file = createFile('a.png', 'image/png');

    let uploaded;
    await act(async () => {
      uploaded = await result.current.uploadFile(file);
    });

    expect(uploaded).toBeNull();
    expect(result.current.getUploadStatus(file)).toBe('error');
  });

  it('returns null for a non-video blob (unsupported)', async () => {
    const { result } = renderHook(() => useUpload());
    const blob = new Blob(['x'], { type: 'application/pdf' });

    let uploaded;
    await act(async () => {
      uploaded = await result.current.uploadBlob(blob);
    });

    expect(uploaded).toBeNull();
    expect(result.current.getUploadStatus(blob)).toBe('error');
  });

  it('uploads a video blob through the video service', async () => {
    upload.mockResolvedValue({
      state: 'succeed',
      videoworkspaceid: 'ws-2',
      videoid: 'vid-2',
    });
    const { result } = renderHook(() => useUpload());
    const blob = new Blob(['x'], { type: 'video/mp4' });

    let uploaded: any;
    await act(async () => {
      uploaded = await result.current.uploadBlob(blob);
    });

    expect(uploaded._id).toBe('ws-2');
    expect(result.current.getUploadStatus(blob)).toBe('success');
  });

  it('shares the original blob id when uploading an alternate file', async () => {
    create.mockResolvedValue({ _id: 'res', name: 'alt.png' });
    const { result } = renderHook(() => useUpload());
    const original = createFile('original.png', 'image/png');
    const replacement = createFile('alt.png', 'image/png');

    await act(async () => {
      await result.current.uploadAlternateFile(original, replacement);
    });

    // The alternate reuses the original's blob id.
    expect(getOrGenerateBlobId).toHaveBeenCalledWith(original);
    expect(getOrGenerateBlobId).toHaveBeenCalledWith(
      replacement,
      'original.png',
    );
  });
});
