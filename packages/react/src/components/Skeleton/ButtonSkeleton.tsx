import clsx from 'clsx';
import Button, { ButtonColors, ButtonSizes } from '../Button/Button';

export interface ButtonSkeletonProps {
  className?: string;
  color?: ButtonColors;
  size?: ButtonSizes;
}

const ButtonSkeleton = ({
  className,
  color = 'tertiary',
  size = 'md',
}: ButtonSkeletonProps) => {
  const classN = clsx('placeholder', className, {
    'bg-gray-400': color === 'tertiary',
  });
  return (
    <Button
      className={classN}
      color={color}
      variant="filled"
      size={size}
      disabled
    ></Button>
  );
};

ButtonSkeleton.displayName = 'ButtonSkeleton';

export default ButtonSkeleton;
