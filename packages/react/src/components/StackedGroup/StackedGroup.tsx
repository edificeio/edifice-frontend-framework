import clsx from 'clsx';
import { forwardRef, ReactNode, Ref } from 'react';

export interface StackedGroupProps {
  /**
   * Children to stack
   */
  children: ReactNode[];
  /**
   * Overlap between items (in pixels)
   * @default 20
   */
  overlap?: number;
  /**
   * Controls stacking order. When 'rightFirst', rightmost item has highest z-index
   * @default 'leftFirst'
   */
  stackingOrder?: 'leftFirst' | 'rightFirst';
  /**
   * Additional CSS class
   */
  className?: string;
  /**
   * Whether to wrap items to the next line
   * @default false
   */
  wrap?: boolean;
}

const StackedGroup = forwardRef(
  (
    {
      children,
      overlap = 20,
      className,
      stackingOrder = 'leftFirst',
      wrap = false,
    }: StackedGroupProps,
    ref: Ref<HTMLDivElement>,
  ) => {
    const classes = clsx('stacked-group d-flex align-items-center', className, {
      'flex-wrap': wrap,
    });
    return (
      <div
        ref={ref}
        className={classes}
        style={wrap ? { paddingLeft: `${overlap}px` } : undefined}
      >
        {children.map((child, index) => (
          <div
            key={index}
            style={{
              marginLeft: index === 0 && !wrap ? 0 : `-${overlap}px`,
              zIndex:
                stackingOrder === 'rightFirst'
                  ? children.length - index
                  : index + 1,
            }}
          >
            {child}
          </div>
        ))}
      </div>
    );
  },
);

StackedGroup.displayName = 'StackedGroup';

export default StackedGroup;
