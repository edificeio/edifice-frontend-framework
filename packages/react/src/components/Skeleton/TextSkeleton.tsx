import clsx from 'clsx';

// @deprecated This type is deprecated and will be removed in future versions.
export type TextSkeletonSizes = 'xs' | 'sm' | 'md' | 'lg';

// @deprecated This interface is deprecated and will be removed in future versions.
export interface TextSkeletonProps {
  className?: string;
  size?: TextSkeletonSizes;
}

/**
 * @deprecated This component is deprecated and will be removed in future
 * versions. Please use the Skeleton primitive instead:
 * `<Skeleton variant="text" width={…} height={…} />`.
 *
 * It relies on the Bootstrap `.placeholder` class, whose animation cannot be
 * turned off and which ignores `prefers-reduced-motion`.
 */
const TextSkeleton = ({ className, size = 'md' }: TextSkeletonProps) => {
  const classN = clsx('placeholder', className, {
    'placeholder-xs': size === 'xs',
    'placeholder-sm': size === 'sm',
    'placeholder-lg': size === 'lg',
  });

  return <span className={classN}></span>;
};

TextSkeleton.displayName = 'TextSkeleton';

export default TextSkeleton;
