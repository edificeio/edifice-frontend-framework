import { forwardRef, Ref } from 'react';
import clsx from 'clsx';
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
      ...restProps
    }: AvatarGroupProps,
    ref: Ref<HTMLDivElement>,
  ) => {
    const visibleAvatars = src.slice(0, maxAvatars);

    const classes = clsx('avatar-group', className);

    return (
      <div ref={ref} className={classes} style={{ display: 'flex' }}>
        <StackedGroup overlap={overlap} stackingOrder={stackingOrder}>
          {visibleAvatars.map((avatarSrc, index) => (
            <Avatar
              src={avatarSrc}
              size={size}
              variant={variant}
              alt={`${alt} ${index + 1}`}
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
