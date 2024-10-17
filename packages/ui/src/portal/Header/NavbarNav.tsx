import { ReactNode } from 'react';

import clsx from 'clsx';

export interface NavBarNavProps extends React.ComponentPropsWithoutRef<'ul'> {
  children: ReactNode;
  className?: string;
}

export function NavBarNav({
  children,
  className,
  ...restProps
}: NavBarNavProps) {
  const classes = clsx('navbar-nav', className);

  return (
    <ul className={classes} {...restProps}>
      {children}
    </ul>
  );
}
