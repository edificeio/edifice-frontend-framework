import { ReactNode } from 'react';

import clsx from 'clsx';
import { VisuallyHidden } from '../..';

export interface NavLinkProps<T> {
  /**
   * href link
   */
  link: T;
  /**
   * To override default classes
   */
  className?: T;
  /**
   * Children props
   */
  children: ReactNode;
  /**
   * Translate Text
   */
  translate?: T;
  /**
   * Give Navlink Button Style (for 1D navbar)
   */
  button?: boolean;
}

export function NavLink({
  link,
  className,
  children,
  translate,
  ...restProps
}: NavLinkProps<string>) {
  const classes = clsx('nav-link', className);

  return (
    <a href={link} className={classes} {...restProps}>
      {children}
      {translate && (
        <VisuallyHidden>
          <span className="nav-text">{translate}</span>
        </VisuallyHidden>
      )}
    </a>
  );
}
