import { forwardRef, ReactNode, Ref } from 'react';

import clsx from 'clsx';

import Button, { ButtonProps, ButtonRef } from './Button';

type OmittedProps = 'children' | 'leftIcon' | 'rightIcon';

export interface IconButtonProps extends Omit<ButtonProps, OmittedProps> {
  icon?: ReactNode;
}

/**
 * IconButton extends ButtonComponent.
 */

const IconButton = forwardRef(
  (
    { icon, className, ...restProps }: IconButtonProps,
    ref?: Ref<ButtonRef>,
  ) => {
    const buttonProps = {
      ...restProps,
      ...{
        className: clsx('btn-icon', className),
      },
      size: restProps.size || 'sm',
    };

    return <Button ref={ref} {...buttonProps} leftIcon={icon} />;
  },
);

IconButton.displayName = 'IconButton';

export default IconButton;
