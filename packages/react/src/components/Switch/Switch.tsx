import { forwardRef, InputHTMLAttributes } from 'react';
import clsx from 'clsx';

export interface SwitchProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  /**
   * The label of the switch
   */
  label?: string;
  /**
   * The value of the switch
   */
  value?: string;
  /**
   * Define if switch is disabled
   */
  disabled?: boolean;
  /**
   * Define switch size
   */
  size?: 'sm' | 'md';
  /**
   * Additional class name for the label
   */
  labelClassName?: string;
}

const Switch = forwardRef<HTMLInputElement, SwitchProps>(
  (
    {
      className,
      label,
      value,
      disabled,
      size = 'md',
      labelClassName,
      ...restProps
    },
    ref,
  ) => {
    const switchClass = clsx(
      'switch',
      {
        [`switch-${size}`]: size,
        'switch-disabled': disabled,
      },
      className,
    );

    const labelClass = clsx('switch-label', labelClassName);

    return (
      <label className={switchClass}>
        <input
          type="checkbox"
          ref={ref}
          value={value}
          disabled={disabled}
          {...restProps}
        />
        <span className="slider"></span>
        {label && <span className={labelClass}>{label}</span>}
      </label>
    );
  },
);

Switch.displayName = 'Switch';

export default Switch;
