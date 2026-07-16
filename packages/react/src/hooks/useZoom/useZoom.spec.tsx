import { act, renderHook } from '~/setup';
import useZoom from './useZoom';

describe('useZoom', () => {
  it('starts at the default scale of 1', () => {
    const { result } = renderHook(() => useZoom());

    expect(result.current.scale).toBe(1);
  });

  it('starts at the provided initial scale', () => {
    const { result } = renderHook(() => useZoom(1.5));

    expect(result.current.scale).toBe(1.5);
  });

  it('zooms in by the step without exceeding maxScale', () => {
    const { result } = renderHook(() => useZoom(1, 2, 0.5, 0.5));

    act(() => result.current.zoomIn());
    expect(result.current.scale).toBe(1.5);

    act(() => result.current.zoomIn());
    expect(result.current.scale).toBe(2);

    // Already at the maximum: stays clamped.
    act(() => result.current.zoomIn());
    expect(result.current.scale).toBe(2);
  });

  it('zooms out by the step without going below minScale', () => {
    const { result } = renderHook(() => useZoom(1, 2, 0.5, 0.5));

    act(() => result.current.zoomOut());
    expect(result.current.scale).toBe(0.5);

    // Already at the minimum: stays clamped.
    act(() => result.current.zoomOut());
    expect(result.current.scale).toBe(0.5);
  });

  it('resets to the initial scale', () => {
    const { result } = renderHook(() => useZoom(1));

    act(() => result.current.zoomIn());
    expect(result.current.scale).toBe(1.5);

    act(() => result.current.resetZoom());
    expect(result.current.scale).toBe(1);
  });

  it('lets the scale be set to an arbitrary value', () => {
    const { result } = renderHook(() => useZoom());

    act(() => result.current.setScale(1.75));
    expect(result.current.scale).toBe(1.75);
  });
});
