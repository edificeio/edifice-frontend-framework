import clsx from 'clsx';

export interface PromotionCardBodyProps {
  children: React.ReactNode;
  textColor?: string;
  className?: string;
}

const PromotionCardBody = ({
  children,
  textColor,
  className,
}: PromotionCardBodyProps) => {
  const classNames = clsx('promotion-card-body', className);

  return (
    <div className={classNames} style={{ color: textColor }}>
      {children}
    </div>
  );
};

PromotionCardBody.displayName = 'PromotionCardBody';

export default PromotionCardBody;
