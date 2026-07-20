import { renderHook } from '@testing-library/react';
import useKeyPress from './useKeyPress';

describe('useKeyPress', () => {
  const fireKeydown = (code: string) => {
    window.dispatchEvent(new KeyboardEvent('keydown', { code }));
  };

  it('calls the callback when a matching key is pressed', () => {
    const callback = vi.fn();
    renderHook(() => useKeyPress(callback, ['Enter']));

    fireKeydown('Enter');

    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('does not call the callback for non-matching keys', () => {
    const callback = vi.fn();
    renderHook(() => useKeyPress(callback, ['Enter']));

    fireKeydown('Escape');
    fireKeydown('Space');

    expect(callback).not.toHaveBeenCalled();
  });

  it('calls the callback for any key in the provided list', () => {
    const callback = vi.fn();
    renderHook(() => useKeyPress(callback, ['ArrowUp', 'ArrowDown']));

    fireKeydown('ArrowUp');
    fireKeydown('ArrowDown');

    expect(callback).toHaveBeenCalledTimes(2);
  });

  it('removes the event listener on unmount', () => {
    const callback = vi.fn();
    const { unmount } = renderHook(() => useKeyPress(callback, ['Enter']));

    unmount();
    fireKeydown('Enter');

    expect(callback).not.toHaveBeenCalled();
  });

  it('does not call the callback when keyCodes list is empty', () => {
    const callback = vi.fn();
    renderHook(() => useKeyPress(callback, []));

    fireKeydown('Enter');
    fireKeydown('Space');

    expect(callback).not.toHaveBeenCalled();
  });

  it('calls the updated callback after re-render', () => {
    const firstCallback = vi.fn();
    const secondCallback = vi.fn();

    const { rerender } = renderHook(({ cb }) => useKeyPress(cb, ['Enter']), {
      initialProps: { cb: firstCallback },
    });

    rerender({ cb: secondCallback });
    fireKeydown('Enter');

    expect(firstCallback).not.toHaveBeenCalled();
    expect(secondCallback).toHaveBeenCalledTimes(1);
  });

  it('responds to an updated keyCodes list after re-render', () => {
    const callback = vi.fn();

    const { rerender } = renderHook(({ keys }) => useKeyPress(callback, keys), {
      initialProps: { keys: ['Enter'] },
    });

    rerender({ keys: ['Escape'] });
    fireKeydown('Enter');
    expect(callback).not.toHaveBeenCalled();

    fireKeydown('Escape');
    expect(callback).toHaveBeenCalledTimes(1);
  });
});
