import clsx from 'clsx';

export interface WidgetToggleProps {
  'checked': boolean;
  'onChange': () => void;
  'aria-label': string;
  'disabled'?: boolean;
}

/**
 * Dedicated on/off control for a widget row in `WidgetsPersonalizationPanel`.
 * The generic `Switch` component doesn't match this panel's design (size,
 * filled-vs-outlined states), so this is a small purpose-built control
 * rather than a `Switch` variant.
 */
export function WidgetToggle({
  checked,
  onChange,
  disabled,
  ...rest
}: WidgetToggleProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      className={clsx('widget-toggle', {
        'widget-toggle--checked': checked,
      })}
      onClick={onChange}
      {...rest}
    >
      <span className="widget-toggle__knob" />
    </button>
  );
}

WidgetToggle.displayName = 'WidgetToggle';
