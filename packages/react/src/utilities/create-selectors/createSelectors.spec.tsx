import { act, renderHook } from '~/setup';
import { create } from 'zustand';
import { createSelectors } from './createSelectors';

interface CounterState {
  count: number;
  name: string;
  increment: () => void;
}

function createCounterStore() {
  return create<CounterState>((set) => ({
    count: 0,
    name: 'counter',
    increment: () => set((state) => ({ count: state.count + 1 })),
  }));
}

describe('createSelectors', () => {
  it('returns the same store instance, augmented with a `use` map', () => {
    const store = createCounterStore();

    const withSelectors = createSelectors(store);

    expect(withSelectors).toBe(store);
    expect(withSelectors.use).toBeTypeOf('object');
  });

  it('creates one selector hook per state key', () => {
    const store = createSelectors(createCounterStore());

    expect(Object.keys(store.use)).toEqual(['count', 'name', 'increment']);
    expect(store.use.count).toBeTypeOf('function');
    expect(store.use.name).toBeTypeOf('function');
    expect(store.use.increment).toBeTypeOf('function');
  });

  it('each selector returns the current value of its key', () => {
    const store = createSelectors(createCounterStore());

    const { result: count } = renderHook(() => store.use.count());
    const { result: name } = renderHook(() => store.use.name());

    expect(count.current).toBe(0);
    expect(name.current).toBe('counter');
  });

  it('re-renders selectors when the underlying state changes', () => {
    const store = createSelectors(createCounterStore());

    const { result } = renderHook(() => store.use.count());
    expect(result.current).toBe(0);

    act(() => {
      store.getState().increment();
    });

    expect(result.current).toBe(1);
  });
});
