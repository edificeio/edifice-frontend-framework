import { KeyboardEvent } from 'react';
import { act, renderHook } from '~/setup';
import { useMenu } from './useMenu';

const keyEvent = (code: string) => {
  const event = {
    code,
    preventDefault: vi.fn(),
    stopPropagation: vi.fn(),
  };
  return event as unknown as KeyboardEvent<HTMLUListElement> & typeof event;
};

/** Builds the `<li><button/></li>` structure the hook drives. */
function registerItems(menuItems: Set<HTMLLIElement>, count: number) {
  const buttons: HTMLButtonElement[] = [];

  for (let index = 0; index < count; index++) {
    const listItem = document.createElement('li');
    const button = document.createElement('button');
    button.textContent = `item-${index}`;
    button.setAttribute('tabindex', index === 0 ? '0' : '-1');
    listItem.appendChild(button);
    document.body.appendChild(listItem);
    menuItems.add(listItem);
    buttons.push(button);
  }

  return buttons;
}

describe('useMenu', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('exposes the menu refs and the props shared by its items', () => {
    const { result } = renderHook(() => useMenu());

    expect(result.current.menuRef.current).toBeNull();
    expect(result.current.menuItems.size).toBe(0);
    expect(result.current.childProps).toEqual({
      'data-menubar-menuitem': '',
      'role': 'menuitem',
    });
  });

  it('moves the focus down the list, wrapping at the end', async () => {
    const { result } = renderHook(() => useMenu());
    const buttons = registerItems(result.current.menuItems, 3);

    await act(() => result.current.onKeyDown(keyEvent('ArrowDown')));
    expect(buttons[1]).toHaveFocus();
    expect(buttons[1]).toHaveAttribute('tabindex', '0');
    expect(buttons[0]).toHaveAttribute('tabindex', '-1');

    await act(() => result.current.onKeyDown(keyEvent('ArrowDown')));
    expect(buttons[2]).toHaveFocus();

    await act(() => result.current.onKeyDown(keyEvent('ArrowDown')));
    expect(buttons[0]).toHaveFocus();
  });

  it('moves the focus up the list, wrapping at the beginning', async () => {
    const { result } = renderHook(() => useMenu());
    const buttons = registerItems(result.current.menuItems, 3);

    await act(() => result.current.onKeyDown(keyEvent('ArrowUp')));

    expect(buttons[2]).toHaveFocus();
  });

  it('jumps to the last item on End and back to the first on Home', async () => {
    const { result } = renderHook(() => useMenu());
    const buttons = registerItems(result.current.menuItems, 3);

    await act(() => result.current.onKeyDown(keyEvent('End')));
    expect(buttons[2]).toHaveFocus();

    await act(() => result.current.onKeyDown(keyEvent('Home')));
    expect(buttons[0]).toHaveFocus();
  });

  it('prevents the default scroll on the navigation keys', async () => {
    const { result } = renderHook(() => useMenu());
    registerItems(result.current.menuItems, 2);

    const event = keyEvent('ArrowDown');
    await act(() => result.current.onKeyDown(event));

    expect(event.preventDefault).toHaveBeenCalled();
    expect(event.stopPropagation).toHaveBeenCalled();
  });

  it('leaves any other key alone', async () => {
    const { result } = renderHook(() => useMenu());
    const buttons = registerItems(result.current.menuItems, 2);
    buttons[0].focus();

    const event = keyEvent('KeyA');
    await act(() => result.current.onKeyDown(event));

    expect(event.preventDefault).not.toHaveBeenCalled();
    expect(buttons[0]).toHaveFocus();
  });

  it('does not throw on an empty menu', async () => {
    const { result } = renderHook(() => useMenu());

    await expect(
      act(() => result.current.onKeyDown(keyEvent('ArrowDown'))),
    ).resolves.not.toThrow();
  });
});
