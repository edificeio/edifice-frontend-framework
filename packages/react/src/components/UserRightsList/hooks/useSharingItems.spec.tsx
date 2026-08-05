import { act, renderHook } from '~/setup';
import { SharingItem } from '../../../types';
import { ResourceRightName } from '../types/types';
import { useSharingItems } from './useSharingItems';

function sharing(recipientId: string, permission = ['read']): SharingItem {
  return {
    recipientId,
    recipientType: 'user',
    displayName: `User ${recipientId}`,
    permission,
  };
}

function setup({ initialSharings }: { initialSharings?: SharingItem[] } = {}) {
  const onChange = vi.fn();
  const onAddItems = vi.fn();
  const onDeleteItems = vi.fn();

  // Minimal right algebra: toggling flips the right, applying sets it.
  const toggleRight = (item: SharingItem, rightName: ResourceRightName) => ({
    ...item,
    permission: item.permission.includes(rightName)
      ? item.permission.filter((right) => right !== rightName)
      : [...item.permission, rightName],
  });
  const applyRight = (
    item: SharingItem,
    rightName: ResourceRightName,
    add: boolean,
  ) => ({
    ...item,
    permission: add
      ? [...new Set([...item.permission, rightName])]
      : item.permission.filter((right) => right !== rightName),
  });

  return {
    ...renderHook(() =>
      useSharingItems({
        initialSharings: initialSharings as SharingItem[],
        toggleRight,
        applyRight,
        onChange,
        onAddItems,
        onDeleteItems,
      }),
    ),
    onChange,
    onAddItems,
    onDeleteItems,
  };
}

const ids = (items: SharingItem[]) =>
  items.map(({ recipientId }) => recipientId);

describe('useSharingItems', () => {
  it('starts from the sharings it is given', () => {
    const { result } = setup({ initialSharings: [sharing('a')] });

    expect(ids(result.current.items)).toEqual(['a']);
  });

  it('starts empty when no sharing is given', () => {
    const { result } = setup();

    expect(result.current.items).toEqual([]);
  });

  describe('addItem', () => {
    it('appends an item and reports it', async () => {
      const { result, onChange, onAddItems } = setup({ initialSharings: [] });

      await act(() => result.current.addItem(sharing('a')));

      expect(ids(result.current.items)).toEqual(['a']);
      expect(onAddItems).toHaveBeenCalledWith([
        expect.objectContaining({ recipientId: 'a' }),
      ]);
      expect(onChange).toHaveBeenCalled();
    });

    it('ignores a recipient already in the list', async () => {
      const { result, onAddItems } = setup({ initialSharings: [sharing('a')] });

      await act(() => result.current.addItem(sharing('a')));

      expect(result.current.items).toHaveLength(1);
      expect(onAddItems).not.toHaveBeenCalled();
    });
  });

  describe('addItems', () => {
    it('appends the recipients not already listed', async () => {
      const { result, onAddItems } = setup({ initialSharings: [sharing('a')] });

      await act(() =>
        result.current.addItems([sharing('a'), sharing('b'), sharing('c')]),
      );

      expect(ids(result.current.items)).toEqual(['a', 'b', 'c']);
      expect(onAddItems).toHaveBeenCalledWith([
        expect.objectContaining({ recipientId: 'b' }),
        expect.objectContaining({ recipientId: 'c' }),
      ]);
    });

    it('does nothing when every recipient is already listed', async () => {
      const { result, onChange, onAddItems } = setup({
        initialSharings: [sharing('a')],
      });

      await act(() => result.current.addItems([sharing('a')]));

      expect(result.current.items).toHaveLength(1);
      expect(onAddItems).not.toHaveBeenCalled();
      expect(onChange).not.toHaveBeenCalled();
    });

    it('does nothing for an empty batch', async () => {
      const { result, onAddItems } = setup({ initialSharings: [sharing('a')] });

      await act(() => result.current.addItems([]));

      expect(onAddItems).not.toHaveBeenCalled();
    });
  });

  describe('deleteItem', () => {
    it('removes the recipient and reports it', async () => {
      const { result, onDeleteItems } = setup({
        initialSharings: [sharing('a'), sharing('b')],
      });

      await act(() => result.current.deleteItem(sharing('a')));

      expect(ids(result.current.items)).toEqual(['b']);
      expect(onDeleteItems).toHaveBeenCalledWith([
        expect.objectContaining({ recipientId: 'a' }),
      ]);
    });

    it('does nothing for a recipient absent from the list', async () => {
      const { result, onChange, onDeleteItems } = setup({
        initialSharings: [sharing('a')],
      });

      await act(() => result.current.deleteItem(sharing('ghost')));

      expect(ids(result.current.items)).toEqual(['a']);
      expect(onDeleteItems).not.toHaveBeenCalled();
      expect(onChange).not.toHaveBeenCalled();
    });
  });

  describe('deleteItemsByIds', () => {
    it('removes every listed recipient at once', async () => {
      const { result, onDeleteItems } = setup({
        initialSharings: [sharing('a'), sharing('b'), sharing('c')],
      });

      await act(() => result.current.deleteItemsByIds(new Set(['a', 'c'])));

      expect(ids(result.current.items)).toEqual(['b']);
      expect(onDeleteItems).toHaveBeenCalled();
    });
  });

  describe('rights', () => {
    it('toggles a right on a single recipient', async () => {
      const { result, onChange } = setup({
        initialSharings: [sharing('a'), sharing('b')],
      });

      await act(() => result.current.changeRight(sharing('a'), 'contrib'));

      expect(result.current.items[0].permission).toContain('contrib');
      expect(result.current.items[1].permission).not.toContain('contrib');
      expect(onChange).toHaveBeenCalled();
    });

    it('applies a right to a set of recipients', async () => {
      const { result } = setup({
        initialSharings: [sharing('a'), sharing('b'), sharing('c')],
      });

      await act(() =>
        result.current.applyRightToIds(new Set(['a', 'c']), 'contrib', true),
      );

      expect(result.current.items[0].permission).toContain('contrib');
      expect(result.current.items[1].permission).not.toContain('contrib');
      expect(result.current.items[2].permission).toContain('contrib');
    });

    it('removes a right from a set of recipients', async () => {
      const { result } = setup({
        initialSharings: [sharing('a', ['read', 'contrib'])],
      });

      await act(() =>
        result.current.applyRightToIds(new Set(['a']), 'contrib', false),
      );

      expect(result.current.items[0].permission).not.toContain('contrib');
    });
  });
});
