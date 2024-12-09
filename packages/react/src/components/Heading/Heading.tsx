import { ReactNode, forwardRef } from 'react';

import clsx from 'clsx';

export type HeadingElement = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

export interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  /**
   * Level of Heading
   * `"h1" | "h2" | "h3" | "h4" | "h5" | "h6"`
   */
  level?: HeadingElement;
  /**
   * Apply Bootstrap utility Class
   * `"h1" | "h2" | "h3" | "h4" | "h5" | "h6"`
   */
  headingStyle?: HeadingElement;
  /**
   * Text to render
   */
  children: ReactNode;
  /**
   * Optional class for styling purpose
   */
  className?: string;
}

/**
 * Heading component to display heading elements
 */
const Heading = forwardRef<HTMLHeadingElement, HeadingProps>(
  (
    {
      level: Component = 'h1',
      headingStyle = 'h1',
      children,
      className,
      ...restProps
    }: HeadingProps,
    ref,
  ) => {
    const classes = clsx(headingStyle, className);
    return (
      <Component ref={ref} className={classes} {...restProps}>
        {children}
      </Component>
    );
  },
);

Heading.displayName = 'Heading';

export default Heading;
