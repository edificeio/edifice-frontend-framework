import { clsx } from 'clsx';

export interface PromotionCardDescriptionProps {
  children: React.ReactNode;
  className?: string;
}

const PromotionCardDescription = ({
  children,
  className,
}: PromotionCardDescriptionProps) => {
  const classNames = clsx('promotion-card-description', className);
  return <div className={classNames}>{children}</div>;
};

PromotionCardDescription.displayName = 'PromotionCardDescription';

export default PromotionCardDescription;
