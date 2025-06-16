import Button, { ButtonColors, ButtonSizes } from './Button';

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
  return (
    <Button
      className={`placeholder flex-shrink-1 ${className}`}
      color={color}
      variant="filled"
      size={size}
      disabled
    ></Button>
  );
};

ButtonSkeleton.displayName = 'ButtonSkeleton';

export default ButtonSkeleton;
