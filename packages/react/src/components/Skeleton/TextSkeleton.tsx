import clsx from 'clsx';

export type TextSkeletonSizes = 'xs' | 'sm' | 'md' | 'lg';
export interface TextSkeletonProps {
  className?: string;
  size?: TextSkeletonSizes;
}

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
