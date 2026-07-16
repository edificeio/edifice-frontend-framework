import { act, renderHook, waitFor } from '~/setup';
import useThumbnail from './useThumbnail';

const { useInView } = vi.hoisted(() => ({
  useInView: vi.fn(),
}));

vi.mock('react-intersection-observer', () => ({
  useInView,
}));

/**
 * Minimal stub of the browser Image, capturing instances so tests can trigger
 * their onload / onerror callbacks manually.
 */
class MockImage {
  onload: (() => void) | null = null;
  onerror: (() => void) | null = null;
  src = '';

  constructor() {
    images.push(this);
  }
}

let images: MockImage[] = [];

describe('useThumbnail', () => {
  beforeEach(() => {
    images = [];
    useInView.mockReturnValue({ ref: vi.fn(), inView: true });
    vi.stubGlobal('Image', MockImage);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('is null while the thumbnail has not been tested yet', () => {
    const { result } = renderHook(() => useThumbnail('/thumb.png'));

    expect(result.current).toBeNull();
  });

  it('returns false when there is no src', () => {
    const { result } = renderHook(() => useThumbnail(null));

    expect(result.current).toBe(false);
  });

  it('returns true once the image loads', async () => {
    const { result } = renderHook(() => useThumbnail('/thumb.png'));

    act(() => images[0].onload?.());

    await waitFor(() => expect(result.current).toBe(true));
  });

  it('returns false when the image fails to load', async () => {
    const { result } = renderHook(() => useThumbnail('/thumb.png'));

    act(() => images[0].onerror?.());

    await waitFor(() => expect(result.current).toBe(false));
  });

  it('waits for the element to be in view before preloading', () => {
    useInView.mockReturnValue({ ref: vi.fn(), inView: false });
    const ref = { current: document.createElement('div') };

    const { result } = renderHook(() => useThumbnail('/thumb.png', { ref }));

    // Not in view yet: no preload attempted, status stays null.
    expect(images).toHaveLength(0);
    expect(result.current).toBeNull();
  });
});
