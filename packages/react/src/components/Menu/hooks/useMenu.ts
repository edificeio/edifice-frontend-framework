import { usePrevious } from '@uidotdev/usehooks';
import { useEffect, useMemo, useRef, useState } from 'react';

export const useMenu = () => {
  const menuRef = useRef<HTMLUListElement | null>(null);
  const menuItems = useRef<Set<HTMLLIElement>>(new Set()).current;
  const [currentIndex, setCurrentIndex] = useState(0);
  const previousIndex = usePrevious(currentIndex) ?? 0;

  useEffect(() => {
    if (currentIndex !== previousIndex) {
      const items = Array.from(menuItems);
      const currentNode = items[currentIndex]?.firstChild;
      const previousNode = items[previousIndex]?.firstChild;

      // https://www.w3.org/TR/wai-aria-practices/#kbd_roving_tabindex
      // @ts-ignore
      previousNode?.setAttribute('tabindex', '-1');
      // @ts-ignore
      currentNode?.setAttribute('tabindex', '0');
      // @ts-ignore
      currentNode?.focus({ preventScroll: true });
    }
  }, [currentIndex, previousIndex, menuItems]);

  const first = () => setCurrentIndex(0);
  const last = () => setCurrentIndex(menuItems.size - 1);

  const next = () => {
    const index = currentIndex === menuItems.size - 1 ? 0 : currentIndex + 1;
    setCurrentIndex(index);
  };

  const previous = () => {
    const index = currentIndex === 0 ? menuItems.size - 1 : currentIndex - 1;
    setCurrentIndex(index);
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLUListElement>) => {
    event.stopPropagation();

    switch (event.code) {
      case 'ArrowUp':
        event.preventDefault();
        previous();
        break;
      case 'ArrowDown':
        event.preventDefault();
        next();
        break;
      default:
        break;
    }
    switch (event.code) {
      case 'End':
        event.preventDefault();
        last();
        break;
      case 'Home':
        event.preventDefault();
        first();
        break;
      default:
        break;
    }
  };

  const childProps = useMemo(
    () => ({
      'data-menubar-menuitem': '',
      'role': 'menuitem',
    }),
    [],
  );

  return {
    menuRef,
    menuItems,
    childProps,
    onKeyDown,
  };
};
