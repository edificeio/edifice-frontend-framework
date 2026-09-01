import { KeyboardEvent } from 'react';
import { act, renderHook } from '~/setup';
import { TabsItemProps } from '../components/TabsItem';
import { useTabs } from './useTabs';

const items = [
  { id: 'first', label: 'First' },
  { id: 'second', label: 'Second' },
  { id: 'third', label: 'Third' },
] as unknown as TabsItemProps[];

const keyEvent = (code: string) =>
  ({ code }) as unknown as KeyboardEvent<HTMLButtonElement>;

function setup({
  defaultId = 'first',
  tabItems = items,
}: { defaultId?: string; tabItems?: TabsItemProps[] } = {}) {
  const onChange = vi.fn();

  return {
    ...renderHook(() => useTabs({ defaultId, items: tabItems, onChange })),
    onChange,
  };
}

describe('useTabs', () => {
  it('starts on the default tab and announces it', () => {
    const { result, onChange } = setup();

    expect(result.current.activeTab).toBe('first');
    expect(onChange).toHaveBeenCalledWith(items[0]);
  });

  it('starts with no active tab without a default', () => {
    const { result, onChange } = setup({ defaultId: '' });

    expect(result.current.activeTab).toBe('');
    expect(onChange).not.toHaveBeenCalled();
  });

  it('selects a tab on demand and announces the change', async () => {
    const { result, onChange } = setup();

    await act(() => result.current.setSelectedTab('third'));

    expect(result.current.activeTab).toBe('third');
    expect(onChange).toHaveBeenLastCalledWith(items[2]);
  });

  // Selecting an unknown id lands on the default tab: the positioning effect
  // resets it, which in turn announces that tab rather than the unknown one.
  it('announces the default tab when an unknown id is selected', async () => {
    const { result, onChange } = setup();
    onChange.mockClear();

    await act(() => result.current.setSelectedTab('ghost'));

    expect(result.current.activeTab).toBe('first');
    expect(onChange).toHaveBeenCalledWith(items[0]);
  });

  it('falls back to the default tab when the active one disappears', async () => {
    const { result } = setup({ defaultId: 'second' });

    await act(() => result.current.setSelectedTab('ghost'));

    expect(result.current.activeTab).toBe('second');
  });

  describe('keyboard navigation', () => {
    it('moves to the next tab on ArrowRight', async () => {
      const { result } = setup();

      await act(() => result.current.onKeyDown(keyEvent('ArrowRight')));

      expect(result.current.activeTab).toBe('second');
    });

    it('wraps to the first tab from the last one', async () => {
      const { result } = setup({ defaultId: 'third' });

      await act(() => result.current.onKeyDown(keyEvent('ArrowRight')));

      expect(result.current.activeTab).toBe('first');
    });

    it('moves to the previous tab on ArrowLeft', async () => {
      const { result } = setup({ defaultId: 'second' });

      await act(() => result.current.onKeyDown(keyEvent('ArrowLeft')));

      expect(result.current.activeTab).toBe('first');
    });

    it('wraps to the last tab from the first one', async () => {
      const { result } = setup();

      await act(() => result.current.onKeyDown(keyEvent('ArrowLeft')));

      expect(result.current.activeTab).toBe('third');
    });

    it('jumps to the first tab on Home', async () => {
      const { result } = setup({ defaultId: 'third' });

      await act(() => result.current.onKeyDown(keyEvent('Home')));

      expect(result.current.activeTab).toBe('first');
    });

    it('jumps to the last tab on End', async () => {
      const { result } = setup();

      await act(() => result.current.onKeyDown(keyEvent('End')));

      expect(result.current.activeTab).toBe('third');
    });

    it('ignores any other key', async () => {
      const { result } = setup();

      await act(() => result.current.onKeyDown(keyEvent('KeyA')));

      expect(result.current.activeTab).toBe('first');
    });
  });

  describe('underline position', () => {
    it('stays at the origin while no tab element is registered', () => {
      const { result } = setup();

      expect(result.current.tabUnderlineLeft).toBe(0);
      expect(result.current.tabUnderlineWidth).toBe(0);
    });

    it('follows the active tab element and focuses it', async () => {
      const { result } = setup();

      const button = document.createElement('button');
      Object.defineProperties(button, {
        offsetLeft: { value: 120, configurable: true },
        clientWidth: { value: 80, configurable: true },
      });
      document.body.appendChild(button);

      await act(() => {
        result.current.tabsRef.current[1] = button;
        result.current.setSelectedTab('second');
      });

      expect(result.current.tabUnderlineLeft).toBe(120);
      expect(result.current.tabUnderlineWidth).toBe(80);
      expect(button).toHaveFocus();

      button.remove();
    });

    it.each(['input', 'textarea'])(
      'leaves a focused %s alone when repositioning tabs',
      async (tagName) => {
        const { result } = setup();

        const editable = document.createElement(tagName);
        document.body.appendChild(editable);
        editable.focus();

        const button = document.createElement('button');
        document.body.appendChild(button);

        await act(() => {
          result.current.tabsRef.current[1] = button;
          result.current.setSelectedTab('second');
        });

        expect(editable).toHaveFocus();

        editable.remove();
        button.remove();
      },
    );
  });
});
