import { forwardRef, Ref, ReactNode } from 'react';
import clsx from 'clsx';

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
}

const StackedGroup = forwardRef(
  (
    {
      children,
      overlap = 20,
      className,
      stackingOrder = 'leftFirst',
    }: StackedGroupProps,
    ref: Ref<HTMLDivElement>,
  ) => {
    const classes = clsx('stacked-group', className);
    return (
      <div
        ref={ref}
        className={classes}
        style={{ display: 'flex', alignItems: 'center' }}
      >
        {children.map((child, index) => (
          <div
            key={index}
            style={{
              marginLeft: index === 0 ? 0 : `-${overlap}px`,
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
