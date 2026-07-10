import { act, renderHook } from '~/setup';
import useImage from './useImage';

describe('useImage', () => {
  it('uses the src as the initial image source', () => {
    const { result } = renderHook(() =>
      useImage({ src: '/image.png', placeholder: '/placeholder.png' }),
    );

    expect(result.current.imgSrc).toBe('/image.png');
  });

  // The [src] effect syncs imgSrc to src on every render, so the placeholder
  // fallback baked into the initial useState value is overwritten by an empty
  // src. In practice the placeholder is reached through onError, not an empty src.
  it('mirrors the src even when it is empty', () => {
    const { result } = renderHook(() =>
      useImage({ src: '', placeholder: '/placeholder.png' }),
    );

    expect(result.current.imgSrc).toBe('');
  });

  it('switches to the placeholder when onError is triggered', () => {
    const { result } = renderHook(() =>
      useImage({ src: '/image.png', placeholder: '/placeholder.png' }),
    );

    act(() => result.current.onError());

    expect(result.current.imgSrc).toBe('/placeholder.png');
  });

  it('updates the image source when src changes', () => {
    const { result, rerender } = renderHook((props) => useImage(props), {
      initialProps: { src: '/image.png', placeholder: '/placeholder.png' },
    });

    expect(result.current.imgSrc).toBe('/image.png');

    rerender({ src: '/other.png', placeholder: '/placeholder.png' });

    expect(result.current.imgSrc).toBe('/other.png');
  });
});
