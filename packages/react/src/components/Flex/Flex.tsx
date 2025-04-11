import React from 'react';
import clsx from 'clsx';

interface FlexProps extends React.HTMLAttributes<HTMLElement> {
  as?: React.ElementType;
  direction?: 'row' | 'row-reverse' | 'column' | 'column-reverse' | 'fill';
  align?: 'start' | 'end' | 'center' | 'baseline' | 'stretch';
  justify?: 'start' | 'end' | 'center' | 'between' | 'around' | 'evenly';
  gap?: string;
  wrap?: 'wrap' | 'nowrap' | 'reverse';
  className?: string;
}

const Flex: React.FC<FlexProps> = ({
  as: Component = 'div',
  direction,
  align,
  justify,
  gap,
  wrap = 'wrap',
  className,
  children,
  ...restProps
}) => {
  const classes = clsx(
    'd-flex',
    direction && (direction === 'fill' ? 'flex-fill' : `flex-${direction}`),
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
