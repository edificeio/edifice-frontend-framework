import type { IResource } from '@edifice.io/client';

import { act, renderHook, waitFor, wrapper } from '~/setup';
import usePublishModal, { type FormDataProps } from './usePublishModal';

const { httpGet, publish } = vi.hoisted(() => ({
  httpGet: vi.fn(),
  publish: vi.fn(),
}));

vi.mock('@edifice.io/client', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@edifice.io/client')>();
  return {
    ...actual,
    odeServices: {
      http: () => ({ get: httpGet }),
      resource: () => ({ publish }),
    },
  };
});

const { toastCustom } = vi.hoisted(() => ({ toastCustom: vi.fn() }));

vi.mock('react-hot-toast', () => ({
  default: { custom: toastCustom },
}));

// Builds a minimal resource, defaulting `thumbnail` to undefined so tests can
// opt into the "no cover / no thumbnail" branch without an empty string
// (which is still a truthy `typeof cover === 'string'` case in the hook).
function buildResource(overrides: Partial<IResource> = {}): IResource {
  return {
    assetId: 'asset-1',
    thumbnail: undefined,
    ...overrides,
  } as unknown as IResource;
}

const baseFormData: FormDataProps = {
  title: 'My title',
  description: '',
  activityType: '',
  subjectArea: '',
  language: 'fr',
  ageMin: '3',
  ageMax: '18',
  keyWords: '',
};

describe('usePublishModal', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('selectActivities / selectSubjects', () => {
    it('toggles a value into and out of selectedActivities', async () => {
      // `resource` must be a stable reference across re-renders: passing a
      // freshly built object inline would retrigger the "reset cover" effect
      // (dependency array [resource]) after every state update.
      const resource = buildResource();
      const { result } = renderHook(() => usePublishModal({ resource }), {
        wrapper,
      });
      // MockedProvider's QueryClientProvider settles a subscription update
      // one tick after mount, outside the initial act() scope; flush it
      // before interacting so React doesn't warn about it later.
      await waitFor(() => {});

      act(() => result.current.selectActivities('sport'));
      expect(result.current.selectedActivities).toEqual(['sport']);

      act(() => result.current.selectActivities('sport'));
      expect(result.current.selectedActivities).toEqual([]);
    });

    it('toggles a value into and out of selectedSubjectAreas', async () => {
      const resource = buildResource();
      const { result } = renderHook(() => usePublishModal({ resource }), {
        wrapper,
      });
      await waitFor(() => {});

      act(() => result.current.selectSubjects('math'));
      expect(result.current.selectedSubjectAreas).toEqual(['math']);

      act(() => result.current.selectSubjects('math'));
      expect(result.current.selectedSubjectAreas).toEqual([]);
    });
  });

  describe('handleUploadImage / handleDeleteImage', () => {
    it('sets cover from an uploaded file', async () => {
      const resource = buildResource();
      const { result } = renderHook(() => usePublishModal({ resource }), {
        wrapper,
      });
      await waitFor(() => {});

      const file = new File(['x'], 'cover.png', { type: 'image/png' });
      act(() => result.current.handleUploadImage(file));

      expect(result.current.cover).toBe(file);
    });

    it('clears cover on delete', async () => {
      const resource = buildResource();
      const { result } = renderHook(() => usePublishModal({ resource }), {
        wrapper,
      });
      await waitFor(() => {});

      act(() => result.current.handleDeleteImage());

      expect(result.current.cover).toBe('');
    });
  });

  describe('resource change effect', () => {
    it('resets cover to the new resource thumbnail when resource changes', async () => {
      const resourceA = buildResource({ thumbnail: 'thumb-a.png' });
      const resourceB = buildResource({ thumbnail: 'thumb-b.png' });

      const { result, rerender } = renderHook(
        ({ resource }) => usePublishModal({ resource }),
        { wrapper, initialProps: { resource: resourceA } },
      );
      await waitFor(() => {});

      act(() => result.current.handleUploadImage('changed.png'));
      expect(result.current.cover).toBe('changed.png');

      rerender({ resource: resourceB });

      expect(result.current.cover).toBe('thumb-b.png');
    });
  });

  describe('handlePublish', () => {
    beforeEach(() => {
      // odeServices.http().get() is called for the cover, the teacher
      // avatar and the attachment school. Route by URL shape so each test
      // only needs to care about the cover-fetch branch it exercises.
      httpGet.mockImplementation((url: string) => {
        if (typeof url === 'string' && url.includes('/userbook/avatar/')) {
          return Promise.resolve(new Blob(['avatar']));
        }
        if (typeof url === 'string' && url.includes('attachment-school')) {
          return Promise.resolve({ name: 'Attachment School' });
        }
        return Promise.resolve(new Blob(['cover']));
      });
    });

    it('publishes with a string cover and calls onSuccess on success', async () => {
      const onSuccess = vi.fn();
      const resource = buildResource({ thumbnail: 'https://x/thumb.png' });
      publish.mockResolvedValue({
        success: true,
        details: { front_url: 'https://x/published' },
      });

      const { result } = renderHook(
        () => usePublishModal({ resource, onSuccess }),
        { wrapper },
      );

      await act(async () => {
        await result.current.handlePublish(baseFormData);
      });

      expect(httpGet).toHaveBeenCalledWith('https://x/thumb.png', {
        responseType: 'blob',
      });
      expect(httpGet).toHaveBeenCalledTimes(3);
      expect(publish).toHaveBeenCalled();
      expect(onSuccess).toHaveBeenCalled();

      const [element] = toastCustom.mock.calls[0];
      expect(element.props.type).toBe('success');
    });

    it('publishes with a File/Blob cover using an object URL', async () => {
      const createObjectURL = vi.fn(() => 'blob:mock');
      URL.createObjectURL = createObjectURL;

      const onSuccess = vi.fn();
      const resource = buildResource();
      const file = new File(['x'], 'cover.png', { type: 'image/png' });
      publish.mockResolvedValue({ success: true, details: {} });

      const { result } = renderHook(
        () => usePublishModal({ resource, onSuccess }),
        { wrapper },
      );

      act(() => result.current.handleUploadImage(file));

      await act(async () => {
        await result.current.handlePublish(baseFormData);
      });

      expect(createObjectURL).toHaveBeenCalledWith(file);
      expect(httpGet).toHaveBeenCalledWith('blob:mock', {
        responseType: 'blob',
      });
      expect(onSuccess).toHaveBeenCalled();
    });

    it('keeps an empty Blob cover when there is no cover and no resource thumbnail', async () => {
      const onSuccess = vi.fn();
      const resource = buildResource({ thumbnail: undefined });
      publish.mockResolvedValue({ success: true, details: {} });

      const { result } = renderHook(
        () => usePublishModal({ resource, onSuccess }),
        { wrapper },
      );

      await act(async () => {
        await result.current.handlePublish(baseFormData);
      });

      // Only the teacher avatar and attachment school calls are made: no
      // extra call for the (absent) cover.
      expect(httpGet).toHaveBeenCalledTimes(2);
      expect(onSuccess).toHaveBeenCalled();
    });

    it('shows the content-too-large error and still calls onSuccess', async () => {
      const onSuccess = vi.fn();
      const resource = buildResource({ thumbnail: 'https://x/thumb.png' });
      publish.mockResolvedValue({
        success: false,
        message: 'CONTENT_TOO_LARGE',
      });

      const { result } = renderHook(
        () => usePublishModal({ resource, onSuccess }),
        { wrapper },
      );

      await act(async () => {
        await result.current.handlePublish(baseFormData);
      });

      const [element] = toastCustom.mock.calls[0];
      expect(element.props.type).toBe('danger');
      expect(element.props.children.props.errorMessage).toBe(
        'CONTENT_TOO_LARGE',
      );
      expect(onSuccess).toHaveBeenCalled();
    });

    it('shows a generic error for any other failure message', async () => {
      const onSuccess = vi.fn();
      const resource = buildResource({ thumbnail: 'https://x/thumb.png' });
      publish.mockResolvedValue({
        success: false,
        message: 'SOME_OTHER_REASON',
      });

      const { result } = renderHook(
        () => usePublishModal({ resource, onSuccess }),
        { wrapper },
      );

      await act(async () => {
        await result.current.handlePublish(baseFormData);
      });

      const [element] = toastCustom.mock.calls[0];
      expect(element.props.type).toBe('danger');
      expect(element.props.children.props.formData).toEqual(baseFormData);
      expect(onSuccess).toHaveBeenCalled();
    });

    it('catches a rejected publish call, logs it and shows an error without calling onSuccess', async () => {
      const consoleError = vi
        .spyOn(console, 'error')
        .mockImplementation(() => undefined);
      const onSuccess = vi.fn();
      const resource = buildResource({ thumbnail: 'https://x/thumb.png' });
      publish.mockRejectedValue(new Error('boom'));

      const { result } = renderHook(
        () => usePublishModal({ resource, onSuccess }),
        { wrapper },
      );

      await act(async () => {
        await result.current.handlePublish(baseFormData);
      });

      expect(consoleError).toHaveBeenCalled();
      const [element] = toastCustom.mock.calls[0];
      expect(element.props.type).toBe('danger');
      expect(onSuccess).not.toHaveBeenCalled();

      consoleError.mockRestore();
    });
  });
});
