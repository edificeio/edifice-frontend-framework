import { forwardRef, Ref, useRef, useState } from 'react';

import clsx from 'clsx';
import { useTranslation } from 'react-i18next';

import { IconClose } from '../../modules/icons/components';
import { Size } from '../../types';
import { useFormControl } from '../Form/FormContext';

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
   * Control size of input. `sm` and `md` share the same visual size
   * ("Medium" in the design system); only `lg` ("Big") differs.
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
   * @deprecated Validation icons no longer render inside the field —
   * this prop has no effect and will be removed in a future major version.
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
  /**
   * Show a built-in clear (×) button while the field is focused. Opt-in:
   * several consumers render their own clear affordance already (e.g.
   * `SearchBar`), and a broad audit of every `Input` usage hasn't been done
   * yet — see INPUT-MIGRATION-PLAN.md §07.
   */
  clearable?: boolean;
}

/**
 * Input Form Component
 */

const Input = forwardRef(
  (
    {
      placeholder,
      size = 'md',
      type = 'text',
      className,
      showCounter = false,
      autoComplete = 'off',
      clearable = false,
      noValidationIcon: _noValidationIcon,
      ...restProps
    }: InputProps,
    forwardedRef: Ref<HTMLInputElement>,
  ) => {
    const { id, isRequired, isReadOnly, status } = useFormControl();
    const { t } = useTranslation();
    const inputRef = useRef<HTMLInputElement>(null);
    const [currentLength, setCurrentLength] = useState(
      restProps.defaultValue?.toString().length || 0,
    );

    const setRefs = (node: HTMLInputElement | null) => {
      inputRef.current = node;
      if (typeof forwardedRef === 'function') {
        forwardedRef(node);
      } else if (forwardedRef) {
        (
          forwardedRef as React.MutableRefObject<HTMLInputElement | null>
        ).current = node;
      }
    };

    const wrapperClasses = clsx(
      'input',
      {
        'input--lg': size === 'lg',
        'input--invalid': status === 'invalid',
        'input--valid': status === 'valid',
        'input--plaintext': isReadOnly,
      },
      className,
    );

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setCurrentLength(e.target.value.length);
      restProps.onChange?.(e);
    };

    // Programmatically clears the field the same way a user typing would,
    // so it works for both controlled and uncontrolled (e.g.
    // react-hook-form `register()`) usages: setting `.value` directly
    // doesn't fire React's synthetic onChange, so we go through the
    // native setter and dispatch a real "input" event.
    const handleClear = () => {
      const node = inputRef.current;
      if (!node) return;
      const nativeSetter = Object.getOwnPropertyDescriptor(
        window.HTMLInputElement.prototype,
        'value',
      )?.set;
      nativeSetter?.call(node, '');
      node.dispatchEvent(new Event('input', { bubbles: true }));
      node.focus();
    };

    const maxLength = restProps.maxLength ?? 0;

    return (
      <div className={wrapperClasses}>
        <input
          ref={setRefs}
          id={id}
          className="input-field"
          type={type}
          placeholder={placeholder}
          required={isRequired}
          readOnly={isReadOnly}
          {...restProps}
          onChange={handleChange}
          autoComplete={autoComplete}
        />
        {clearable && !isReadOnly && (
          <button
            type="button"
            className="input-clear"
            onClick={handleClear}
            aria-label={t('clear')}
          >
            <IconClose />
          </button>
        )}
        {showCounter && (
          <span
            className={clsx('input-counter', {
              'input-counter--max': currentLength === maxLength,
            })}
          >
            {currentLength} / {maxLength}
          </span>
        )}
      </div>
    );
  },
);

Input.displayName = 'Input';

export default Input;
