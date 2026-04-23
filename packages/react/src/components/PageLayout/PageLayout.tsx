import {
  Children,
  type ComponentPropsWithoutRef,
  isValidElement,
  type ReactNode,
  useMemo,
} from 'react';

import clsx from 'clsx';

import PageLayoutBreadcrumb from './components/PageLayoutBreadcrumb';
import PageLayoutContent from './components/PageLayoutContent';
import PageLayoutHeader from './components/PageLayoutHeader';
import PageLayoutOverlay from './components/PageLayoutOverlay';
import PageLayoutSidebarLeft from './components/PageLayoutSidebarLeft';
import PageLayoutSidebarRight from './components/PageLayoutSidebarRight';
import {
  PageLayoutContext,
  type NoPaddingConfig,
  type PageLayoutScrollMode,
  type PageLayoutVariant,
} from './PageLayoutContext';

export interface PageLayoutProps extends ComponentPropsWithoutRef<'div'> {
  children: ReactNode;
  /** Layout variant: "centered" (default) centers everything in a max-width container,
   * "fullpage" extends sidebars to screen edges with centered content */
  variant?: PageLayoutVariant;
  /** Add a gap between sidebars and content */
  withGap?: boolean;
  /** Scroll mode: "columns" — each column scrolls independently (header not fixed),
   * "page" — normal page scroll with sticky breadcrumb (header not fixed) */
  scrollMode?: PageLayoutScrollMode;
  /** Disable padding on specific columns */
  noPadding?: NoPaddingConfig;
}

/**
 * Detect which compound children are present.
 */
function analyzeChildren(children: ReactNode) {
  let hasLeftSidebar = false;
  let hasRightSidebar = false;
  let breadcrumb: ReactNode = null;
  let overlay: ReactNode = null;
  const headerChildren: ReactNode[] = [];
  const mainChildren: ReactNode[] = [];

  // Children.toArray flattens React fragments so detection works
  // even when sub-components are wrapped in <>...</>
  Children.toArray(children).forEach((child) => {
    if (!isValidElement(child)) return;

    switch (child.type) {
      case PageLayoutHeader:
        headerChildren.push(child);
        break;
      case PageLayoutBreadcrumb:
        breadcrumb = child;
        break;
      case PageLayoutOverlay:
        overlay = child;
        break;
      case PageLayoutSidebarLeft:
        hasLeftSidebar = true;
        mainChildren.push(child);
        break;
      case PageLayoutSidebarRight:
        hasRightSidebar = true;
        mainChildren.push(child);
        break;
      case PageLayoutContent:
        mainChildren.push(child);
        break;
      default:
        mainChildren.push(child);
        break;
    }
  });

  return {
    hasLeftSidebar,
    hasRightSidebar,
    breadcrumb,
    overlay,
    headerChildren,
    mainChildren,
  };
}

const Root = ({
  children,
  variant = 'centered',
  withGap = false,
  scrollMode,
  noPadding,
  className,
  ...props
}: PageLayoutProps) => {
  const contextValue = useMemo(
    () => ({ variant, scrollMode, noPadding }),
    [variant, scrollMode, noPadding],
  );

  const {
    hasLeftSidebar,
    hasRightSidebar,
    breadcrumb,
    overlay,
    headerChildren,
    mainChildren,
  } = analyzeChildren(children);

  const mainAreaClasses = clsx('pagelayout-mainarea', {
    'has-both-sidebars': hasLeftSidebar && hasRightSidebar,
    'has-left-sidebar-only': hasLeftSidebar && !hasRightSidebar,
    'has-right-sidebar-only': !hasLeftSidebar && hasRightSidebar,
    'has-gap': withGap,
  });

  const isFullpage = variant === 'fullpage';

  return (
    <PageLayoutContext.Provider value={contextValue}>
      <div
        className={clsx(
          'pagelayout',
          `pagelayout-${variant}`,
          scrollMode && `pagelayout-scroll-${scrollMode}`,
          className,
        )}
        {...props}
      >
        {headerChildren}
        {headerChildren.length > 0 && (
          <div className="pagelayout-headerspacer" />
        )}

        {/* In centered mode, breadcrumb is outside main-area (full container width) */}
        {!isFullpage && breadcrumb}

        <div className={mainAreaClasses}>
          {/* In fullpage mode, breadcrumb is inside main-area (content column width) */}
          {isFullpage && breadcrumb}
          {mainChildren}
        </div>

        {overlay}
      </div>
    </PageLayoutContext.Provider>
  );
};

Root.displayName = 'PageLayout';

const PageLayout = Object.assign(Root, {
  Header: PageLayoutHeader,
  Breadcrumb: PageLayoutBreadcrumb,
  SidebarLeft: PageLayoutSidebarLeft,
  Content: PageLayoutContent,
  SidebarRight: PageLayoutSidebarRight,
  Overlay: PageLayoutOverlay,
});

export default PageLayout;
