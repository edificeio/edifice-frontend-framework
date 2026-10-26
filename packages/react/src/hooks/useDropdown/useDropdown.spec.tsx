import { act, renderHook } from '~/setup';
import useDropdown, { KEYS } from './useDropdown';

/** Builds a minimal keyboard event with the spies the hook relies on. */
function keyEvent(code: string, extra: Record<string, unknown> = {}) {
  return {
    code,
    stopPropagation: vi.fn(),
    preventDefault: vi.fn(),
    ...extra,
  } as any;
}

describe('useDropdown', () => {
  it('is closed by default', () => {
    const { result } = renderHook(() => useDropdown('bottom-start'));

    expect(result.current.visible).toBe(false);
    expect(result.current.isFocused).toBeNull();
    expect(result.current.triggerProps['aria-expanded']).toBe(false);
  });

  it('opens through openDropdown and reflects it in the trigger props', () => {
    const { result } = renderHook(() => useDropdown('bottom-start'));

    act(() => result.current.openDropdown());

    expect(result.current.visible).toBe(true);
    expect(result.current.triggerProps['aria-expanded']).toBe(true);
  });

  it('toggles visibility when the trigger is clicked', () => {
    const { result } = renderHook(() => useDropdown('bottom-start'));

    act(() => result.current.triggerProps.onClick(keyEvent('')));
    expect(result.current.visible).toBe(true);

    act(() => result.current.triggerProps.onClick(keyEvent('')));
    expect(result.current.visible).toBe(false);
  });

  it('opens on ArrowDown key press on the trigger', () => {
    const { result } = renderHook(() => useDropdown('bottom-start'));

    act(() => result.current.triggerProps.onKeyDown(keyEvent(KEYS.ArrowDown)));

    expect(result.current.visible).toBe(true);
  });

  it('opens on Space by default', () => {
    const { result } = renderHook(() => useDropdown('bottom-start'));

    act(() => result.current.triggerProps.onKeyDown(keyEvent(KEYS.Space)));

    expect(result.current.visible).toBe(true);
  });

  it('does not open on Space when openOnSpace is disabled', () => {
    const { result } = renderHook(() =>
      useDropdown('bottom-start', undefined, false, true, false),
    );

    act(() => result.current.triggerProps.onKeyDown(keyEvent(KEYS.Space)));

    expect(result.current.visible).toBe(false);
  });

  it('forwards an extra trigger keydown handler', () => {
    const extraHandler = vi.fn();
    const { result } = renderHook(() =>
      useDropdown('bottom-start', extraHandler),
    );

    act(() => result.current.triggerProps.onKeyDown(keyEvent(KEYS.Enter)));

    expect(extraHandler).toHaveBeenCalledTimes(1);
  });

  it('selects the focused item on Enter when unmounted items left null refs', () => {
    const { result } = renderHook(() => useDropdown('bottom-start'));
    act(() => result.current.openDropdown());
    result.current.triggerRef.current = document.createElement('button');

    // Unmounted items keep their key with a null ref, before the mounted ones.
    const first = document.createElement('div');
    first.setAttribute('role', 'menuitem');
    first.id = 'first';
    const second = document.createElement('div');
    second.setAttribute('role', 'menuitem');
    second.id = 'second';
    result.current.itemRefs.current = {
      stale1: null,
      stale2: null,
      first,
      second,
    };

    act(() =>
      result.current.itemProps.onMenuItemKeyDown(keyEvent(KEYS.ArrowDown)),
    );
    expect(result.current.isFocused).toBe('first');

    const onSuccess = vi.fn();
    act(() =>
      result.current.itemProps.onMenuItemKeyDown(
        keyEvent(KEYS.Enter),
        onSuccess,
      ),
    );

    expect(onSuccess).toHaveBeenCalledTimes(1);
    expect(result.current.visible).toBe(false);
  });

  it('exposes accessible attributes on the trigger and menu props', () => {
    const { result } = renderHook(() => useDropdown('bottom-start'));

    expect(result.current.triggerProps['aria-haspopup']).toBe('menu');
    expect(result.current.triggerProps.id).toMatch(/^dropdown-toggle-/);
    expect(result.current.menuProps['aria-labelledby']).toBe(
      result.current.triggerProps.id,
    );
    expect(result.current.menuProps.className).toBe('dropdown-menu');
  });
});
