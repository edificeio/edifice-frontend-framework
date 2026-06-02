import { type ComponentPropsWithoutRef, type ReactNode } from 'react';

import clsx from 'clsx';

import Header from '../../../modules/homepage/components/Header/Header';
import { useEdificeTheme } from '../../../providers/EdificeThemeProvider/EdificeThemeProvider.hook';

export interface PageLayoutHeaderProps extends ComponentPropsWithoutRef<'header'> {
  children?: ReactNode;
  onNotificationsClick?: () => void;
}

const PageLayoutHeader = ({
  children,
  className,
  onNotificationsClick,
  ...props
}: PageLayoutHeaderProps) => {
  const { theme } = useEdificeTheme();

  return (
    <header className={clsx('pagelayout-header', className)} {...props}>
      {children ?? (
        <Header
          src={theme?.basePath}
          onNotificationsClick={onNotificationsClick}
        />
      )}
    </header>
  );
};

PageLayoutHeader.displayName = 'PageLayout.Header';

export default PageLayoutHeader;
