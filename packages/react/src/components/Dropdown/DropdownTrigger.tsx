import { Ref, forwardRef } from 'react';

import clsx from 'clsx';

import { IconRafterUp } from '../../modules/icons/components';
import { useDropdownContext } from './DropdownContext';
import { Badge } from '../Badge';

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
  variant?: 'ghost';
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
}

export type DropdownTriggerType = React.ReactElement<DropdownTriggerProps>;

const DropdownTrigger = forwardRef(
  (
    {
      label,
      icon,
      variant,
      disabled = false,
      size,
      badgeContent,
      hideCarret = false,
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
    );

    const mergedProps = {
      ...triggerProps,
      ...restProps,
      className,
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
          <Badge
            variant={{
              level: 'info',
              type: 'notification',
            }}
          >
            {badgeContent}
          </Badge>
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
