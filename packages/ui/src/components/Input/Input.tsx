import { forwardRef, Ref } from 'react';

import clsx from 'clsx';

import { Size } from '../../types';
import { useFormControl } from '../Form/FormContext';

export type OmitInputProps =
  | 'disabled'
  | 'required'
  | 'size'
  | 'id'
  | 'readOnly';

export interface InputProps
  extends Omit<React.ComponentPropsWithRef<'input'>, OmitInputProps> {
  /**
   * Control size of input
   */
  size: Size;
  /**
   * Type of input (text, password, ..)
   */
  type: string;
  /**
   * Change text of placeholder
   */
  placeholder?: string;
  /**
   * Disabled status
   */
  disabled?: boolean;
  /**
   * Remove validation icon
   */
  noValidationIcon?: boolean;
  /**
   * Optional class for styling purpose
   */
  className?: string;
}

/**
 * Input Form Component
 */

const Input = forwardRef(
  (
    {
      noValidationIcon,
      placeholder,
      size = 'md',
      type = 'text',
      className,
      ...restProps
    }: InputProps,
    ref: Ref<HTMLInputElement>,
  ) => {
    const { id, isRequired, isReadOnly, status } = useFormControl();

    const classes = clsx(
      {
        'form-control': !isReadOnly,
        'form-control-lg': size === 'lg',
        'form-control-sm': size === 'sm',
        'is-invalid': status === 'invalid',
        'is-valid': status === 'valid',
        'form-control-plaintext': isReadOnly,
        'no-validation-icon': noValidationIcon,
      },
      className,
    );

    return (
      <input
        ref={ref}
        id={id}
        className={classes}
        type={type}
        placeholder={placeholder}
        required={isRequired}
        readOnly={isReadOnly}
        {...restProps}
      />
    );
  },
);

Input.displayName = 'Input';

export default Input;
