import { createContext, Ref, useContext } from 'react';

export interface MenuContextProps {
  menuRef: Ref<HTMLUListElement | null>;
  menuItems: Set<HTMLLIElement>;
  childProps: {
    [key: string]: string;
  };
}

export const MenuContext = createContext<MenuContextProps | null>(null!);

export function useMenuContext() {
  const context = useContext(MenuContext);
  if (!context) {
    throw new Error(`Cannot be rendered outside the Menu component`);
  }
  return context;
}
