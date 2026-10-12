import { useCallback, useLayoutEffect, useMemo, useRef, useState } from 'react';

import { TabsKidsItemProps } from '../components/TabsKidsItem';
import { getVisibleCount, getVisibleIndexes } from '../utils/visibleTabs';

interface UseTabsKidsOverflowProps {
  items: TabsKidsItemProps[];
  activeId: string;
  isCompact: boolean;
}

/**
 * Splits the items between the visible tabs and the overflow dropdown,
 * according to the space available in the tab bar.
 *
 * Tied to the markup of `TabsKidsList`: `measureRef` must contain a hidden
 * copy of every `.tabs-kids-item` and the `.tabs-kids-measure-trigger`.
 */
export const useTabsKidsOverflow = ({
  items,
  activeId,
  isCompact,
}: UseTabsKidsOverflowProps) => {
  const tabBarRef = useRef<HTMLDivElement>(null);
  const measureRef = useRef<HTMLDivElement>(null);
  const [visibleCount, setVisibleCount] = useState(items.length);

  const activeIndex = items.findIndex((item) => item.id === activeId);
  // Read at measure time only: selecting another tab must not change the
  // number of visible tabs, a longer label gets truncated instead.
  const activeIndexRef = useRef(activeIndex);
  activeIndexRef.current = activeIndex;

  // Measure every tab in the hidden copy and count the ones that fit.
  const updateVisibleCount = useCallback(() => {
    const bar = tabBarRef.current;
    const measure = measureRef.current;
    if (!bar || !measure) return;

    const barStyle = getComputedStyle(bar);
    const available =
      bar.clientWidth -
      parseFloat(barStyle.paddingInlineStart) -
      parseFloat(barStyle.paddingInlineEnd);
    const tabs = Array.from(
      measure.querySelectorAll<HTMLElement>('.tabs-kids-item'),
    );
    const trigger = measure.querySelector<HTMLElement>(
      '.tabs-kids-measure-trigger',
    );
    const gap = parseFloat(getComputedStyle(measure).columnGap) || 0;
    // The inverted corner of the last tab sticks out of it: keep room for it,
    // before the trigger or the end of the bar.
    const corner = tabs[0]
      ? parseFloat(getComputedStyle(tabs[0], '::after').width) || 0
      : 0;

    setVisibleCount(
      getVisibleCount(
        tabs.map((tab) => tab.offsetWidth),
        activeIndexRef.current,
        available,
        gap,
        trigger?.offsetWidth ?? 0,
        corner,
      ),
    );
  }, []);

  useLayoutEffect(() => {
    updateVisibleCount();
  }, [updateVisibleCount, items, isCompact]);

  useLayoutEffect(() => {
    const bar = tabBarRef.current;
    if (!bar || typeof ResizeObserver === 'undefined') return;
    const observer = new ResizeObserver(() => updateVisibleCount());
    observer.observe(bar);
    return () => observer.disconnect();
  }, [updateVisibleCount]);

  const { visibleItems, overflowItems } = useMemo(() => {
    const indexes = getVisibleIndexes(items.length, visibleCount, activeIndex);
    return {
      visibleItems: indexes.map((i) => items[i]),
      overflowItems: items.filter((_, i) => !indexes.includes(i)),
    };
  }, [items, visibleCount, activeIndex]);

  return { tabBarRef, measureRef, visibleItems, overflowItems };
};
