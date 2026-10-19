import { ComponentPropsWithoutRef, ReactNode } from 'react';

import clsx from 'clsx';

/**
 * Action row (icon + label) rendered as a link, used in the Header v2
 * account popover.
 *
 * Context-free on purpose (no Dropdown context, no `.dropdown-item` styles):
 * it is meant to be reused as the item primitive when the Dropdown component
 * is redesigned (see ENABLING-882).
 */
export interface ActionItemProps extends ComponentPropsWithoutRef<'a'> {
  /**
   * Link target
   */
  href: string;
  /**
   * Icon displayed before the label
   */
  icon?: ReactNode;
  /**
   * Label
   */
  children: ReactNode;
  /**
   * `danger` for destructive actions (e.g. logout)
   */
  variant?: 'default' | 'danger';
}

export const ActionItem = ({
  href,
  icon,
  children,
  variant = 'default',
  className,
  ...restProps
}: ActionItemProps) => {
  const classes = clsx(
    'action-item',
    { 'action-item--danger': variant === 'danger' },
    className,
  );

  return (
    <a href={href} className={classes} {...restProps}>
      {icon}
      <span className="action-item-label">{children}</span>
    </a>
  );
};

ActionItem.displayName = 'ActionItem';

export default ActionItem;
