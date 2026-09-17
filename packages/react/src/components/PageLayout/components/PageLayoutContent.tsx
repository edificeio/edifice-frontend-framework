import { type ComponentPropsWithoutRef, type ReactNode } from 'react';

import clsx from 'clsx';

import { useBackground } from 'src/hooks';
import { usePageLayout } from '../PageLayoutContext';

export interface PageLayoutContentProps extends ComponentPropsWithoutRef<'main'> {
  children: ReactNode;
}

const PageLayoutContent = ({
  children,
  className,
  ...props
}: PageLayoutContentProps) => {
  const { productOverride, background } = useBackground();
  const { noPadding } = usePageLayout();

  return (
    <main
      data-product={productOverride}
      data-background={background}
      className={clsx(
        'pagelayout-content',
        { 'pagelayout-content--no-padding': noPadding?.content },
        className,
      )}
      {...props}
    >
      {children}
    </main>
  );
};

PageLayoutContent.displayName = 'PageLayout.Content';

export default PageLayoutContent;
