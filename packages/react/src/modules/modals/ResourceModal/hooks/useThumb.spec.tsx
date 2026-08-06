import { IResource } from '@edifice.io/client';

import { act, renderHook } from '~/setup';
import { useThumb } from './useThumb';

// The hook resets `thumbnail` via a mount effect that runs right after the
// first render, which normally hides the difference between the two
// `isUpdating` branches of the initial `useState`. To make that initial
// value observable, `useEffect` is stubbed out for a subset of tests so the
// reset effect never fires and the raw initial state can be asserted.
const { effectControl } = vi.hoisted(() => ({
  effectControl: { blocked: false },
}));

vi.mock('react', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react')>();
  return {
    ...actual,
    useEffect: (effect: () => void, deps?: unknown[]) => {
      if (effectControl.blocked) {
        return;
      }
      return actual.useEffect(effect, deps);
    },
  };
});

const buildResource = (overrides: Partial<IResource> = {}): IResource =>
  ({
    thumbnail: '',
    ...overrides,
  }) as IResource;

describe('useThumb', () => {
  afterEach(() => {
    effectControl.blocked = false;
  });

  describe('initial state (mount effect disabled)', () => {
    it('starts with the resource thumbnail when isUpdating is true and the resource has one', () => {
      effectControl.blocked = true;
      const resource = buildResource({ thumbnail: 'thumb-url' });

      const { result } = renderHook(() =>
        useThumb({ isUpdating: true, selectedResource: resource }),
      );

      expect(result.current.thumbnail).toBe('thumb-url');
    });

    it('starts empty when isUpdating is true and the resource has no thumbnail', () => {
      effectControl.blocked = true;
      const resource = buildResource({ thumbnail: '' });

      const { result } = renderHook(() =>
        useThumb({ isUpdating: true, selectedResource: resource }),
      );

      expect(result.current.thumbnail).toBe('');
    });

    it('always starts empty when isUpdating is false, even if the resource has a thumbnail', () => {
      effectControl.blocked = true;
      const resource = buildResource({ thumbnail: 'thumb-url' });

      const { result } = renderHook(() =>
        useThumb({ isUpdating: false, selectedResource: resource }),
      );

      expect(result.current.thumbnail).toBe('');
    });
  });

  describe('mount effect', () => {
    it('resets the thumbnail to the resource one on mount, regardless of isUpdating', () => {
      const resource = buildResource({ thumbnail: 'thumb-url' });

      const { result } = renderHook(() =>
        useThumb({ isUpdating: false, selectedResource: resource }),
      );

      expect(result.current.thumbnail).toBe('thumb-url');
    });

    it('resets the thumbnail whenever selectedResource changes', () => {
      const resourceA = buildResource({ thumbnail: 'thumb-a' });
      const resourceB = buildResource({ thumbnail: 'thumb-b' });

      const { result, rerender } = renderHook(
        ({ selectedResource }) =>
          useThumb({ isUpdating: true, selectedResource }),
        { initialProps: { selectedResource: resourceA } },
      );

      expect(result.current.thumbnail).toBe('thumb-a');

      rerender({ selectedResource: resourceB });

      expect(result.current.thumbnail).toBe('thumb-b');
    });
  });

  describe('handleUploadImage', () => {
    it('sets the thumbnail to the uploaded file', () => {
      const { result } = renderHook(() =>
        useThumb({ isUpdating: false, selectedResource: undefined }),
      );

      const file = new File(['content'], 'image.png', { type: 'image/png' });

      act(() => {
        result.current.handleUploadImage(file);
      });

      expect(result.current.thumbnail).toBe(file);
    });
  });

  describe('handleDeleteImage', () => {
    it('clears the thumbnail', () => {
      const resource = buildResource({ thumbnail: 'thumb-url' });

      const { result } = renderHook(() =>
        useThumb({ isUpdating: true, selectedResource: resource }),
      );

      expect(result.current.thumbnail).toBe('thumb-url');

      act(() => {
        result.current.handleDeleteImage();
      });

      expect(result.current.thumbnail).toBe('');
    });
  });
});
