import { ComponentPropsWithoutRef, ReactNode } from 'react';

import clsx from 'clsx';

import HomeCardContent from './HomeCardContent';
import HomeCardHeader, { HomeCardHeaderProps } from './HomeCardHeader';

export type HomeCardVariant = 'user' | 'primary' | 'secondary';

export interface HomeCardProps extends ComponentPropsWithoutRef<'div'> {
  /**
   * Visual variant of the card.
   * - `user` (default): padding 16, gap 16
   * - `primary`: padding 8/16/16/16, gap 8
   * - `secondary`: padding 8/16/16/16, gap 4, grey background, smaller title, no shadowbox
   */
  variant?: HomeCardVariant;
  /**
   * Children of the card. When omitted, a default `HomeCardHeader` will be
   * rendered using the `headerProps` prop (handy for the common case where the
   * card only needs a header + content slot).
   */
  children?: ReactNode;
  /**
   * Convenience prop: when provided and `children` is empty, a default
   * `HomeCard.Header` is rendered with these props.
   */
  headerProps?: HomeCardHeaderProps;
}

/**
 * HomeCard – Compound component used on the homepage.
 *
 * @example
 * <HomeCard variant="primary">
 *   <HomeCard.Header title="My title" actionLabel="See all" onActionClick={() => {}} />
 *   <HomeCard.Content>...</HomeCard.Content>
 * </HomeCard>
 */
const Root = ({
  variant = 'user',
  children,
  headerProps,
  className,
  ...rest
}: HomeCardProps) => {
  return (
    <div
      data-testid="home-card"
      data-variant={variant}
      className={clsx('home-card', `home-card--${variant}`, className)}
      {...rest}
    >
      {headerProps && !children ? (
        <HomeCardHeader {...headerProps} />
      ) : (
        children
      )}
    </div>
  );
};

Root.displayName = 'HomeCard';

const HomeCard = Object.assign(Root, {
  Header: HomeCardHeader,
  Content: HomeCardContent,
});

export default HomeCard;
