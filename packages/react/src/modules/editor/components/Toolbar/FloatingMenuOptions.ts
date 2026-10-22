import { Placement, VirtualElement } from '@floating-ui/dom';
import { useCallback } from 'react';

// v3's `options` prop has no `zIndex` field - every BubbleMenu/FloatingMenu
// in the editor toolbar sets it via `style` instead.
export const FLOATING_MENU_Z_INDEX = 999;

/**
 * Builds the `options` prop shared by every BubbleMenu/FloatingMenu in the
 * editor toolbar - only `placement` and `offset` vary from one menu to the
 * next.
 */
export function getFloatingMenuOptions({
  placement,
  offset,
}: {
  placement: Placement;
  offset: { mainAxis: number; crossAxis: number };
}) {
  return {
    placement,
    // tiptap builds its middleware array from named fields only - a raw
    // `middleware: [offset(...)]` key is silently ignored.
    offset,
    strategy: 'absolute' as const,
  };
}

/**
 * Wraps an already-memoized virtual element in a stable
 * `getReferencedVirtualElement` callback. v3's BubbleMenu re-runs a
 * `dispatch` effect whenever this prop's identity changes; combined with
 * `useEditorState` (which re-renders on every transaction), an inline
 * `() => reference` here causes an infinite render loop.
 */
export function useReferencedVirtualElement(reference: VirtualElement) {
  return useCallback(() => reference, [reference]);
}
