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

  return <div className={classNames}>{children}</div>;
};

PromotionCardTitle.displayName = 'PromotionCardTitle';

export default PromotionCardTitle;
