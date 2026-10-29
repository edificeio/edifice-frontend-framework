import { getVisibleCount, getVisibleIndexes } from './visibleTabs';

describe('getVisibleCount', () => {
  it('returns every tab when they all fit', () => {
    // 3 * 100 = 300
    expect(getVisibleCount([100, 100, 100], 0, 300, 10, 50, 0)).toBe(3);
  });

  it('does not count any gap between tabs', () => {
    // A gap between tabs would make 300 + 2 * 10 = 320 overflow 300
    expect(getVisibleCount([100, 100, 100], 0, 300, 10, 50, 0)).toBe(3);
  });

  it('keeps room for the overflow trigger when tabs do not fit', () => {
    // budget = 290 - 10 - 50 = 230: 100 + 100 fits, a third does not
    expect(getVisibleCount([100, 100, 100], 0, 290, 10, 50, 0)).toBe(2);
  });

  it('always counts the active tab first', () => {
    // budget = 230: the wide active tab (200) leaves no room for another one
    expect(getVisibleCount([100, 100, 200], 2, 290, 10, 50, 0)).toBe(1);
  });

  it('stops at the first tab that does not fit', () => {
    // budget = 240 - 10 = 230: 50 + 150 = 200, then 200 + 40 > 230
    expect(getVisibleCount([50, 150, 40, 30], 0, 240, 10, 0, 0)).toBe(2);
  });

  it('keeps room for the inverted corner of the last tab', () => {
    // 300 + 16 (corner) = 316 no longer fits in 310
    expect(getVisibleCount([100, 100, 100], 0, 310, 10, 0, 16)).toBe(2);
    // budget = 276 - 16 - 10 - 50 = 200: 100 + 100 fits
    expect(getVisibleCount([100, 100, 100], 0, 276, 10, 50, 16)).toBe(2);
    // budget = 275 - 16 - 10 - 50 = 199: 100 + 100 does not fit
    expect(getVisibleCount([100, 100, 100], 0, 275, 10, 50, 16)).toBe(1);
  });

  it('pins the first tab when there is no active tab', () => {
    expect(getVisibleCount([100, 100, 100], -1, 290, 10, 50, 0)).toBe(2);
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
