import { StoreApi, UseBoundStore } from 'zustand';

type WithSelectors<S> = S extends { getState: () => infer T }
  ? S & { use: { [K in keyof T]: () => T[K] } }
  : never;

/**
 * Augments a Zustand store with auto-generated, per-field selector hooks,
 * so consumers can call `store.use.myValue()` instead of
 * `store((s) => s.myValue)` and never forget a selector.
 *
 * Pattern from the Zustand docs:
 * https://zustand.docs.pmnd.rs/guides/auto-generating-selectors
 *
 * @param _store - The bound store to augment.
 * @returns The same store instance, mutated with a `use` object exposing one
 * selector hook per state key.
 *
 * @remarks
 * - The store is mutated in place; the returned reference is the input store.
 * - Selectors are generated once, from the keys present at call time. Fields
 *   added to the state later won't get a `use.<key>` selector.
 *
 * @example
 * ```ts
 * const useBearStore = createSelectors(
 *   create<BearState>(() => ({ bears: 0 })),
 * );
 *
 * // In a component:
 * const bears = useBearStore.use.bears();
 * ```
 */
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
