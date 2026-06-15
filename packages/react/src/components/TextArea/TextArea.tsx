import { forwardRef, Ref, useState } from 'react';

import clsx from 'clsx';

import { Size } from '../../types';
import { useFormControl } from '../Form/FormContext';
import Textcounter from '../TextCounter/TextCounter';

export type OmitTextAreaProps =
  | 'disabled'
  | 'required'
  | 'size'
  | 'id'
  | 'readOnly';

export interface TextAreaProps extends Omit<
  React.ComponentPropsWithRef<'textarea'>,
  OmitTextAreaProps
> {
  /**
   * Control size of TextArea
   */
  size: Size;
  /**
   * Control maxHeight of TextArea
   */
  height?: Size;
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
}

/**
 * TextArea Form Component
 */

const TextArea = forwardRef(
  (
    {
      noValidationIcon,
      placeholder,
      size = 'md',
      height = 'md',
      className,
      showCounter = false,
      ...restProps
    }: TextAreaProps,
    ref: Ref<HTMLTextAreaElement>,
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
        'textarea-height-lg': height === 'lg',
        'textarea-height-md': height === 'md',
        'textarea-height-sm': height === 'sm',
        'is-invalid': status === 'invalid',
        'is-valid': status === 'valid',
        'form-control-plaintext': isReadOnly,
        'no-validation-icon': noValidationIcon,
      },
      className,
    );

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setCurrentLength(e.target.value.length);
      restProps.onChange?.(e);
    };

    return (
      <>
        <textarea
          ref={ref}
          id={id}
          className={classes}
          placeholder={placeholder}
          required={isRequired}
          readOnly={isReadOnly}
          {...restProps}
          onChange={handleChange}
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

TextArea.displayName = 'TextArea';

export default TextArea;
