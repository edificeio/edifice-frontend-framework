import { forwardRef, ReactNode, Ref } from 'react';

import clsx from 'clsx';

export interface BreadcrumbItemProps extends React.ComponentPropsWithRef<'li'> {
  /**
   * Link or text to display
   */
  children: ReactNode;
  /**
   * Optional class for styling purpose
   */
  className?: string;
}

const BreadcrumbItem = forwardRef(
  (
    { children, className, ...restProps }: BreadcrumbItemProps,
    forwardRef: Ref<HTMLLIElement>,
  ) => {
    const classes = clsx('breadcrumb-item', className);

    return (
      <li ref={forwardRef} className={classes} {...restProps}>
        {children}
      </li>
    );
  },
);

BreadcrumbItem.displayName = 'BreadcrumbItem';

export default BreadcrumbItem;
