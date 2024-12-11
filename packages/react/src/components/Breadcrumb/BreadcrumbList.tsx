import { forwardRef, ReactNode, Ref } from 'react';

import clsx from 'clsx';

export interface BreadcrumbListProps {
  /**
   * Breadcrumb LI
   */
  children: ReactNode;
  /**
   * Optional class for styling purpose
   */
  className?: string;
}

const BreadcrumbList = forwardRef(
  (
    { children, className }: BreadcrumbListProps,
    ref: Ref<HTMLOListElement>,
  ) => {
    const classes = clsx(
      'breadcrumb d-flex flex-nowrap align-items-center mb-0',
      className,
    );
    return (
      <ol ref={ref} className={classes}>
        {children}
      </ol>
    );
  },
);

BreadcrumbList.displayName = 'BreadcrumbList';

export default BreadcrumbList;
