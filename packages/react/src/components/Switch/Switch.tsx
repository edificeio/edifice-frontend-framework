import { forwardRef, InputHTMLAttributes } from 'react';
import clsx from 'clsx';

export type SwitchLabelPosition = 'left' | 'right';

export interface SwitchProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'size'
> {
  /**
   * The label of the switch
   */
  label?: string;
  /**
   * Side on which the label is displayed, relative to the toggle
   */
  labelPosition?: SwitchLabelPosition;
  /**
   * The value of the switch
   */
  value?: string;
  /**
   * Define if switch is disabled
   */
  disabled?: boolean;
  /**
   * Additional class name for the label
   */
  labelClassName?: string;
  /**
   * @deprecated The switch now comes in a single size, as defined by the
   * design system — this prop has no effect and will be removed in a future
   * major version.
   */
  size?: 'sm' | 'md';
  /**
   * @deprecated The switch now always uses the theme's primary color, as
   * defined by the design system — this prop has no effect and will be
   * removed in a future major version.
   */
  variant?:
    | 'default'
    | 'ghost'
    | 'primary'
    | 'secondary'
    | 'success'
    | 'danger'
    | 'warning'
    | 'info';
}

/**
 * A checkbox presented as an on/off toggle.
 * Every visual state (checked, pressed, focused, disabled) is driven by the
 * native input, so the switch works both as a controlled and an uncontrolled
 * input (e.g. with react-hook-form's `register()`).
 */
const Switch = forwardRef<HTMLInputElement, SwitchProps>(
  (
    {
      className,
      label,
      labelPosition = 'right',
      value,
      disabled,
      labelClassName,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      size,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      variant,
      ...restProps
    },
    ref,
  ) => {
    const switchClass = clsx(
      'switch',
      { 'switch--label-left': labelPosition === 'left' },
      className,
    );

    return (
      <label className={switchClass}>
        <input
          type="checkbox"
          ref={ref}
          className="switch__input"
          value={value}
          disabled={disabled}
          {...restProps}
        />
        <span className="switch__track" aria-hidden="true">
          <span className="switch__thumb" />
        </span>
        {label && (
          <span className={clsx('switch__label', labelClassName)}>{label}</span>
        )}
      </label>
    );
  },
);

Switch.displayName = 'Switch';

export default Switch;
