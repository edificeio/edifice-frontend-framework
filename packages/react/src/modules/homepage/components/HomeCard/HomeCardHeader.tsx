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
}

const HomeCardHeader = ({
  title,
  actionLabel,
  onActionClick,
  actionLeftIcon,
  actionRightIcon,
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
        >
          {actionLabel}
        </ButtonBeta>
      )}
    </Flex>
  );
};

HomeCardHeader.displayName = 'HomeCard.Header';

export default HomeCardHeader;
