import { type ComponentPropsWithoutRef, type ReactNode } from 'react';

import clsx from 'clsx';

import { usePageLayout } from '../PageLayoutContext';

export interface PageLayoutSidebarRightProps extends ComponentPropsWithoutRef<'aside'> {
  children: ReactNode;
}

const PageLayoutSidebarRight = ({
  children,
  className,
  ...props
}: PageLayoutSidebarRightProps) => {
  const { noPadding } = usePageLayout();

  return (
    <aside
      className={clsx(
        'pagelayout-sidebarright',
        { 'pagelayout-sidebarright--no-padding': noPadding?.sidebarRight },
        className,
      )}
      {...props}
    >
      <div className="pagelayout-sidebarright-inner">{children}</div>
    </aside>
  );
};

PageLayoutSidebarRight.displayName = 'PageLayout.SidebarRight';

export default PageLayoutSidebarRight;
