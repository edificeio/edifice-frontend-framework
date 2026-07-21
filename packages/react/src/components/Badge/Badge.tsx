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

/** Badge variant : status */
export type StatusBadgeVariant = {
  type: 'status';
  level: 'validate' | 'success' | 'warning' | 'danger' | 'info';
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
 * Badge variant : App Version.
 *
 * Displays a badge showing the app version, for example: BÊTA, ALPHA, NEW or a custom version label.
 *
 * Default label is BÊTA unless a label is provided as a children of the component.
 * Example of usage:
 * <Badge variant={{ type: 'appVersion', app: myApp }}>NEW</Badge>
 *
 * The color prop allows to customize the badge color to match the app color (Defaults to black if not provided).
 * Example of usage:
 * <Badge variant={{ type: 'appVersion', color: '#823AA1' }} />
 *
 * If app prop is provided, the color of the App Version Badge is derived from the application colors,
 * for example if the app provided is Blog then the Badge will have the same color as Blog app.
 * Example of usage:
 * <Badge variant={{ type: 'appVersion', app: blog }} />
 */
export type AppVersionBadgeVariant = {
  type: 'appVersion';
  color?: string;
  app?: IWebApp;
};

export type BadgeVariants =
  | NotificationBadgeVariant
  | StatusBadgeVariant
  | ContentBadgeVariant
  | ProfileBadgeVariant
  | ChipBadgeVariant
  | LinkBadgeVariant
  | AppVersionBadgeVariant;

export interface BadgeProps extends React.ComponentPropsWithRef<'span'> {
  /**
   * Badge variant : notification, link or profile (Teacher|Student|Relative|Personnel)
   * Defaults to notification.
   */
  variant?: BadgeVariants;
  /**
   * Text or icon (or whatever) to render as children elements.
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
    // Colors for the App Version Badge
    const { getIconClass, getBackgroundLightIconClass, getBorderIconClass } =
      useEdificeIcons();
    let appVersionBadgeColorClassName = '';
    if (variant.type === 'appVersion' && variant.app) {
      const colorAppClassName = getIconClass(variant.app);
      const backgroundLightAppClassName = getBackgroundLightIconClass(
        variant.app,
      );
      const borderAppClassName = getBorderIconClass(variant.app);
      appVersionBadgeColorClassName = `${colorAppClassName} ${backgroundLightAppClassName} ${borderAppClassName}`;
    }
    // End of Colors for the App Version Badge

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
      variant.type === 'status' &&
        `badge-status badge-status-${variant.level} caption fw-normal`,
      variant.type === 'user' &&
        `badge-profile-${variant.profile.toLowerCase()}`,
      variant.type === 'link' && 'badge-link border border-0',
      variant.type === 'chip' && 'bg-gray-200',
      variant.type === 'appVersion' && appVersionBadgeColorClassName,
      className,
    );

    return (
      <span ref={ref} className={classes} {...restProps}>
        {variant.type === 'chip' && (
          <div className="d-flex fw-800 align-items-center">{children}</div>
        )}
        {variant.type === 'appVersion' && (children ?? 'BÊTA')}
        {variant.type !== 'chip' && variant.type !== 'appVersion' && children}
      </span>
    );
  },
);

export default Badge;
