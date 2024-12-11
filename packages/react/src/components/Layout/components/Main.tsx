import { ComponentPropsWithoutRef, ReactNode } from 'react';

import clsx from 'clsx';

export interface MainProps extends ComponentPropsWithoutRef<'main'> {
  /**
   * App content
   */
  children: ReactNode;
  /**
   * Optional class for styling purpose
   */
  className?: string;
}

export default function Main({ children, className, ...restProps }: MainProps) {
  const classes = clsx('container-fluid', className);
  return (
    <main className={classes} {...restProps}>
      {children}
    </main>
  );
}

Main.displayName = 'Main';
