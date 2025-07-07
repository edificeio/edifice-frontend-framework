import {
  forwardRef,
  ReactNode,
  useEffect,
  useImperativeHandle,
  useMemo,
} from 'react';

import { Placement } from '@floating-ui/react';
import clsx from 'clsx';

import { useClickOutside } from '../../hooks';
import useDropdown from '../../hooks/useDropdown/useDropdown';
import DropdownCheckboxItem from './DropdownCheckboxItem';
import { DropdownContext } from './DropdownContext';
import DropdownItem from './DropdownItem';
import DropdownMenu from './DropdownMenu';
import DropdownMenuGroup from './DropdownMenuGroup';
import DropdownRadioItem from './DropdownRadioItem';
import DropdownSeparator from './DropdownSeparator';
import DropdownTrigger from './DropdownTrigger';

export interface DropdownApi {
  visible: boolean;
  isFocused: string | null;
  menuRef: React.MutableRefObject<HTMLUListElement | null>;
  triggerRef: React.MutableRefObject<HTMLButtonElement | null>;
  setVisible: (visible: boolean) => void;
  openDropdown: () => void;
  closeDropdown: () => void;
}
export interface DropdownProps {
  /** Children Props */
  children: ReactNode | ((...props: any) => ReactNode);
  /** Full width Dropdown */
  block?: boolean;
  /**
   * Add overflow and maxHeight
   */
  overflow?: boolean;
  /**
   * Default placement with FloatingUI
   */
  placement?: Placement;
  /**
   * If true, the text will not wrap
   */
  noWrap?: boolean;
  /**
   * Extra keydown handler for the Dropdown Trigger.
   * Useful for a11y keyboard navigation between a Dropdown element and other elements,
   * for example in the Toolbar component.
   */
  extraTriggerKeyDownHandler?: (
    event: React.KeyboardEvent<HTMLButtonElement>,
  ) => void;
  /**
   * Callback to get notified when dropdown `visible` state changes (opened/closed).
   */
  onToggle?: (visible: boolean) => void;

  /**
   * Whether the trigger is hovered or not.
   */
  isTriggerHovered?: boolean;
  /**
   * Whether to focus the first element when the dropdown is opened.
   */
  focusOnVisible?: boolean;
  /**
   * Whether to open the dropdown on space key press.
   */
  openOnSpace?: boolean;
  /**
   * Whether to focus the element on mouse enter.
   */
  focusOnMouseEnter?: boolean;
}

export type DropdownMenuOptions =
  | {
      /**
       * Object type
       */
      type?: undefined;
      /**
       * Icon component
       */
      icon: JSX.Element;
      /**
       * Label for a11y
       */
      label: string;
      /**
       * Action OnClick
       */
      action: (elem: any) => any;
    }
  | {
      /**
       * Object type
       */
      type: 'divider';
    };

const Root = forwardRef<DropdownApi, DropdownProps>(
  (
    {
      children,
      block,
      overflow = true,
      noWrap,
      placement = 'bottom-start',
      extraTriggerKeyDownHandler,
      onToggle,
      isTriggerHovered = false,
      focusOnVisible = true,
      openOnSpace = true,
      focusOnMouseEnter = true,
    }: DropdownProps,
    refDropdown,
  ) => {
    const {
      visible,
      isFocused,
      triggerProps,
      menuProps,
      itemProps,
      itemRefs,
      setVisible,
      menuRef,
      triggerRef,
      closeDropdown,
      openDropdown,
    } = useDropdown(
      placement,
      extraTriggerKeyDownHandler,
      isTriggerHovered,
      focusOnVisible,
      openOnSpace,
      focusOnMouseEnter,
    );
    useImperativeHandle(refDropdown, () => ({
      visible,
      setVisible,
      isFocused,
      menuRef,
      triggerRef,
      closeDropdown,
      openDropdown,
    }));

    /* Ref to close dropdown when clicking outside */
    const ref = useClickOutside(() => {
      setVisible(false);
    });

    const value = useMemo(
      () => ({
        visible,
        isFocused,
        triggerProps,
        menuProps,
        itemProps,
        itemRefs,
        block,
        setVisible,
        openDropdown,
        closeDropdown,
      }),
      [
        visible,
        isFocused,
        triggerProps,
        menuProps,
        itemProps,
        itemRefs,
        block,
        setVisible,
        openDropdown,
        closeDropdown,
      ],
    );

    const dropdown = clsx('dropdown', {
      'w-100': block,
      'dropdown-nowrap': noWrap,
      overflow,
    });

    useEffect(() => {
      onToggle?.(visible);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [visible]);

    return (
      <DropdownContext.Provider value={value}>
        <div ref={ref} className={dropdown}>
          {typeof children === 'function'
            ? children(triggerProps, itemRefs, setVisible)
            : children}
        </div>
      </DropdownContext.Provider>
    );
  },
);

Root.displayName = 'Dropdown';

/* Compound Components */
const Dropdown = Object.assign(Root, {
  Trigger: DropdownTrigger,
  Menu: DropdownMenu,
  Item: DropdownItem,
  Separator: DropdownSeparator,
  CheckboxItem: DropdownCheckboxItem,
  RadioItem: DropdownRadioItem,
  MenuGroup: DropdownMenuGroup,
});

export default Dropdown;
