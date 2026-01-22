import { clsx } from 'clsx';

export interface PromotionCardIconProps {
  icon: React.ReactNode;
  backgroundColor?: string;
  className?: string;
}

const PromotionCardIcon = ({
  icon,
  backgroundColor,
  className,
}: PromotionCardIconProps) => {
  const classNames = clsx('promotion-card-icon', className);

  return (
    <div className={classNames} style={{ backgroundColor }}>
      {icon}
    </div>
  );
};

PromotionCardIcon.displayName = 'PromotionCardIcon';

export default PromotionCardIcon;
