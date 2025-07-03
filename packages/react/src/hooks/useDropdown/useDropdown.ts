/* eslint-disable react-hooks/exhaustive-deps */
import {
  Dispatch,
  MutableRefObject,
  SetStateAction,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
} from 'react';

import {
  Placement,
  autoUpdate,
  flip,
  offset,
  safePolygon,
  size,
  useFloating,
  useHover,
} from '@floating-ui/react';

import { mergeRefs } from '../../utilities/refs/ref';

export enum KEYS {
  Enter = 'Enter',
  Space = 'Space',
  ArrowDown = 'ArrowDown',
  ArrowUp = 'ArrowUp',
  Down = 'Down',
  Up = 'Up',
  Tab = 'Tab',
  Esc = 'Esc',
  Escape = 'Escape',
  Home = 'Home',
  End = 'End',
  PageUp = 'PageUp',
  PageDown = 'PageDown',
}

export interface UseDropdownProps {
  isFocused: string | null;
  visible: boolean;
  itemRefs: MutableRefObject<{ [key: string]: HTMLElement | null }>;
  triggerRef: MutableRefObject<HTMLButtonElement | null>;
  menuRef: MutableRefObject<HTMLUListElement | null>;
  triggerProps: Record<string, any>;
  menuProps: Record<string, any>;
  itemProps: Record<string, any>;
  setVisible: Dispatch<SetStateAction<boolean>>;
  openOnSpace?: boolean;
  openDropdown: () => void;
  closeDropdown: () => void;
}

const useDropdown = (
  placement: Placement | undefined,
  extraTriggerKeyDownHandler?: (
    event: React.KeyboardEvent<HTMLButtonElement>,
  ) => void,
  isTriggerHovered: boolean = false,
  focusOnVisible: boolean = true,
  openOnSpace: boolean = true,
  focusOnMouseEnter: boolean = true,
): UseDropdownProps => {
  /* Unique Dropdown Id */
  const id = useId();

  /* states */
  const [visible, setVisible] = useState<boolean>(false);
  const [activeIndex, setActiveIndex] = useState<number>(-1);
  const [isFocused, setIsFocused] = useState<string | null>(null);

  const { refs, floatingStyles, context } = useFloating({
    placement,
    open: visible,
    onOpenChange: setVisible,
    whileElementsMounted: autoUpdate,
    middleware: [
      offset(0),
      size({
        apply({ rects, elements }) {
          elements.floating.style.minWidth = `${rects.reference.width}px`;
        },
      }),
      flip({ padding: 0 }),
    ],
  });

  // Hover interaction for the dropdown trigger. This is used to open the dropdown on hover. The dropdown should be closed on mouse leave.
  useHover(context, {
    enabled: isTriggerHovered,
    // Configure the delay for opening and closing separately.
    delay: {
      open: 200,
    },
    handleClose: safePolygon(),
  });

  /* refs */
  const menuRef = useRef<HTMLUListElement | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const itemRefs = useRef({});

  useEffect(() => {
    if (visible && menuRef.current && focusOnVisible) {
      menuRef.current.focus();
      setActiveIndex(0);
    } else {
      setActiveIndex(-1);
      itemRefs.current = {};
    }
  }, [visible]);

  useEffect(() => {
    if (activeIndex !== -1) {
      const filteredItems = Object.values(itemRefs.current).filter(
        (item) => !!item,
      );
      if (activeIndex < 0 || activeIndex >= filteredItems.length) {
        setActiveIndex(-1);
        setIsFocused(null);
        return;
      }
      const currentItem = filteredItems[activeIndex] as HTMLElement;

      if (currentItem) {
        const id = currentItem.getAttribute('id') as string;
        setIsFocused(id);
        currentItem.focus();
      }
    }
  }, [activeIndex]);

  const nextItem = () => {
    const items = Object.values(itemRefs.current);
    const itemCount = items.length;
    setActiveIndex((prevIndex) => (prevIndex + 1) % itemCount);
  };

  const previousItem = () => {
    const items = Object.values(itemRefs.current);
    const itemCount = items.length;
    setActiveIndex((prevIndex) => (prevIndex - 1 + itemCount) % itemCount);
  };

  const firstItem = () => {
    setActiveIndex(0);
  };

  const lastItem = () => {
    const items = Object.values(itemRefs.current);
    const itemCount = items.length;
    setActiveIndex(itemCount - 1);
  };

  const openDropdown = useCallback(() => {
    setVisible(true);
  }, []);

  const closeDropdown = useCallback(() => {
    if (triggerRef.current) {
      // Closing the dropdown should not scroll the window content.
      triggerRef.current.focus({ preventScroll: true });
      setVisible(false);
    }
  }, []);

  const stopEvents = (flag: boolean, event: React.KeyboardEvent) => {
    if (flag) {
      event.stopPropagation();
      event.preventDefault();
    }
  };

  const onTriggerKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLButtonElement>) => {
      let flag = false;

      switch (event.code) {
        case ' ':
        case KEYS.Space:
          if (!openOnSpace) {
            break;
          }
        // intentional fallthrough
        case KEYS.Enter:
        case KEYS.ArrowDown:
        case KEYS.Down:
          openDropdown();
          flag = true;
          break;
        case KEYS.Esc:
        case KEYS.Escape:
          closeDropdown();
          flag = true;
          break;
        case KEYS.Up:
        case KEYS.ArrowUp:
          openDropdown();
          flag = true;
          break;
        default:
          break;
      }

      extraTriggerKeyDownHandler?.(event);
      stopEvents(flag, event);
    },
    [closeDropdown, openDropdown],
  );

  const onMenuItemMouseEnter = (event: React.MouseEvent) => {
    if (focusOnMouseEnter) {
      const items: HTMLElement[] = Object.values(itemRefs.current);

      const index = items.findIndex(
        (item) => item.id === event.currentTarget.getAttribute('id'),
      );

      setActiveIndex(index);
    }
  };

  const onMenuItemKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLElement>, onSuccess?: () => void) => {
      let flag = false;

      if (event.shiftKey) {
        if (event.key === 'Tab') {
          closeDropdown();
          flag = true;
        }
      } else {
        switch (event.code) {
          case KEYS.Escape:
            closeDropdown();
            break;
          // FIX WB2-1334: Space event prevents user to insert Space during search, so we comment it to keep a trace.
          // case KEYS.Space:
          case ' ':
          case KEYS.Enter:
            if (activeIndex !== -1) {
              const currentItem = Object.values(itemRefs.current)[
                activeIndex
              ] as HTMLElement;
              const role = currentItem.getAttribute('role');

              if (role === 'menuitem') {
                if (triggerRef.current) {
                  triggerRef.current.focus();
                  setVisible(false);
                }
              }

              onSuccess?.();
            }
            flag = true;
            break;
          case KEYS.ArrowDown:
          case KEYS.Down:
            nextItem();
            flag = true;
            break;
          case KEYS.ArrowUp:
          case KEYS.Up:
            previousItem();
            flag = true;
            break;
          case KEYS.Home:
            firstItem();
            flag = true;
            break;
          case KEYS.End:
            lastItem();
            flag = true;
            break;
          default:
            break;
        }
        stopEvents(flag, event);
      }
    },
    [activeIndex, closeDropdown],
  );

  const onTriggerClick = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      if (visible === true) {
        setVisible(false);
      } else {
        setVisible(true);
      }
      event.stopPropagation();
      event.preventDefault();
    },
    [visible],
  );

  return {
    isFocused,
    visible,
    itemRefs,
    triggerRef,
    menuRef,
    /* TriggerProps to spread to any Trigger component */
    triggerProps: {
      'ref': mergeRefs(triggerRef, refs.setReference),
      'id': `dropdown-toggle-${id}`,
      'aria-haspopup': 'menu',
      'aria-controls': `dropdown-${id}`,
      'aria-expanded': visible ? true : false,
      'className': `${visible ? 'selected' : ''}`,
      'onClick': onTriggerClick,
      'onKeyDown': onTriggerKeyDown,
      'aria-activedescendant': isFocused,
    },
    /* MenuProps to spread to any Menu Component */
    menuProps: {
      'ref': mergeRefs(menuRef, refs.setFloating),
      'className': 'dropdown-menu',
      'aria-labelledby': `dropdown-toggle-${id}`,
      'style': { ...floatingStyles },
    },
    /* ItemProps to spread to any item Component */
    itemProps: {
      onMenuItemMouseEnter,
      onMenuItemClick: closeDropdown,
      onMenuItemKeyDown,
    },
    openDropdown,
    closeDropdown,
    setVisible,
  };
};

export default useDropdown;
