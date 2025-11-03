import { useCallback, useRef } from 'react';

/**
 * A custom React hook that provides infinite scroll functionality using the Intersection Observer API.
 *
 * This hook returns a ref callback that can be attached to a DOM element (typically at the bottom
 * of a scrollable list). When that element becomes visible in the viewport, the provided callback
 * function is executed, allowing you to load more content.
 *
 * @param params - Configuration object for the infinite scroll hook
 * @param params.callback - Function to execute when the observed element intersects with the viewport
 * @param params.options - Optional Intersection Observer configuration options (defaults to { threshold: 0.1 })
 *
 * @returns A ref callback function that should be attached to the target DOM element
 *
 * @example
 * ```typescript
 * const loadMoreRef = useInfiniteScroll({
 *     // Load more data when the element is visible
 *   callback: loadMoreItems,
 *   options: { threshold: 0.5 } // Trigger when 50% of element is visible
 * });
 *
 * return (
 *   <div>
 *     {items.map(item => <Item key={item.id} {...item} />)}
 *     <div ref={loadMoreRef}>Loading...</div>
 *   </div>
 * );
 * ```
 */
export default function useInfiniteScroll({
  callback,
  options = { threshold: 0.1 },
}: {
  callback: () => void;
  options?: IntersectionObserverInit;
}) {
  const observerRef = useRef<IntersectionObserver | null>(null);

  const refCallback = useCallback(
    (node: HTMLElement | null) => {
      // Disconnect any existing observer
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }

      if (!node) return;

      const observer = new IntersectionObserver(async (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            await callback();
          }
        }
      }, options);

      observer.observe(node);
      observerRef.current = observer;
    },
    [callback, options],
  );
  return refCallback;
}
