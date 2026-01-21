import { clsx } from 'clsx';

export interface PromotionCardFooterProps {
  children: React.ReactNode;
  className?: string;
}

const PromotionCardFooter = ({
  children,
  className,
}: PromotionCardFooterProps) => {
  const classNames = clsx('promotion-card-footer', className);

  return <div className={classNames}>{children}</div>;
};

PromotionCardFooter.displayName = 'PromotionCardFooter';

export default PromotionCardFooter;
