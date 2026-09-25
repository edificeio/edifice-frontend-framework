import { useState } from 'react';

import {
  safePolygon,
  useClick,
  useDismiss,
  useFloating,
  useHover,
  useInteractions,
} from '@floating-ui/react';

export interface UseSafeHoverPopoverOptions {
  /** Opens the popover on hover. Defaults to true. */
  hoverEnabled?: boolean;
  /** Toggles the popover on click of the reference element. Defaults to false. */
  clickEnabled?: boolean;
}

/**
 * Open state + interaction handlers for a hover-triggered header popover,
 * decoupled from floating-ui's own positioning (the caller keeps its own
 * CSS-based placement and only spreads the returned props for interaction).
 *
 * `handleClose: safePolygon()` keeps the popover open while the pointer is
 * moving from the trigger towards the popover along a diagonal path, even
 * though the popover is wider than its trigger and the two don't overlap
 * horizontally — a plain mouseover/mouseout pair would otherwise close it
 * as soon as the pointer leaves the trigger's own (narrow) rectangle.
 */
export function useSafeHoverPopover({
  hoverEnabled = true,
  clickEnabled = false,
}: UseSafeHoverPopoverOptions = {}) {
  const [open, setOpen] = useState(false);

  const { refs, context } = useFloating({ open, onOpenChange: setOpen });

  const hover = useHover(context, {
    enabled: hoverEnabled,
    handleClose: safePolygon(),
  });
  const click = useClick(context, { enabled: clickEnabled });
  const dismiss = useDismiss(context);

  const { getReferenceProps, getFloatingProps } = useInteractions([
    hover,
    click,
    dismiss,
  ]);

  return {
    open,
    setReference: refs.setReference,
    setFloating: refs.setFloating,
    getReferenceProps,
    getFloatingProps,
  };
}
