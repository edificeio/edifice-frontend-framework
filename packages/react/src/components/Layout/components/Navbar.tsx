import { type ReactNode } from 'react';

import clsx from 'clsx';

export interface NavbarProps {
  children: ReactNode;
  className?: string;
}

export function Navbar({ children, className, ...restProps }: NavbarProps) {
  const classes = clsx('navbar', className);

  return (
    <nav className={classes} {...restProps}>
      {children}
    </nav>
  );
}
