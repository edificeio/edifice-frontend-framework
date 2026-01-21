import { clsx } from 'clsx';

export interface PromotionCardHeaderProps {
  children: React.ReactNode;
  backgroundColor?: string;
  textColor?: string;
  className?: string;
}

const PromotionCardHeader = ({
  backgroundColor,
  textColor,
  children,
  className,
}: PromotionCardHeaderProps) => {
  const classNames = clsx('promotion-card-header', className);

  return (
    <div className={classNames} style={{ backgroundColor, color: textColor }}>
      {children}
    </div>
  );
};

PromotionCardHeader.displayName = 'PromotionCardHeader';

export default PromotionCardHeader;
