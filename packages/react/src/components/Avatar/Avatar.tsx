import { forwardRef, ReactNode, Ref } from 'react';

import clsx from 'clsx';

import noAvatar from '@edifice.io/bootstrap/dist/images/avatar/no-avatar.svg';
import { Color } from 'src/types/color';
import { Image } from '../Image';

export type AvatarVariants = 'square' | 'rounded' | 'circle';
export type AvatarSizes = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export interface AvatarProps extends React.ComponentPropsWithRef<'img'> {
  /**
   * Shape of Avatar
   * `title`, `square`, `circle`
   */
  variant?: AvatarVariants;
  /**
   * Avatar' size
   */
  size?: AvatarSizes;
  /**
   * Show image when `src` props is provided
   */
  src?: string;
  /**
   * Custom fallback image
   */
  imgPlaceholder?: string;
  /**
   * Alternative text when using image
   */
  alt: string;
  /**
   * Optional class for styling purpose
   */
  className?: string;
  /**
   * Inner border color
   */
  innerBorderColor?: Color;
  /**
   * Inner border width in pixels
   */
  innerBorderWidth?: number;

  /**
   * Outer border color
   */
  outerBorderColor?: Color;

  /**
   * Outer border width in pixels
   */
  outerBorderWidth?: number;

  /**
   * Outer border offset in pixels
   */
  outerBorderOffset?: number;
  /**
   * Cover content for the avatar
   */
  cover?: ReactNode;
}

const Avatar = forwardRef(
  (
    {
      variant = 'square',
      size = 'md',
      alt,
      src,
      imgPlaceholder,
      className,
      innerBorderColor,
      innerBorderWidth,
      outerBorderColor,
      outerBorderWidth,
      outerBorderOffset,
      cover,
      ...restProps
    }: AvatarProps,
    ref: Ref<HTMLDivElement>,
  ) => {
    const placeholder = imgPlaceholder || noAvatar;

    const isSquare = variant === 'square';
    const isRounded = variant === 'rounded';
    const isCircle = variant === 'circle';

    const avatarSizes = {
      'avatar-xs': size === 'xs',
      'avatar-sm': size === 'sm',
      'avatar-md': size === 'md',
      'avatar-lg': size === 'lg',
      'avatar-xl': size === 'xl',
    };

    const avatarVariants = {
      'square': isSquare,
      'rounded': isRounded,
      'rounded-circle': isCircle,
    };

    const classes = clsx(
      'avatar',
      {
        ...avatarSizes,
        ...avatarVariants,
      },
      { 'avatar-with-cover': cover },
      className,
    );

    const style = {
      ...(outerBorderColor && {
        outline: `${outerBorderWidth}px solid var(--edifice-${outerBorderColor})`,
        outlineOffset: outerBorderOffset,
      }),
      ...(innerBorderColor && {
        border: `${innerBorderWidth}px solid var(--edifice-${innerBorderColor})`,
      }),
    };

    return (
      <div ref={ref} className={classes} style={style}>
        <Image
          src={src || placeholder}
          alt={alt}
          imgPlaceholder={placeholder}
          {...restProps}
        />
        {cover && <div className="avatar-cover">{cover}</div>}
      </div>
    );
  },
);

Avatar.displayName = 'Avatar';

export default Avatar;
