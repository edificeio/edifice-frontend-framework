import { forwardRef, ReactNode, Ref } from 'react';

import { IWebApp, UserProfile } from '@edifice.io/client';
import clsx from 'clsx';
import { useEdificeIcons } from '../../hooks/useEdificeIcons';

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
 * Beta Badge has a fixed text 'BÊTA' unless children is provided.
 * If app is provided, the color of the Beta Badge is derived from the application colors.
 * Example:
 * <Badge variant={{ type: 'beta', color: '#823AA1', app: myApp }} />
 * where myApp is of type IWebApp.
 */
export type BetaBadgeVariant = {
  type: 'beta';
  color?: string;
  app?: IWebApp;
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
    // Colors for the Beta Badge
    const { getIconClass, getBackgroundLightIconClass, getBorderIconClass } =
      useEdificeIcons();
    let badgeColorClassName = '';
    if (variant.type === 'beta' && variant.app) {
      const colorAppClassName = getIconClass(variant.app);
      const backgroundLightAppClassName = getBackgroundLightIconClass(
        variant.app,
      );
      const borderAppClassName = getBorderIconClass(variant.app);
      badgeColorClassName = `${colorAppClassName} ${backgroundLightAppClassName} ${borderAppClassName}`;
    }
    // End of Colors for the Beta Badge

    console.log(badgeColorClassName);

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
      variant.type === 'beta' && badgeColorClassName,
      className,
    );

    return (
      <span ref={ref} className={classes} {...restProps}>
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
