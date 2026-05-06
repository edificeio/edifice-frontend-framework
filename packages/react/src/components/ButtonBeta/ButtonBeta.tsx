import { forwardRef, ReactNode, Ref } from 'react';

import clsx from 'clsx';

import { Loading } from '../Loading';

export type ButtonBetaRef = HTMLButtonElement;

export type ButtonBetaColor =
  | 'default'
  | 'destructive'
  | 'danger' // alias for destructive
  | 'secondary'
  | 'tertiary';

export type ButtonBetaVariant = 'filled' | 'outline' | 'ghost';

export interface ButtonBetaProps extends React.ComponentPropsWithRef<'button'> {
  /**
   * `button`, `submit` or `reset`
   */
  type?: 'button' | 'submit' | 'reset';
  /**
   * `default`, `destructive`, `danger`, `secondary` or `tertiary`
   */
  color?: ButtonBetaColor;
  /**
   * `filled`, `outline` or `ghost`
   */
  variant?: ButtonBetaVariant;
  /**
   * Does it has a text ?
   */
  children?: ReactNode;
  /**
   * Display Icon Component to the left
   */
  leftIcon?: ReactNode;
  /**
   * Display Icon Component to the right
   */
  rightIcon?: ReactNode;
  /**
   * Is it loading ?
   */
  isLoading?: boolean;
  /**
   * Disabled status
   */
  disabled?: boolean;
  /**
   * Optional class for styling purpose
   */
  className?: string;
}

/**
 * Primary UI component for user interaction (edifice2d design system)
 */
const ButtonBeta = forwardRef(
  (
    {
      color = 'default',
      type = 'button',
      variant = 'filled',
      children,
      isLoading,
      leftIcon,
      rightIcon,
      className,
      ...restProps
    }: ButtonBetaProps,
    ref: Ref<ButtonBetaRef>,
  ) => {
    const hasIcon = Boolean(leftIcon || rightIcon);

    const classes = clsx(
      'btn-beta',
      color === 'danger' ? 'btn-beta-destructive' : `btn-beta-${color}`, // FIXME: remove 'danger' alias  when kill one and neo themes
      {
        'btn-beta--outline': variant === 'outline',
        'btn-beta--ghost': variant === 'ghost',
        'btn-beta--icon-only': !children,
        'btn-beta--with-icon': hasIcon && Boolean(children),
        'btn-beta--loading': isLoading,
      },
      className,
    );

    return (
      <button
        ref={ref}
        data-testid="button-beta"
        className={classes}
        type={type}
        {...restProps}
      >
        {isLoading && <Loading isLoading />}
        <span>
          {leftIcon}
          {children}
          {rightIcon}
        </span>
      </button>
    );
  },
);

ButtonBeta.displayName = 'ButtonBeta';

export default ButtonBeta;
