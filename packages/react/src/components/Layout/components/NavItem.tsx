import { forwardRef, ReactNode, Ref } from 'react';

import clsx from 'clsx';

export interface NavItemProps extends React.ComponentPropsWithRef<'li'> {
  children: ReactNode;
  className?: string;
}

export const NavItem = forwardRef(
  (
    { children, className, ...restProps }: NavItemProps,
    ref: Ref<HTMLLIElement>,
  ) => {
    const classes = clsx('nav-item', className);

    return (
      <li ref={ref} className={classes} {...restProps}>
        {children}
      </li>
    );
  },
);

NavItem.displayName = 'NavItem';
