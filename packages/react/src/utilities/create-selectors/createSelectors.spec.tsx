import { act, renderHook } from '~/setup';
import { create } from 'zustand';

import { createSelectors } from './createSelectors';

interface BearState {
  bears: number;
  name: string;
  increase: () => void;
}

const buildStore = () =>
  createSelectors(
    create<BearState>((set) => ({
      bears: 1,
      name: 'Teddy',
      increase: () => set((state) => ({ bears: state.bears + 1 })),
    })),
  );

describe('createSelectors', () => {
  it('generates a selector hook for each state key', () => {
    const store = buildStore();
    expect(Object.keys(store.use).sort()).toEqual(
      ['bears', 'increase', 'name'].sort(),
    );
  });

  it('exposes selectors that return the matching state value', () => {
    const store = buildStore();

    const bears = renderHook(() => store.use.bears());
    const name = renderHook(() => store.use.name());

    expect(bears.result.current).toBe(1);
    expect(name.result.current).toBe('Teddy');
  });

  it('keeps the selector reactive when the state changes', () => {
    const store = buildStore();
    const { result } = renderHook(() => store.use.bears());

    expect(result.current).toBe(1);

    act(() => {
      store.getState().increase();
    });

    expect(result.current).toBe(2);
  });

  it('returns the augmented store (same getState/setState)', () => {
    const store = buildStore();
    expect(typeof store.getState).toBe('function');
    expect(store.getState().bears).toBe(1);
  });
});
