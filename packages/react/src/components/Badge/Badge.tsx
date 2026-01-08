import { forwardRef, ReactNode, Ref } from 'react';

import { UserProfile } from '@edifice.io/client';
import clsx from 'clsx';

export type BadgeRef = HTMLSpanElement;

/** Badge variant : notification */
export type NotificationBadgeVariant = {
  type: 'notification';
  level: 'success' | 'warning' | 'danger' | 'info';
};

/** Badge variant : content */
export type ContentBadgeVariant = {
  type: 'content';
  level: 'success' | 'warning' | 'danger' | 'info';
  background?: boolean;
};

/** Badge variant : profile = teacher, student, relative or personnel, guest */
export type ProfileBadgeVariant = {
  type: 'user';
  profile: UserProfile[number];
  background?: boolean;
};

/** Badge variant : chip */
export type ChipBadgeVariant = {
  type: 'chip';
};

/** Badge variant : link */
export type LinkBadgeVariant = {
  type: 'link';
};

/**
 * Badge variant : beta.
 * Beta Badge is used to indicate that a feature is in beta phase.
 * The color prop allows to customize the badge color to match the app color.
 * Defaults to black if not provided.
 */
export type BetaBadgeVariant = {
  type: 'beta';
  color?: string; // Hex color code for the badge color (the app color)
};

export type BadgeVariants =
  | NotificationBadgeVariant
  | ContentBadgeVariant
  | ProfileBadgeVariant
  | ChipBadgeVariant
  | LinkBadgeVariant
  | BetaBadgeVariant;

export interface BadgeProps extends React.ComponentPropsWithRef<'span'> {
  /**
   * Badge variant : notification, link or profile (Teacher|Student|Relative|Personnel)
   * Defaults to notification.
   */
  variant?: BadgeVariants;
  /**
   * Text or icon (or whatever) to render as children elements.
   * Defaults to 'BÊTA' for beta variant.
   */
  children?: ReactNode;
  /**
   * Optional class for styling purpose
   */
  className?: string;
}

/**
 * Primary UI component for user interaction
 */
const Badge = forwardRef(
  (
    {
      className,
      variant = { type: 'notification', level: 'info' },
      children,
      ...restProps
    }: BadgeProps,
    ref: Ref<BadgeRef>,
  ) => {
    const classes = clsx(
      'badge rounded-pill',
      (variant.type === 'content' || variant.type === 'user') &&
        'background' in variant
        ? 'bg-gray-200'
        : (variant.type === 'content' || variant.type === 'user') &&
            !('background' in variant)
          ? 'border border-0'
          : '',
      variant.type === 'content' && `text-${variant.level}`,
      variant.type === 'notification' &&
        `badge-notification bg-${variant.level} text-light border border-0`,
      variant.type === 'user' &&
        `badge-profile-${variant.profile.toLowerCase()}`,
      variant.type === 'link' && 'badge-link border border-0',
      variant.type === 'chip' && 'bg-gray-200',
      className,
    );

    const getBetaStyle = () => {
      if (variant.type !== 'beta') return undefined;

      const color = variant.color ?? '#000000';
      return {
        borderColor: color,
        color: color,
        backgroundColor: `${color}10`, // the 2 last hexadecimal numbers are for opacity
      };
    };

    return (
      <span ref={ref} className={classes} style={getBetaStyle()} {...restProps}>
        {variant.type === 'chip' && (
          <div className="d-flex fw-800 align-items-center">{children}</div>
        )}
        {variant.type === 'beta' && (children ?? 'BÊTA')}
        {variant.type !== 'chip' && variant.type !== 'beta' && children}
      </span>
    );
  },
);

export default Badge;
