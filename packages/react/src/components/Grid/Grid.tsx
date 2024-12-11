import { ReactNode } from 'react';

import clsx from 'clsx';

export interface GridProps {
  /**
   * Content inside the Grid component. Usually GridCol components
   */
  children: ReactNode;
  /**
   * Optional class for styling purpose
   */
  className?: string;
}

export interface GridColProps extends React.ComponentPropsWithoutRef<'div'> {
  /**
   * Size on Mobile
   */
  sm: string;
  /**
   * Size on Tablet
   */
  md?: string;
  /**
   * Size on Small Desktop
   */
  lg?: string;
  /**
   * Size on Large Desktop
   */
  xl?: string;
  /**
   * Accept content as children
   */
  children: ReactNode;
  /**
   * Optional class for styling purpose
   */
  className?: string;
  /**
   * As Prop
   */
  as?: React.ElementType;
}

/**
 * Grid of 12 columns on Desktop, 8 on Tablet and 4 on Mobile
 */

export const Grid = ({ children, className, ...restProps }: GridProps) => {
  const classes = clsx('grid', className);
  return (
    <div className={classes} {...restProps}>
      {children}
    </div>
  );
};

export const Column = ({
  sm,
  md,
  lg,
  xl,
  children,
  className,
  as,
  ...restProps
}: GridColProps) => {
  const Component = as || 'div';
  const classes = clsx(
    {
      [`g-col-${sm}`]: sm,
      [md ? `g-col-md-${md}` : '']: md,
      [lg ? `g-col-lg-${lg}` : '']: lg,
      [xl ? `g-col-xl-${xl}` : '']: xl,
    },
    className,
  );
  return (
    <Component className={classes} {...restProps}>
      {children}
    </Component>
  );
};

Grid.displayName = 'Grid';
Column.displayName = 'Grid.Col';

Grid.Col = Column;
