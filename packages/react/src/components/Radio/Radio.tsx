import { ChangeEvent, forwardRef, ReactNode, Ref, useId } from 'react';

import clsx from 'clsx';

export interface RadioProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /**
   * State controlling activated radio group
   */
  model: string | boolean | number;
  /**
   * Use onChange event Handler to set new value of model
   */
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  /**
   * If checked
   */
  checked?: boolean;
  /**
   * Label of the radio checkbox
   */
  label?: string | false;
  /**
   * Replace with an icon
   */
  icon?: ReactNode;
}

const Radio = forwardRef(
  (
    {
      model,
      icon,
      label = false,
      disabled = false,
      checked,
      ...restProps
    }: RadioProps,
    ref: Ref<HTMLInputElement>,
  ) => {
    const id = useId();

    const radioProps = {
      type: 'radio',
      checked,
      disabled,
      ref,
      className: clsx(
        restProps.className,
        'form-check-input c-pointer',
        icon && 'd-none',
      ),
      id,
    };

    const inputProps = {
      ...restProps,
      ...radioProps,
    };

    return (
      <div
        className={clsx(
          'form-check d-flex align-items-center gap-8',
          icon && 'ps-0',
        )}
      >
        <input {...inputProps} />
        {icon && (
          <label
            htmlFor={inputProps.id}
            className={clsx(
              'c-pointer',
              model !== restProps.value && 'text-muted',
            )}
          >
            {icon}
          </label>
        )}
        {!icon && label && (
          <label className="form-check-label" htmlFor={inputProps.id}>
            {label}
          </label>
        )}
      </div>
    );
  },
);

Radio.displayName = 'Radio';

export default Radio;
