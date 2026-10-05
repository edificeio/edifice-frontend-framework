import {
  ComponentPropsWithoutRef,
  ForwardedRef,
  ReactNode,
  forwardRef,
} from 'react';

import clsx from 'clsx';
import { VisuallyHidden } from '../..';

export interface NavLinkProps<T> extends Omit<
  ComponentPropsWithoutRef<'a'>,
  'className' | 'translate'
> {
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

function NavLinkRender(
  {
    link,
    className,
    children,
    translate,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    button,
    ...restProps
  }: NavLinkProps<string>,
  ref: ForwardedRef<HTMLAnchorElement>,
) {
  const classes = clsx('nav-link', className);

  return (
    <a ref={ref} href={link} className={classes} {...restProps}>
      {children}
      {translate && (
        <VisuallyHidden>
          <span className="nav-text">{translate}</span>
        </VisuallyHidden>
      )}
    </a>
  );
}

export const NavLink = forwardRef(NavLinkRender);

NavLink.displayName = 'NavLink';
