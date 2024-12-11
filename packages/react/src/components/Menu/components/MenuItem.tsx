import { ReactNode, useEffect, useId, useRef } from 'react';
import { useMenuContext } from './MenuContext';

export const MenuItem = ({ children }: { children: ReactNode }) => {
  const itemRef = useRef<HTMLLIElement | null>(null);
  const id = useId();

  const { menuItems } = useMenuContext();

  useEffect(() => {
    const itemNode = itemRef.current;

    if (itemNode) {
      menuItems.add(itemNode);
    }

    return () => {
      if (itemNode) {
        menuItems.delete(itemNode);
      }
    };
  }, [menuItems]);

  return (
    <li ref={itemRef} id={id} role="none" data-menubar-listitem>
      {children}
    </li>
  );
};
