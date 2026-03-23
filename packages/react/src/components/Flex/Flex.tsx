import clsx from 'clsx';
import React, { forwardRef } from 'react';

interface FlexProps extends React.HTMLAttributes<HTMLElement> {
  as?: React.ElementType;
  direction?: 'row' | 'row-reverse' | 'column' | 'column-reverse' | 'fill';
  align?: 'start' | 'end' | 'center' | 'baseline' | 'stretch';
  justify?: 'start' | 'end' | 'center' | 'between' | 'around' | 'evenly';
  gap?: string;
  fill?: boolean; // If true, applies 'flex-fill' class
  wrap?: 'wrap' | 'nowrap' | 'reverse';
  className?: string;
}

const Flex = forwardRef<HTMLElement, FlexProps>(
  (
    {
      as: Component = 'div',
      direction,
      align,
      justify,
      gap,
      fill,
      wrap,
      className,
      children,
      ...restProps
    },
    ref,
  ) => {
    const classes = clsx(
      'd-flex',
      direction && `flex-${direction}`,
      fill && 'flex-fill',
      align && `align-items-${align}`,
      justify && `justify-content-${justify}`,
      gap && `gap-${gap}`,
      wrap && `flex-${wrap === 'reverse' ? 'wrap-reverse' : wrap}`,
      className,
    );

    // Polymorphic component: ElementType resolves props to `never` in JSX.
    // External API is typed via FlexProps, so the internal cast is safe.
    const Element = Component as React.ElementType;

    return (
      <Element
        ref={ref as React.Ref<unknown>}
        className={classes}
        {...restProps}
      >
        {children}
      </Element>
    );
  },
);

export default Flex;
