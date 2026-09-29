import { ComponentPropsWithoutRef, MouseEventHandler, ReactNode } from 'react';

import clsx from 'clsx';

import { ButtonBeta, Flex } from '../../../../components';

export interface HomeCardHeaderProps extends Omit<
  ComponentPropsWithoutRef<'div'>,
  'title'
> {
  /** Title displayed on the left side of the header. */
  title: ReactNode;
  /** Label of the action button displayed on the right side of the header. */
  actionLabel?: ReactNode;
  /** Callback invoked when the action button is clicked. */
  onActionClick?: MouseEventHandler<HTMLButtonElement>;
  /** Optional left icon of the action button. */
  actionLeftIcon?: ReactNode;
  /** Optional right icon of the action button. */
  actionRightIcon?: ReactNode;
  /**
   * Extra props spread onto the action button (e.g. `data-testid`) — its
   * default `data-testid` (`home-card-header-action`) isn't unique across
   * the several `HomeCard`s a page can render, so consumers doing that
   * should override it here. The `data-*` index signature covers
   * attributes like `data-testid` that `ButtonBetaProps` doesn't declare:
   * TypeScript's built-in allowance for undeclared `data-*`/`aria-*`
   * attributes only applies to attributes written directly on a JSX
   * element, not to a plain object literal passed as a prop value.
   */
  actionProps?: ComponentPropsWithoutRef<typeof ButtonBeta> & {
    [key: `data-${string}`]: string;
  };
}

const HomeCardHeader = ({
  title,
  actionLabel,
  onActionClick,
  actionLeftIcon,
  actionRightIcon,
  actionProps,
  className,
  ...rest
}: HomeCardHeaderProps) => {
  const hasAction = Boolean(actionLabel) && Boolean(onActionClick);

  return (
    <Flex
      align="center"
      justify="between"
      gap="8"
      className={clsx('home-card-header', className)}
      {...rest}
    >
      <h3 className="home-card-header-title">{title}</h3>
      {hasAction && (
        <ButtonBeta
          color="tertiary"
          size="sm"
          variant="ghost"
          onClick={onActionClick}
          leftIcon={actionLeftIcon}
          rightIcon={actionRightIcon}
          data-testid="home-card-header-action"
          {...actionProps}
        >
          {actionLabel}
        </ButtonBeta>
      )}
    </Flex>
  );
};

HomeCardHeader.displayName = 'HomeCard.Header';

export default HomeCardHeader;
