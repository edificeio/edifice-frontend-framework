import React from 'react';
import clsx from 'clsx';

interface FlexProps extends React.HTMLAttributes<HTMLDivElement> {
  direction?: 'row' | 'row-reverse' | 'column' | 'column-reverse';
  align?: 'start' | 'end' | 'center' | 'baseline' | 'stretch';
  justify?: 'start' | 'end' | 'center' | 'between' | 'around' | 'evenly';
  gap?: string; // ex: '2', '3', '5' → correspond aux classes gap-*
  wrap?: boolean;
}

const Flex: React.FC<FlexProps> = ({
  direction,
  align,
  justify,
  gap,
  wrap = false,
  className,
  children,
  ...rest
}) => {
  const classes = clsx(
    'd-flex',
    direction && `flex-${direction}`,
    align && `align-items-${align}`,
    justify && `justify-content-${justify}`,
    gap && `gap-${gap}`,
    wrap && 'flex-wrap',
    className,
  );

  return (
    <div className={classes} {...rest}>
      {children}
    </div>
  );
};

export default Flex;
