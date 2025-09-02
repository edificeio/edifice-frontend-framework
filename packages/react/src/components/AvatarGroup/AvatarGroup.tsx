import clsx from 'clsx';
import { forwardRef, ReactNode, Ref } from 'react';
import { Avatar, type AvatarProps } from '../Avatar';
import { StackedGroup } from '../StackedGroup';

export interface AvatarGroupProps extends Omit<AvatarProps, 'src'> {
  /**
   * List of avatar sources
   */
  src: string[];
  /**
   * Maximum number of avatars to display
   * @default 3
   */
  maxAvatars?: number;
  /**
   * Overlap between avatars (in pixels)
   * @default 20
   */
  overlap?: number;
  /**
   * Controls stacking order. When 'rightFirst', rightmost avatar has highest z-index
   * @default 'leftFirst'
   */
  stackingOrder?: 'leftFirst' | 'rightFirst';
  /**
   * Whether to wrap avatars to the next line
   * @default false
   */
  wrap?: boolean;
  /**
   * Cover content for the last avatar
   */
  lastItemCover?: ReactNode;
}

const AvatarGroup = forwardRef(
  (
    {
      src,
      maxAvatars = 3,
      overlap = 20,
      className,
      size = 'md',
      variant = 'circle',
      alt,
      stackingOrder = 'leftFirst',
      wrap = false,
      lastItemCover,
      ...restProps
    }: AvatarGroupProps,
    ref: Ref<HTMLDivElement>,
  ) => {
    const visibleAvatars = src.slice(0, maxAvatars);

    const classes = clsx('avatar-group d-flex', className);

    return (
      <div ref={ref} className={classes}>
        <StackedGroup
          overlap={overlap}
          stackingOrder={stackingOrder}
          wrap={wrap}
        >
          {visibleAvatars.map((avatarSrc, index) => (
            <Avatar
              key={index}
              src={avatarSrc}
              size={size}
              variant={variant}
              alt={`${alt} ${index + 1}`}
              cover={index === maxAvatars - 1 ? lastItemCover : undefined}
              {...restProps}
            />
          ))}
        </StackedGroup>
      </div>
    );
  },
);

AvatarGroup.displayName = 'AvatarGroup';

export default AvatarGroup;
