import {
  ComponentPropsWithoutRef,
  ForwardedRef,
  ReactNode,
  forwardRef,
} from 'react';

import clsx from 'clsx';
import { VisuallyHidden } from '../..';

/**
 * Navbar entry. Rendered as a link when `link` is set (navigation), otherwise
 * as a button (e.g. opening a panel), so every entry of a navbar shares the
 * same `.nav-link` look whatever it does.
 */
interface NavLinkBaseProps {
  /**
   * To override default classes
   */
  className?: string;
  /**
   * Children props
   */
  children: ReactNode;
  /**
   * Label exposed to assistive technologies only (visually hidden)
   */
  translate?: string;
}

type NavLinkAnchorProps = NavLinkBaseProps &
  Omit<ComponentPropsWithoutRef<'a'>, keyof NavLinkBaseProps | 'href'> & {
    /**
     * href link: renders the entry as a link
     */
    link: string;
  };

type NavLinkButtonProps = NavLinkBaseProps &
  Omit<ComponentPropsWithoutRef<'button'>, keyof NavLinkBaseProps> & {
    link?: never;
  };

export type NavLinkProps = NavLinkAnchorProps | NavLinkButtonProps;

const isAnchorProps = (props: NavLinkProps): props is NavLinkAnchorProps =>
  props.link !== undefined;

const NavLinkLabel = ({ translate }: Pick<NavLinkBaseProps, 'translate'>) =>
  translate ? (
    <VisuallyHidden>
      <span className="nav-text">{translate}</span>
    </VisuallyHidden>
  ) : null;

export const NavLink = forwardRef<
  HTMLAnchorElement | HTMLButtonElement,
  NavLinkProps
>((props, ref) => {
  if (isAnchorProps(props)) {
    const { link, className, children, translate, ...restProps } = props;

    return (
      <a
        ref={ref as ForwardedRef<HTMLAnchorElement>}
        href={link}
        className={clsx('nav-link', className)}
        {...restProps}
      >
        {children}
        <NavLinkLabel translate={translate} />
      </a>
    );
  }

  // `link` is `undefined` here: keep it out of the DOM attributes.
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { link, className, children, translate, ...restProps } = props;

  return (
    <button
      ref={ref as ForwardedRef<HTMLButtonElement>}
      type="button"
      className={clsx('nav-link', className)}
      {...restProps}
    >
      {children}
      <NavLinkLabel translate={translate} />
    </button>
  );
});

NavLink.displayName = 'NavLink';
