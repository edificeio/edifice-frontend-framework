import { useEffect, useRef } from 'react';

export default function useTrapFocus(isActive?: boolean) {
  const ref = useRef<HTMLElement | null>(null);
  const focusableElements =
    'button:not([disabled]), [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

  useEffect(() => {
    if (!isActive) return;

    const node: any = ref.current;
    /** First Focusable Element */
    const firstFocusableElement = node.querySelectorAll(
      focusableElements,
    )[0] as HTMLElement;
    /** Focusable Content */
    const focusableContent = node.querySelectorAll(focusableElements);
    /** Last Focusable Element */
    const lastFocusableElement =
      ref && (focusableContent?.[focusableContent.length - 1] as HTMLElement);

    const handleKeydown = (event: KeyboardEvent) => {
      const isTabPressed = event.key === 'Tab';

      if (!isTabPressed) {
        return;
      }

      if (event.shiftKey) {
        /* shift + tab */ if (
          document.activeElement === firstFocusableElement
        ) {
          lastFocusableElement.focus();
          event.preventDefault();
        }
      } /* tab */ else {
        if (document.activeElement === lastFocusableElement) {
          firstFocusableElement.focus();
          event.preventDefault();
        }
      }
    };

    if (node) {
      node.addEventListener('keydown', handleKeydown);
      return () => {
        node.removeEventListener('keydown', handleKeydown);
      };
    }
  }, [isActive]);

  return ref;
}
