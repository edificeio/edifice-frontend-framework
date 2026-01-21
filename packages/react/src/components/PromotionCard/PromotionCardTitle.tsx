import clsx from 'clsx';

export interface PromotionCardTitleProps {
  children: React.ReactNode;
  className?: string;
}

const PromotionCardTitle = ({
  children,
  className,
}: PromotionCardTitleProps) => {
  const classNames = clsx('promotion-card-title', className);

  return <h3 className={classNames}>{children}</h3>;
};

PromotionCardTitle.displayName = 'PromotionCardTitle';

export default PromotionCardTitle;
