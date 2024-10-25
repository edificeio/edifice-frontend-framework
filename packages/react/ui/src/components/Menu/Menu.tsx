import { usePrevious } from "@uidotdev/usehooks";
import { ReactNode, useEffect, useMemo, useRef, useState } from "react";
import { MenuButton } from "./MenuButton";
import { MenuContext } from "./MenuContext";
import { MenuItem } from "./MenuItem";

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
      previousNode?.setAttribute("tabindex", "-1");
      // @ts-ignore
      currentNode?.setAttribute("tabindex", "0");
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
      case "ArrowUp":
        event.preventDefault();
        previous();
        break;
      case "ArrowDown":
        event.preventDefault();
        next();
        break;
      default:
        break;
    }
    switch (event.code) {
      case "End":
        event.preventDefault();
        last();
        break;
      case "Home":
        event.preventDefault();
        first();
        break;
      default:
        break;
    }
  };

  const childProps = useMemo(
    () => ({
      "data-menubar-menuitem": "",
      role: "menuitem",
    }),
    [],
  );

  const values = useMemo(
    () => ({
      menuRef,
      menuItems,
      childProps,
    }),
    [childProps, menuItems],
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
