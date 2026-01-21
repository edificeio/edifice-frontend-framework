import { clsx } from 'clsx';

export interface PromotionCardIconProps {
  backgroundColor: string;
  icon: React.ReactNode;
  className?: string;
}

const PromotionCardIcon = ({
  backgroundColor,
  icon,
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
