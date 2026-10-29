/**
 * Returns how many tabs fit in the available space. The active tab is always
 * counted, then the other tabs are added from the start until one does not
 * fit. Never returns less than one.
 *
 * Tabs are laid out without gap between them. `gap` is the space between the
 * tab list and the overflow dropdown trigger, `trigger` the width of that
 * trigger, `corner` the room needed after the last tab for its inverted corner.
 */
export const getVisibleCount = (
  widths: number[],
  activeIndex: number,
  available: number,
  gap: number,
  trigger: number,
  corner: number,
): number => {
  const total = widths.reduce((sum, w) => sum + w, 0) + corner;
  if (total <= available) return widths.length;

  // Not everything fits: keep room for the overflow dropdown trigger.
  const pinned = activeIndex < 0 ? 0 : activeIndex;
  const budget = available - corner - gap - trigger;
  let used = widths[pinned];
  let count = 1;

  for (let i = 0; i < widths.length; i++) {
    if (i === pinned) continue;
    if (used + widths[i] > budget) break;
    used += widths[i];
    count++;
  }

  return count;
};

/**
 * Returns the indexes of the visible tabs: the first `count` items, the last
 * one being replaced by the active item when it is not among them.
 */
export const getVisibleIndexes = (
  length: number,
  count: number,
  activeIndex: number,
): number[] => {
  if (length === 0) return [];
  const visibleCount = Math.max(1, Math.min(count, length));
  const indexes = Array.from({ length: visibleCount }, (_, i) => i);
  if (activeIndex >= visibleCount) indexes[visibleCount - 1] = activeIndex;
  return indexes;
};
