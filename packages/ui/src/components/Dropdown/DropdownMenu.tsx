import { ComponentPropsWithRef, ReactNode, Ref, forwardRef } from 'react';

import clsx from 'clsx';

import { useDropdownContext } from './DropdownContext';

interface Item {
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

interface Divider {
  /**
   * Object type
   */
  type: 'divider';
}

export type DropdownMenuOptions = Item | Divider;

export interface DropdownMenuProps extends ComponentPropsWithRef<'div'> {
  children: ReactNode;
  /** Use whole width ? */
  block?: boolean;
  /** Do not apply the default CSS classes in addition to those in the className prop ? */
  unstyled?: boolean;
}

const DropdownMenu = forwardRef(
  (
    { children, block, unstyled, ...restProps }: DropdownMenuProps,
    forwardRef: Ref<HTMLDivElement>,
  ) => {
    const { menuProps, visible } = useDropdownContext();

    const className = clsx(
      { 'w-100': block, 'bg-white shadow rounded-4 p-8': !unstyled },
      menuProps.className,
      restProps.className,
    );

    const mergedProps = { ...menuProps, ...restProps, className };

    return visible ? (
      <div ref={forwardRef} {...mergedProps}>
        {children}
      </div>
    ) : null;
  },
);

DropdownMenu.displayName = 'Dropdown.Menu';

export default DropdownMenu;
