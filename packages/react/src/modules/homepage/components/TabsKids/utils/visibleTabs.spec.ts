import { getVisibleCount, getVisibleIndexes } from './visibleTabs';

describe('getVisibleCount', () => {
  it('returns every tab when they all fit', () => {
    // 3 * 100 + 2 * 10 = 320
    expect(getVisibleCount([100, 100, 100], 0, 320, 10, 50, 0)).toBe(3);
  });

  it('keeps room for the overflow trigger when tabs do not fit', () => {
    // budget = 300 - 50 - 10 = 240: 100 + 10 + 100 fits, a third does not
    expect(getVisibleCount([100, 100, 100], 0, 300, 10, 50, 0)).toBe(2);
  });

  it('always counts the active tab first', () => {
    // budget = 240: the wide active tab (200) leaves no room for another one
    expect(getVisibleCount([100, 100, 200], 2, 300, 10, 50, 0)).toBe(1);
  });

  it('stops at the first tab that does not fit', () => {
    // budget = 240: 50 + 10 + 150 = 210, then 210 + 10 + 30 > 240
    expect(getVisibleCount([50, 150, 30, 30], 0, 250, 10, 0, 0)).toBe(2);
  });

  it('keeps room for the inverted corner of the last tab', () => {
    // 300 + 2 * 10 + 16 (corner) = 336 no longer fits in 320
    expect(getVisibleCount([100, 100, 100], 0, 320, 10, 0, 16)).toBe(2);
    // budget = 290 - 16 - 10 - 50 = 214: 100 + 10 + 100 fits
    expect(getVisibleCount([100, 100, 100], 0, 290, 10, 50, 16)).toBe(2);
    // budget = 280 - 16 - 10 - 50 = 204: 100 + 10 + 100 does not fit
    expect(getVisibleCount([100, 100, 100], 0, 280, 10, 50, 16)).toBe(1);
  });

  it('pins the first tab when there is no active tab', () => {
    expect(getVisibleCount([100, 100, 100], -1, 300, 10, 50, 0)).toBe(2);
  });

  it('never returns less than one', () => {
    expect(getVisibleCount([500, 500], 0, 100, 10, 50, 0)).toBe(1);
  });
});

describe('getVisibleIndexes', () => {
  it('returns no index without items', () => {
    expect(getVisibleIndexes(0, 3, 0)).toEqual([]);
  });

  it('returns the first indexes when the active one is among them', () => {
    expect(getVisibleIndexes(5, 3, 1)).toEqual([0, 1, 2]);
  });

  it('replaces the last visible index by the active one', () => {
    expect(getVisibleIndexes(5, 3, 4)).toEqual([0, 1, 4]);
  });

  it('clamps the count between one and the number of items', () => {
    expect(getVisibleIndexes(2, 5, 0)).toEqual([0, 1]);
    expect(getVisibleIndexes(3, 0, 2)).toEqual([2]);
  });
});
