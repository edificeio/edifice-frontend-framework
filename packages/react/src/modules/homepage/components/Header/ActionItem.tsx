import {
  ComponentPropsWithoutRef,
  ForwardedRef,
  ReactNode,
  forwardRef,
} from 'react';

import clsx from 'clsx';

/**
 * Action row (icon + label), used in the Header v2 account popover.
 * Rendered as a link when `href` is set (navigation), otherwise as a button
 * (e.g. opening a modal or triggering an in-page action).
 *
 * Context-free on purpose (no Dropdown context, no `.dropdown-item` styles):
 * it is meant to be reused as the item primitive when the Dropdown component
 * is redesigned (see ENABLING-882). The ref is forwarded to the underlying
 * element so a parent menu can manage focus.
 */
interface ActionItemBaseProps {
  /**
   * Icon displayed before the label (hidden from assistive technologies)
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

const isLinkProps = (props: ActionItemProps): props is ActionItemLinkProps =>
  props.href !== undefined;

const getClasses = (
  variant: NonNullable<ActionItemBaseProps['variant']>,
  className?: string,
) =>
  clsx(
    'action-item',
    { 'action-item--destructive': variant === 'destructive' },
    className,
  );

const ActionItemContent = ({
  icon,
  children,
}: Pick<ActionItemBaseProps, 'icon' | 'children'>) => (
  <>
    {icon && (
      <span className="action-item__icon" aria-hidden="true">
        {icon}
      </span>
    )}
    <span className="action-item__label">{children}</span>
  </>
);

export const ActionItem = forwardRef<
  HTMLAnchorElement | HTMLButtonElement,
  ActionItemProps
>((props, ref) => {
  if (isLinkProps(props)) {
    const { icon, children, variant = 'default', className, ...rest } = props;

    return (
      <a
        ref={ref as ForwardedRef<HTMLAnchorElement>}
        className={getClasses(variant, className)}
        {...rest}
      >
        <ActionItemContent icon={icon}>{children}</ActionItemContent>
      </a>
    );
  }

  const { icon, children, variant = 'default', className, ...rest } = props;

  return (
    <button
      ref={ref as ForwardedRef<HTMLButtonElement>}
      type="button"
      className={getClasses(variant, className)}
      {...rest}
    >
      <ActionItemContent icon={icon}>{children}</ActionItemContent>
    </button>
  );
});

ActionItem.displayName = 'ActionItem';

export default ActionItem;
