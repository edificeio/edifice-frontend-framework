import { forwardRef, ReactNode, Ref } from 'react';

import { IWebApp } from '@edifice.io/client';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';
import { useEdificeIcons } from '../../hooks/useEdificeIcons';

export interface BreadcrumbNavProps extends React.ComponentPropsWithRef<'nav'> {
  /**
   * Pass all data about current application
   */
  app: IWebApp;
  /**
   * Children
   */
  children: ReactNode;
  /**
   * Optional class for styling purpose
   */
  className?: string;
}

const BreadcrumbNav = forwardRef(
  ({ children, app, className }: BreadcrumbNavProps, ref: Ref<HTMLElement>) => {
    const { t } = useTranslation();
    const { getIconClass } = useEdificeIcons();

    const classes = clsx(
      'd-flex align-items-center mb-0',
      getIconClass(app),
      className,
    );

    const style = {
      '--edifice-breadcrumb-divider': '-',
    } as React.CSSProperties;

    return (
      <nav
        ref={ref}
        className={classes}
        aria-label={t('breadcrumb')}
        style={style}
      >
        {children}
      </nav>
    );
  },
);

BreadcrumbNav.displayName = 'BreadcrumbNav';

export default BreadcrumbNav;
