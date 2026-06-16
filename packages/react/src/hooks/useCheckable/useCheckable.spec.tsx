import { act, renderHook } from '@testing-library/react';
import { useCheckable } from './useCheckable';

type Item = { _id: string; name: string };

const items: Item[] = [
  { _id: '1', name: 'Item 1' },
  { _id: '2', name: 'Item 2' },
  { _id: '3', name: 'Item 3' },
];

describe('useCheckable', () => {
  it('starts with no selected items', () => {
    const { result } = renderHook(() => useCheckable(items));
    expect(result.current.selectedItems).toEqual([]);
  });

  it('reports allItemsSelected as false and isIndeterminate as false initially', () => {
    const { result } = renderHook(() => useCheckable(items));
    expect(result.current.allItemsSelected).toBe(false);
    expect(result.current.isIndeterminate).toBe(false);
  });

  it('selects an item when handleOnSelectItem is called', () => {
    const { result } = renderHook(() => useCheckable(items));

    act(() => result.current.handleOnSelectItem('1'));

    expect(result.current.selectedItems).toContain('1');
    expect(result.current.selectedItems).toHaveLength(1);
  });

  it('deselects an item when handleOnSelectItem is called on an already-selected item', () => {
    const { result } = renderHook(() => useCheckable(items));

    act(() => result.current.handleOnSelectItem('1'));
    act(() => result.current.handleOnSelectItem('1'));

    expect(result.current.selectedItems).not.toContain('1');
    expect(result.current.selectedItems).toHaveLength(0);
  });

  it('sets isIndeterminate to true when some but not all items are selected', () => {
    const { result } = renderHook(() => useCheckable(items));

    act(() => result.current.handleOnSelectItem('1'));

    expect(result.current.isIndeterminate).toBe(true);
    expect(result.current.allItemsSelected).toBe(false);
  });

  it('sets allItemsSelected to true when all items are selected via handleOnSelectAllItems', () => {
    const { result } = renderHook(() => useCheckable(items));

    act(() => result.current.handleOnSelectAllItems(false));

    expect(result.current.allItemsSelected).toBe(true);
    expect(result.current.isIndeterminate).toBe(false);
    expect(result.current.selectedItems).toEqual(['1', '2', '3']);
  });

  it('clears all selections when handleOnSelectAllItems is called with deselect=true', () => {
    const { result } = renderHook(() => useCheckable(items));

    act(() => result.current.handleOnSelectAllItems(false));
    act(() => result.current.handleOnSelectAllItems(true));

    expect(result.current.selectedItems).toEqual([]);
    expect(result.current.allItemsSelected).toBe(false);
  });

  it('removes stale selected ids when data shrinks and no longer contains them', () => {
    const { result, rerender } = renderHook(
      ({ data }: { data: Item[] }) => useCheckable(data),
      { initialProps: { data: items } },
    );

    act(() => result.current.handleOnSelectAllItems(false));
    expect(result.current.selectedItems).toHaveLength(3);

    // Remove item '3' from the data
    rerender({ data: [items[0], items[1]] });

    expect(result.current.selectedItems).not.toContain('3');
    expect(result.current.selectedItems).toHaveLength(2);
  });

  it('handles undefined data gracefully', () => {
    const { result } = renderHook(() => useCheckable<Item>(undefined));

    expect(result.current.selectedItems).toEqual([]);
    expect(result.current.allItemsSelected).toBe(false);
    expect(result.current.isIndeterminate).toBe(false);
  });

  it('reports allItemsSelected as false when data is empty', () => {
    const { result } = renderHook(() => useCheckable<Item>([]));

    act(() => result.current.handleOnSelectAllItems(false));

    expect(result.current.allItemsSelected).toBe(false);
    expect(result.current.selectedItems).toEqual([]);
  });
});
