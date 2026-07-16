import { act, renderHook } from '~/setup';
import useInfiniteScroll from './useInfiniteScroll';

const observe = vi.fn();
const disconnect = vi.fn();
let ioCallback: (entries: Array<{ isIntersecting: boolean }>) => void;

class MockIntersectionObserver {
  constructor(cb: any) {
    ioCallback = cb;
  }
  observe = observe;
  disconnect = disconnect;
}

describe('useInfiniteScroll', () => {
  beforeEach(() => {
    vi.stubGlobal('IntersectionObserver', MockIntersectionObserver);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.clearAllMocks();
  });

  it('observes the node attached through the ref callback', () => {
    const callback = vi.fn();
    const { result } = renderHook(() => useInfiniteScroll({ callback }));
    const node = document.createElement('div');

    act(() => result.current(node));

    expect(observe).toHaveBeenCalledWith(node);
  });

  it('invokes the callback when the sentinel intersects', async () => {
    const callback = vi.fn();
    const { result } = renderHook(() => useInfiniteScroll({ callback }));
    act(() => result.current(document.createElement('div')));

    await act(async () => {
      await ioCallback([{ isIntersecting: true }]);
    });

    expect(callback).toHaveBeenCalled();
  });

  it('does not invoke the callback when the sentinel is not intersecting', async () => {
    const callback = vi.fn();
    const { result } = renderHook(() => useInfiniteScroll({ callback }));
    act(() => result.current(document.createElement('div')));

    await act(async () => {
      await ioCallback([{ isIntersecting: false }]);
    });

    expect(callback).not.toHaveBeenCalled();
  });

  it('disconnects the observer when the ref is detached (null node)', () => {
    const callback = vi.fn();
    const { result } = renderHook(() => useInfiniteScroll({ callback }));
    act(() => result.current(document.createElement('div')));

    act(() => result.current(null));

    expect(disconnect).toHaveBeenCalled();
  });

  it('disconnects the previous observer when a new node is attached', () => {
    const callback = vi.fn();
    const { result } = renderHook(() => useInfiniteScroll({ callback }));

    act(() => result.current(document.createElement('div')));
    act(() => result.current(document.createElement('div')));

    expect(disconnect).toHaveBeenCalledTimes(1);
  });
});
