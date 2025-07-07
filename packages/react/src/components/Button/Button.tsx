import { forwardRef, ReactNode, Ref } from 'react';

import clsx from 'clsx';

import { Loading, LoadingIcon, LoadingPosition } from '../Loading';

export type ButtonRef = HTMLButtonElement;

export type ButtonTypes = 'button' | 'submit' | 'reset';
export type ButtonColors =
  | 'primary'
  | 'secondary'
  | 'tertiary'
  | 'danger'
  | 'black';
export type ButtonVariants = 'filled' | 'outline' | 'ghost';
export type ButtonSizes = 'sm' | 'md' | 'lg';

export interface ButtonProps extends React.ComponentPropsWithRef<'button'> {
  /**
   * `button`, `submit` or `reset`
   */
  type?: ButtonTypes;
  /**
   * `primary`, `secondary`, `tertiary` or `danger`
   */
  color?: ButtonColors;
  /**
   * `filled`, `outline` or `ghost`
   */
  variant?: ButtonVariants;
  /**
   * `sm`, `md` or `lg`
   */
  size?: ButtonSizes;
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
   * Override Loading Icon
   */
  loadingIcon?: LoadingIcon;
  /**
   * Loading Icon Position
   * `left`, `right`
   */
  loadingPosition?: LoadingPosition;
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
 * Primary UI component for user interaction
 */

const Button = forwardRef(
  (
    {
      color = 'primary',
      type = 'button',
      size = 'md',
      children,
      isLoading,
      loadingIcon,
      loadingPosition,
      leftIcon,
      rightIcon,
      className,
      variant = 'filled',
      ...restProps
    }: ButtonProps,
    ref: Ref<ButtonRef>,
  ) => {
    const classes = clsx(
      'btn',
      {
        [`btn-filled btn-${color}`]: variant === 'filled',
        [`btn-${variant}-${color}`]:
          variant === 'outline' || variant === 'ghost',
        'btn-icon': !children,
        'btn-loading': isLoading,
        'btn-lg': size === 'lg',
        'btn-sm': size === 'sm',
        'btn-md': size === 'md',
      },
      className,
    );

    return (
      <button
        ref={ref}
        data-testid="button"
        className={classes}
        type={type}
        {...restProps}
      >
        {isLoading ? (
          <Loading
            isLoading
            loadingIcon={loadingIcon}
            loadingPosition={loadingPosition}
          >
            {children}
          </Loading>
        ) : (
          <span>
            {leftIcon}
            {children}
            {rightIcon}
          </span>
        )}
      </button>
    );
  },
);

Button.displayName = 'Button';

export default Button;
