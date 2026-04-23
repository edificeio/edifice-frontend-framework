import { type ComponentPropsWithoutRef, type ReactNode } from 'react';

import clsx from 'clsx';

export interface PageLayoutBreadcrumbProps extends ComponentPropsWithoutRef<'div'> {
  children: ReactNode;
}

const PageLayoutBreadcrumb = ({
  children,
  className,
  ...props
}: PageLayoutBreadcrumbProps) => {
  return (
    <div className={clsx('pagelayout-breadcrumb', className)} {...props}>
      {children}
    </div>
  );
};

PageLayoutBreadcrumb.displayName = 'PageLayout.Breadcrumb';

export default PageLayoutBreadcrumb;
