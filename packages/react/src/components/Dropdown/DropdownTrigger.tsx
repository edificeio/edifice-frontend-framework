import { Ref, forwardRef } from 'react';

import clsx from 'clsx';

import { IconRafterUp } from '../../modules/icons/components';
import { useDropdownContext } from './DropdownContext';

export interface DropdownTriggerProps
  extends React.ComponentPropsWithRef<'button'> {
  /**
   * Dropdown trigger title
   */
  label?: string;
  /**
   * Add an icon in dropdown trigger
   */
  icon?: React.ReactNode;
  /**
   * Add a badge
   */
  badgeContent?: string | number;
  /**
   * Set appearance
   */
  variant?: 'default' |'ghost' | 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info';
  /**
   * Button size
   */
  size?: 'sm' | 'md' | 'lg';
  /**
   * Disabled Trigger
   * */
  disabled?: boolean;
  /**
   * Stretch the dropdown trigger.
   */
  block?: boolean;
  /**
   * Hide the carret
   */
  hideCarret?: boolean;
  /**
   * Make the dropdown trigger a pill
   */
  pill?: boolean;
  /**
   * Border width
   */
  borderWidth?: number;
}

export type DropdownTriggerType = React.ReactElement<DropdownTriggerProps>;

const DropdownTrigger = forwardRef(
  (
    {
      label,
      icon,
      variant = 'default',
      disabled = false,
      size,
      badgeContent,
      hideCarret = false,
      pill = false,
      borderWidth,
      ...restProps
    }: DropdownTriggerProps,
    forwardRef: Ref<HTMLButtonElement>,
  ) => {
    const { triggerProps, block } = useDropdownContext();

    const className = clsx(
      'dropdown-toggle ',
      size,
      variant,
      { 'w-100': block },
      triggerProps.className,
      restProps.className,
      { 'rounded-pill': pill },
    );

    const style = { 
      borderWidth: borderWidth ? `${borderWidth}px` : undefined,
    };

    const mergedProps = {
      ...triggerProps,
      ...restProps,
      className,
      style,
    };

    return (
      <button
        ref={forwardRef}
        type="button"
        disabled={disabled}
        {...mergedProps}
      >
        {icon}
        {label}
        {badgeContent ? (
          <span className="badge text-bg-secondary rounded-pill">
            {badgeContent}
          </span>
        ) : (
          !hideCarret && (
            <IconRafterUp
              width={16}
              height={16}
              className="dropdown-toggle-caret"
            />
          )
        )}
      </button>
    );
  },
);

DropdownTrigger.displayName = 'Dropdown.Trigger';

export default DropdownTrigger;
