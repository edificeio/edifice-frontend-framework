import { StoreApi, UseBoundStore } from 'zustand';

type WithSelectors<S> = S extends { getState: () => infer T }
  ? S & { use: { [K in keyof T]: () => T[K] } }
  : never;

export const createSelectors = <S extends UseBoundStore<StoreApi<object>>>(
  _store: S,
) => {
  const store = _store as WithSelectors<typeof _store>;
  // Pattern based on the Zustand docs selector helper:
  // https://zustand.docs.pmnd.rs/guides/auto-generating-selectors
  store.use = {};
  const selectorMap = store.use as Record<string, () => unknown>;
  for (const k of Object.keys(store.getState())) {
    selectorMap[k] = () => store((s) => s[k as keyof typeof s]);
  }

  return store;
};
