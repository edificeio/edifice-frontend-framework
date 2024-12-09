import { ComponentPropsWithRef, forwardRef, ReactNode, Ref } from 'react';

import clsx from 'clsx';

export interface AppHeaderProps extends ComponentPropsWithRef<'div'> {
  /**
   * Accept Breadcrumb Component
   */
  children: ReactNode;
  /**
   * Actions
   */
  render?: () => JSX.Element | null;
  /**
   * When no layout is used
   */
  isFullscreen?: boolean;
}

const AppHeader = forwardRef(
  (
    { children, render, isFullscreen = false, ...restProps }: AppHeaderProps,
    ref: Ref<HTMLDivElement>,
  ) => {
    const classes = clsx('d-flex flex-wrap p-16 gap-8 border-bottom bg-white', {
      'justify-content-between': render,
      'mx-n16': !isFullscreen,
      'z-3 top-0 start-0 end-0': isFullscreen,
    });

    return (
      <div ref={ref} className={classes} {...restProps}>
        {children}
        {render ? (
          <div className="d-flex align-items-center ms-auto gap-8">
            {render()}
          </div>
        ) : null}
      </div>
    );
  },
);

AppHeader.displayName = 'AppHeader';

export default AppHeader;
