import { clsx } from 'clsx';

export interface PromotionCardActionProps {
  children: React.ReactNode;
  className?: string;
}

const PromotionCardAction = ({
  children,
  className,
}: PromotionCardActionProps) => {
  const classNames = clsx('promotion-card-actions', className);

  return <div className={classNames}>{children}</div>;
};

PromotionCardAction.displayName = 'PromotionCardAction';

export default PromotionCardAction;
