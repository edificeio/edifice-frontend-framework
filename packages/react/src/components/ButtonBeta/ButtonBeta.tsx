import { forwardRef, ReactNode, Ref } from 'react';

import clsx from 'clsx';

import { Loading } from '../Loading';

export type ButtonBetaRef = HTMLButtonElement;

export type ButtonBetaColor =
  | 'default'
  | 'destructive'
  | 'secondary'
  | 'tertiary';

export type ButtonBetaSizes = 'sm' | 'md';

export type ButtonBetaVariant = 'filled' | 'outline' | 'ghost';

export interface ButtonBetaProps extends React.ComponentPropsWithRef<'button'> {
  /**
   * `button`, `submit` or `reset`
   */
  type?: 'button' | 'submit' | 'reset';
  /**
   * `default`, `destructive`, `secondary` or `tertiary`
   */
  color?: ButtonBetaColor;
  /**
   * `filled`, `outline` or `ghost`
   */
  variant?: ButtonBetaVariant;
  /**
   * `small` or `medium`
   */
  size?: ButtonBetaSizes;
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
      size = 'md',
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
    const classes = clsx(
      'btn-beta',
      `btn-beta-${color}`,
      {
        'btn-beta--outline': variant === 'outline',
        'btn-beta--ghost': variant === 'ghost',
        'btn-beta--small': size === 'sm',
        'btn-beta--icon-only': !children,
        'btn-beta--with-left-icon': Boolean(leftIcon && children),
        'btn-beta--with-right-icon': Boolean(rightIcon && children),
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
