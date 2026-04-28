import { forwardRef, ReactNode, Ref } from 'react';

import clsx from 'clsx';

import { Loading } from '../Loading';

export type ButtonBetaRef = HTMLButtonElement;

export type ButtonBetaColor =
  | 'default'
  | 'destructive'
  | 'secondary'
  | 'tertiary';

export type ButtonBetaSize = 'sm' | 'md' | 'lg';

export interface ButtonBetaProps extends React.ComponentPropsWithRef<'button'> {
  type?: 'button' | 'submit' | 'reset';
  color?: ButtonBetaColor;
  /**
   * Taille du bouton. N'a d'effet visuel que sur les thèmes neo et one.
   */
  size?: ButtonBetaSize;
  children?: ReactNode;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  isLoading?: boolean;
  disabled?: boolean;
  className?: string;
}

const ButtonBeta = forwardRef(
  (
    {
      color = 'default',
      type = 'button',
      size = 'md',
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
      `btn-beta-${color}`,
      `btn-beta-${size}`,
      {
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
        {isLoading ? (
          <Loading isLoading />
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

ButtonBeta.displayName = 'ButtonBeta';

export default ButtonBeta;
