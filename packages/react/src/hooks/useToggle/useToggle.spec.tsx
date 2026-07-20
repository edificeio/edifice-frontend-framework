import { act, renderHook } from '@testing-library/react';
import useToggle from './useToggle';

describe('useToggle', () => {
  it('returns false as the default initial state', () => {
    const { result } = renderHook(() => useToggle());
    expect(result.current[0]).toBe(false);
  });

  it('returns the provided initial state', () => {
    const { result: resultTrue } = renderHook(() => useToggle(true));
    expect(resultTrue.current[0]).toBe(true);

    const { result: resultFalse } = renderHook(() => useToggle(false));
    expect(resultFalse.current[0]).toBe(false);
  });

  it('returns a toggle function as the second element', () => {
    const { result } = renderHook(() => useToggle());
    expect(typeof result.current[1]).toBe('function');
  });

  it('toggles state from false to true', () => {
    const { result } = renderHook(() => useToggle(false));

    act(() => {
      result.current[1]();
    });

    expect(result.current[0]).toBe(true);
  });

  it('toggles state from true to false', () => {
    const { result } = renderHook(() => useToggle(true));

    act(() => {
      result.current[1]();
    });

    expect(result.current[0]).toBe(false);
  });

  it('returns a stable toggle function reference across renders', () => {
    const { result, rerender } = renderHook(() => useToggle(false));
    const firstToggle = result.current[1];

    rerender();

    expect(result.current[1]).toBe(firstToggle);
  });
});
