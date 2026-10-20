import { ComponentPropsWithoutRef, ReactNode } from 'react';

import clsx from 'clsx';

/**
 * Action row (icon + label), used in the Header v2 account popover.
 * Rendered as a link when `href` is set (navigation), otherwise as a button
 * (e.g. opening a modal or triggering an in-page action).
 *
 * Context-free on purpose (no Dropdown context, no `.dropdown-item` styles):
 * it is meant to be reused as the item primitive when the Dropdown component
 * is redesigned (see ENABLING-882).
 */
interface ActionItemBaseProps {
  /**
   * Icon displayed before the label
   */
  icon?: ReactNode;
  /**
   * Label
   */
  children: ReactNode;
  /**
   * `destructive` for destructive actions (e.g. logout)
   */
  variant?: 'default' | 'destructive';
  /**
   * Optional class for styling purpose
   */
  className?: string;
}

type ActionItemLinkProps = ActionItemBaseProps &
  Omit<ComponentPropsWithoutRef<'a'>, keyof ActionItemBaseProps> & {
    /**
     * Link target: renders the item as a link
     */
    href: string;
  };

type ActionItemButtonProps = ActionItemBaseProps &
  Omit<ComponentPropsWithoutRef<'button'>, keyof ActionItemBaseProps> & {
    href?: never;
  };

export type ActionItemProps = ActionItemLinkProps | ActionItemButtonProps;

export const ActionItem = ({
  icon,
  children,
  variant = 'default',
  className,
  ...restProps
}: ActionItemProps) => {
  const classes = clsx(
    'action-item',
    { 'action-item--destructive': variant === 'destructive' },
    className,
  );

  const content = (
    <>
      {icon && (
        <span className="action-item__icon" aria-hidden="true">
          {icon}
        </span>
      )}

      <span className="action-item__label">{children}</span>
    </>
  );

  if (restProps.href !== undefined) {
    return (
      <a className={classes} {...(restProps as ComponentPropsWithoutRef<'a'>)}>
        {content}
      </a>
    );
  }

  return (
    <button
      type="button"
      className={classes}
      {...(restProps as ComponentPropsWithoutRef<'button'>)}
    >
      {content}
    </button>
  );
};

ActionItem.displayName = 'ActionItem';

export default ActionItem;
