import { ReactNode, forwardRef } from 'react';

import { animated, useTransition } from '@react-spring/web';
import clsx from 'clsx';

export interface PopoverProps {
  /**
   * Popover id for a11y
   */
  id?: string;
  /**
   * When Popover is visible
   */
  isVisible?: boolean;
  /**
   * Horizontal alignment relative to the trigger.
   * `center` (default) centers the popover under the trigger.
   * `end` aligns the popover's right edge with the trigger's right edge,
   * which prevents overflow when the trigger sits near the viewport's right edge.
   */
  align?: 'center' | 'end';
  /**
   * React Node
   */
  children: ReactNode;
  /**
   * Optional class for styling purpose
   */
  className?: string;
}

export interface PopoverElementProps {
  /**
   * React Node
   */
  children: ReactNode;
  /**
   * Optional class for styling purpose
   */
  className?: string;
}

export const PopoverHeader = ({ children, className }: PopoverProps) => {
  const classes = clsx('popover-header', className);
  return <div className={classes}>{children}</div>;
};

export const PopoverBody = ({ children, className }: PopoverProps) => {
  const classes = clsx('popover-body', className);
  return <div className={classes}>{children}</div>;
};

export const PopoverFooter = ({ children, className }: PopoverProps) => {
  const classes = clsx('popover-footer p-8', className);
  return <div className={classes}>{children}</div>;
};

export const Popover = forwardRef<HTMLDivElement, PopoverProps>(
  (
    { align = 'center', children, className, id, isVisible, ...restProps },
    ref,
  ) => {
    const classes = clsx(
      'popover d-block position-absolute top-100',
      align === 'end'
        ? 'end-0 popover-align-end'
        : 'start-50 translate-middle-x',
      className,
    );

    const transition = useTransition(isVisible, {
      from: { opacity: 0 },
      enter: { opacity: 1 },
      leave: { opacity: 0 },
      config: { duration: 0 },
    });

    return transition(
      (style, isVisible) =>
        isVisible && (
          <animated.div
            ref={ref}
            aria-labelledby={id}
            className={classes}
            role="tooltip"
            style={style}
            {...restProps}
          >
            {children}
          </animated.div>
        ),
    );
  },
);

Popover.displayName = 'Popover';
