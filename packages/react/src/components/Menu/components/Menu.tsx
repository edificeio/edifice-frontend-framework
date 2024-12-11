import { ReactNode, useMemo } from 'react';
import { useMenu } from '../hooks/useMenu';
import { MenuButton } from './MenuButton';
import { MenuContext } from './MenuContext';
import { MenuItem } from './MenuItem';

/**
 * Menu Component to navigate between routes with react-router-dom
 */
export const Menu = ({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) => {
  const { menuRef, childProps, menuItems, onKeyDown } = useMenu();

  const values = useMemo(
    () => ({
      menuRef,
      menuItems,
      childProps,
    }),
    [childProps, menuItems, menuRef],
  );

  return (
    <MenuContext.Provider value={values}>
      <nav aria-label={label} className="menu">
        <ul
          ref={menuRef}
          role="menubar"
          aria-label={label}
          onKeyDown={onKeyDown}
          data-menubar-list
          className="list-unstyled d-flex flex-column gap-4"
        >
          {children}
        </ul>
      </nav>
    </MenuContext.Provider>
  );
};

Menu.Item = MenuItem;
Menu.Button = MenuButton;
