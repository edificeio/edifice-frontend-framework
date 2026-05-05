import { Ref, forwardRef } from 'react';

import clsx from 'clsx';

import { Color } from 'src/types';
import { IconRafterUp } from '../../modules/icons/components';
import { Badge } from '../Badge';
import { useDropdownContext } from './DropdownContext';

export interface DropdownTriggerProps extends React.ComponentPropsWithRef<'button'> {
  /**
   * Dropdown trigger title
   */
  label?: React.ReactNode;
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
  variant?:
    | 'default'
    | 'ghost'
    | 'primary'
    | 'secondary'
    | 'success'
    | 'danger'
    | 'warning'
    | 'info';
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
   * Inner border color
   */
  innerBorderColor?: Color;
  /**
   * Inner border width in pixels
   */
  innerBorderWidth?: number;

  /**
   * Outer border color
   */
  outerBorderColor?: Color;

  /**
   * Outer border width in pixels
   */
  outerBorderWidth?: number;

  /**
   * Outer border offset in pixels
   */
  outerBorderOffset?: number;
  /**
   * Use base shade color
   */
  baseShade?: boolean;
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
      innerBorderColor,
      innerBorderWidth,
      outerBorderColor,
      outerBorderWidth,
      outerBorderOffset,
      baseShade,
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
      { 'base-shade': baseShade },
    );

    const style = {
      ...(outerBorderColor && {
        outline: `${outerBorderWidth}px solid var(--edifice-${outerBorderColor})`,
        outlineOffset: outerBorderOffset,
      }),
      ...(innerBorderColor && {
        border: `${innerBorderWidth}px solid var(--edifice-${innerBorderColor})`,
      }),
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
