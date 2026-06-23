import { type ComponentPropsWithoutRef, type ReactNode } from 'react';

import clsx from 'clsx';

import { usePageLayout } from '../PageLayoutContext';

export interface PageLayoutSidebarLeftProps extends ComponentPropsWithoutRef<'aside'> {
  children: ReactNode;
}

const PageLayoutSidebarLeft = ({
  children,
  className,
  ...props
}: PageLayoutSidebarLeftProps) => {
  const { noPadding } = usePageLayout();

  return (
    <aside
      className={clsx(
        'pagelayout-sidebarleft',
        { 'pagelayout-sidebarleft--no-padding': noPadding?.sidebarLeft },
        className,
      )}
      {...props}
    >
      {children}
    </aside>
  );
};

PageLayoutSidebarLeft.displayName = 'PageLayout.SidebarLeft';

export default PageLayoutSidebarLeft;
