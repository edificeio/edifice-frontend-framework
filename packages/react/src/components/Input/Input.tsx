import { forwardRef, Ref, useState } from 'react';

import clsx from 'clsx';

import { Size } from '../../types';
import { useFormControl } from '../Form/FormContext';
import Textcounter from '../TextCounter/TextCounter';

export type OmitInputProps =
  | 'disabled'
  | 'required'
  | 'size'
  | 'id'
  | 'readOnly';

export interface InputProps extends Omit<
  React.ComponentPropsWithRef<'input'>,
  OmitInputProps
> {
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
  /**
   * Show count of characters
   */
  showCounter?: boolean;
  /**
   * Browser autocomplete feature
   */
  autoComplete?: string;
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
      showCounter = false,
      autoComplete = 'off',
      ...restProps
    }: InputProps,
    ref: Ref<HTMLInputElement>,
  ) => {
    const { id, isRequired, isReadOnly, status } = useFormControl();
    const [currentLength, setCurrentLength] = useState(
      restProps.defaultValue?.toString().length || 0,
    );

    const classes = clsx(
      {
        'form-control': !isReadOnly,
        'form-control-lg': size === 'lg',
        'form-control-sm': size === 'sm',
        'is-invalid': status === 'invalid',
        'is-valid': status === 'valid',
        'form-control-plaintext': isReadOnly,
        'no-validation-icon': noValidationIcon,
        'pe-64': showCounter && !status,
      },
      className,
    );

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setCurrentLength(e.target.value.length);
      restProps.onChange?.(e);
    };

    return (
      <>
        <input
          ref={ref}
          id={id}
          className={classes}
          type={type}
          placeholder={placeholder}
          required={isRequired}
          readOnly={isReadOnly}
          {...restProps}
          onChange={handleChange}
          autoComplete={autoComplete}
        />
        {showCounter && !status && (
          <Textcounter
            currentLength={currentLength}
            maxLength={restProps.maxLength ?? 0}
          />
        )}
      </>
    );
  },
);

Input.displayName = 'Input';

export default Input;
