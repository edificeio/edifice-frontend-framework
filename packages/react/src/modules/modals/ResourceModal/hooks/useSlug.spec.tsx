import { IResource } from '@edifice.io/client';
import { hash } from 'ohash';
import slugify from 'react-slugify';

import { act, renderHook, waitFor } from '~/setup';
import { useSlug } from './useSlug';

// Build a minimal resource object; only the fields read by useSlug matter here.
const buildResource = (overrides: Partial<IResource> = {}): IResource =>
  ({
    public: false,
    ...overrides,
  }) as IResource;

describe('useSlug', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('isPublic initial state', () => {
    it('is true when selectedResource.public is true', () => {
      const watch = vi.fn().mockReturnValue('my title');
      const setValue = vi.fn();

      const { result } = renderHook(() =>
        useSlug({
          watch,
          setValue,
          selectedResource: buildResource({ public: true }),
        }),
      );

      expect(result.current.isPublic).toBe(true);
    });

    it('is false when selectedResource.public is false', () => {
      const watch = vi.fn().mockReturnValue('my title');
      const setValue = vi.fn();

      const { result } = renderHook(() =>
        useSlug({
          watch,
          setValue,
          selectedResource: buildResource({ public: false }),
        }),
      );

      expect(result.current.isPublic).toBe(false);
    });

    it('is false when selectedResource is undefined', () => {
      const watch = vi.fn().mockReturnValue('my title');
      const setValue = vi.fn();

      const { result } = renderHook(() =>
        useSlug({ watch, setValue, selectedResource: undefined }),
      );

      expect(result.current.isPublic).toBe(false);
    });
  });

  it('does not call setValue when isPublic is false', async () => {
    const watch = vi.fn().mockReturnValue('my title');
    const setValue = vi.fn();

    renderHook(() =>
      useSlug({
        watch,
        setValue,
        selectedResource: buildResource({ public: false }),
      }),
    );

    // Give the effect a chance to run before asserting the negative.
    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(setValue).not.toHaveBeenCalled();
  });

  it('reuses selectedResource.slug when isPublic is true and a slug already exists', async () => {
    const watch = vi.fn().mockReturnValue('my title');
    const setValue = vi.fn();

    const { result } = renderHook(() =>
      useSlug({
        watch,
        setValue,
        selectedResource: buildResource({
          public: true,
          slug: 'existing-slug',
        }),
      }),
    );

    await waitFor(() =>
      expect(setValue).toHaveBeenCalledWith('formSlug', 'existing-slug'),
    );
    expect(result.current.slug).toBe('existing-slug');
  });

  it('computes a hashed and slugified value when isPublic is true and there is no selectedResource', async () => {
    const watch = vi.fn().mockReturnValue('my title');
    const setValue = vi.fn();

    const { result } = renderHook(() =>
      useSlug({
        watch,
        setValue,
        selectedResource: undefined,
      }),
    );

    // isPublic starts false without a selectedResource, so trigger the effect.
    act(() => result.current.onPublicChange(true));

    await waitFor(() => expect(setValue).toHaveBeenCalled());
    const [, computedSlug] = setValue.mock.calls[0];
    // The computed slug is `${hash(...)}-${slugify(resourceName)}`; the
    // slugified suffix itself may contain dashes, so only its length is
    // known ahead of time.
    expect(computedSlug).toEqual(expect.stringContaining('-'));
    expect(computedSlug.endsWith(`-${slugify('my title')}`)).toBe(true);
  });

  it('computes a hashed and slugified value when isPublic is true and selectedResource.slug is falsy', async () => {
    const watch = vi.fn().mockReturnValue('my title');
    const setValue = vi.fn();

    renderHook(() =>
      useSlug({
        watch,
        setValue,
        selectedResource: buildResource({ public: true, slug: undefined }),
      }),
    );

    await waitFor(() => expect(setValue).toHaveBeenCalled());
    const [, computedSlug] = setValue.mock.calls[0];
    expect(typeof computedSlug).toBe('string');
    expect(computedSlug.length).toBeGreaterThan(0);
    expect(computedSlug.endsWith(`-${slugify('my title')}`)).toBe(true);
  });

  it('recomputes the slug once onPublicChange switches isPublic to true', async () => {
    const watch = vi.fn().mockReturnValue('my title');
    const setValue = vi.fn();

    const { result } = renderHook(() =>
      useSlug({
        watch,
        setValue,
        selectedResource: buildResource({ public: false }),
      }),
    );

    expect(result.current.isPublic).toBe(false);

    act(() => result.current.onPublicChange(true));

    expect(result.current.isPublic).toBe(true);
    await waitFor(() => expect(setValue).toHaveBeenCalled());
  });

  describe('onCopyToClipBoard', () => {
    beforeEach(() => {
      // jsdom exposes navigator.clipboard as a getter-only property, so
      // Object.assign would throw; redefine it instead.
      Object.defineProperty(navigator, 'clipboard', {
        value: { writeText: vi.fn() },
        configurable: true,
        writable: true,
      });
    });

    it('copies the origin, given pathname and slug to the clipboard', async () => {
      const watch = vi.fn().mockReturnValue('my title');
      const setValue = vi.fn();

      const { result } = renderHook(() =>
        useSlug({
          watch,
          setValue,
          selectedResource: buildResource({
            public: true,
            slug: 'existing-slug',
          }),
        }),
      );

      await waitFor(() => expect(result.current.slug).toBe('existing-slug'));

      act(() => result.current.onCopyToClipBoard('/some/path'));

      expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
        `${window.location.origin}/some/path/pub/existing-slug`,
      );
    });

    it('falls back to window.location.pathname when pathname is undefined', async () => {
      const watch = vi.fn().mockReturnValue('my title');
      const setValue = vi.fn();

      const { result } = renderHook(() =>
        useSlug({
          watch,
          setValue,
          selectedResource: buildResource({
            public: true,
            slug: 'existing-slug',
          }),
        }),
      );

      await waitFor(() => expect(result.current.slug).toBe('existing-slug'));

      act(() =>
        result.current.onCopyToClipBoard(undefined as unknown as string),
      );

      expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
        `${window.location.origin}${window.location.pathname}/pub/existing-slug`,
      );
    });
  });
});

// Sanity check that the real ohash/react-slugify libraries used by the hook
// are deterministic, so assertions above hold across runs.
describe('ohash/react-slugify sanity check', () => {
  it('slugify produces a stable, non-empty value for the same input', () => {
    expect(slugify('my title')).toBe(slugify('my title'));
    expect(slugify('my title').length).toBeGreaterThan(0);
  });

  it('hash produces a stable, non-empty value for the same input', () => {
    const input = { foo: 'my title-some-id' };
    expect(hash(input)).toBe(hash(input));
    expect(hash(input).length).toBeGreaterThan(0);
  });
});
