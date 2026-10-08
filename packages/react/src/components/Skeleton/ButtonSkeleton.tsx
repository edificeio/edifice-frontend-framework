import clsx from 'clsx';
import Button, { ButtonColors, ButtonSizes } from '../Button/Button';

// @deprecated This interface is deprecated and will be removed in future versions.
export interface ButtonSkeletonProps {
  className?: string;
  color?: ButtonColors;
  size?: ButtonSizes;
}

/**
 * @deprecated This component is deprecated and will be removed in future
 * versions. Please use the Skeleton primitive instead:
 * `<Skeleton variant="pill" width={…} height={…} />`.
 *
 * It renders a disabled Button so that a decorative placeholder ends up in the
 * focus and accessibility tree, and its grey comes from the legacy `gray-400`
 * scale rather than the `grey-300` design token.
 */
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
