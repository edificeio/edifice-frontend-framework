/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';

import { IntersectionOptions, useInView } from 'react-intersection-observer';

type LazyLoadOptions = {
  ref?: React.RefObject<HTMLElement>;
  intersectionOptions?: IntersectionOptions;
};

/**
 * Preload a `src` URL and return true if it is available.
 * @param src the URL to preload
 * @param options if defined, lazy-load the `src` URL when ref is defined and visible,
 *        with respect to the [`intersectionOptions`](https://github.com/thebuilder/react-intersection-observer/tree/dceba7f52aebea4d62d539bc55a1db129226bb6c?tab=readme-ov-file#options)
 * @return `true` if `src` is available, or false otherwise, or `null` while not tested.
 */
export default function useThumbnail(src: string, options?: LazyLoadOptions) {
  const [status, setStatus] = useState<boolean | null>(null);

  // If defined, wait for the currentRef to be "InView" to check if its thumbnail exists.
  const { ref: inViewRef, inView } = useInView({
    triggerOnce: true,
    ...options?.intersectionOptions,
  });

  // This `useEffect` is required to share the ref node with useInView() above
  useEffect(() => {
    // Callback refs, like the one from `useInView`, is a function that takes the node as an argument
    options?.ref?.current && inViewRef?.(options.ref.current);
  }, [options?.ref, inViewRef]);

  useEffect(() => {
    if (options?.ref === undefined || inView) {
      const img = new Image();
      img.src = src;

      img.onload = () => {
        setStatus(true);
      };

      img.onerror = () => {
        setStatus(false);
      };

      return () => {
        img.onload = null;
        img.onerror = null;
        setStatus(null);
      };
    }
  }, [inView]);

  return status;
}
