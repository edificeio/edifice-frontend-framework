import { ComponentPropsWithoutRef } from 'react';

import clsx from 'clsx';

export type HomeCardContentProps = ComponentPropsWithoutRef<'div'>;

const HomeCardContent = ({
  children,
  className,
  ...rest
}: HomeCardContentProps) => {
  return (
    <div className={clsx('home-card-content', className)} {...rest}>
      {children}
    </div>
  );
};

HomeCardContent.displayName = 'HomeCard.Content';

export default HomeCardContent;
