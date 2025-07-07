import clsx from 'clsx';
import React from 'react';

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

const Flex: React.FC<FlexProps> = ({
  as: Component = 'div',
  direction,
  align,
  justify,
  gap,
  fill,
  wrap = 'wrap',
  className,
  children,
  ...restProps
}) => {
  const classes = clsx(
    'd-flex',
    direction && `flex-${direction}`,
    fill && 'flex-fill',
    align && `align-items-${align}`,
    justify && `justify-content-${justify}`,
    gap && `gap-${gap}`,
    wrap && `flex-${wrap}`,
    className,
  );

  return (
    <Component className={classes} {...restProps}>
      {children}
    </Component>
  );
};

export default Flex;
