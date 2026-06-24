import { CSSProperties, forwardRef, Ref } from 'react';

import { IWebApp } from '@edifice.io/client';
import clsx from 'clsx';

import { useEdificeIcons } from '../../hooks/useEdificeIcons';
import { Image } from '../Image';

import * as IconSprites from '../../modules/icons/components/apps';

/**
 * Predefined icon sizes (in px). These keep their exact historical padding
 * when `iconFit="ratio"`.
 */
export type PredefinedAppIconSize = '24' | '32' | '40' | '48' | '80' | '160';

/**
 * Icon size, in px. Accepts the predefined sizes (with autocompletion) as well
 * as any custom value (e.g. `'16'`, `'20'`). In `iconFit="ratio"` mode, custom
 * sizes get an automatically computed padding (no CSS override needed).
 *
 * The `(string & {})` part keeps autocompletion for the predefined sizes while
 * still allowing any string value.
 */
export type AppIconSize = PredefinedAppIconSize | (string & {});

export interface BaseProps {
  /**
   * Define icon size
   */
  size?: AppIconSize;
  /**
   * App information to get code and name
   */
  app?: IWebApp | string;
  /**
   * Custom class name
   */
  className?: string;
}

type AppVariants = 'square' | 'circle' | 'rounded';
type SquareVariant = Extract<AppVariants, 'square'>;

type SquareIcon = {
  /**
   * Show icon full width
   */
  iconFit?: 'contain';
  /**
   * Square variant
   */
  variant?: SquareVariant;
};

type VariantsIcon = {
  /**
   * Add padding around icon
   */
  iconFit: 'ratio';
  /**
   * Rounded or Circle variant
   */
  variant: AppVariants;
};

export type Props = SquareIcon | VariantsIcon;
export type AppIconProps = BaseProps & Props;

/**
 * Icon Component used to display the icon of an application
 */
const AppIcon = forwardRef(
  (
    {
      app,
      size = '24',
      iconFit = 'contain',
      variant = 'square',
      className = '',
    }: AppIconProps,
    ref: Ref<HTMLDivElement>,
  ) => {
    const { isIconUrl, getIconCode } = useEdificeIcons();

    const isSquare = variant === 'square';
    const isRounded = variant === 'rounded';
    const isCircle = variant === 'circle';
    const isContain = iconFit === 'contain';
    const isRatio = iconFit === 'ratio';

    const iconSizes = {
      'icon-xs': size === '24',
      'icon-sm': size === '40',
      'icon-md': size === '48',
      'icon-lg': size === '80',
      'icon-xl': size === '160',
    };

    const iconVariant = {
      'square': isSquare,
      'rounded': isRounded,
      'rounded-circle': isCircle,
    };

    const iconFits = {
      'icon-contain': isContain,
      'icon-ratio': isRatio,
    };

    const icon =
      typeof app === 'string'
        ? app
        : app?.icon !== undefined
          ? app.icon
          : 'placeholder';
    const displayName =
      typeof app !== 'string' && app?.displayName !== undefined
        ? app.displayName
        : '';
    const code = app ? getIconCode(app) : '';
    const isIconURL = isIconUrl(icon);

    const appCode = code || 'placeholder';

    const classes = clsx(
      'app-icon',
      {
        ...iconSizes,
        ...iconVariant,
        ...iconFits,
        [`bg-light-${appCode}`]: !isContain,
        [`color-app-${appCode}`]: appCode,
        'bg-app-light': !isContain,
        'color-app': appCode,
        [`app-${appCode}`]: appCode,
      },
      className,
    );

    const IconComponent =
      IconSprites[
        `Icon${appCode
          .split('-')
          .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
          .join('')}` as keyof typeof IconSprites
      ] ?? IconSprites.IconPlaceholder;

    if (isIconURL) {
      const classes = clsx('h-full', className);
      return (
        <Image
          src={icon}
          alt={displayName}
          objectFit="contain"
          width={size}
          height={size}
          className={classes}
          style={{ minWidth: size + 'px' }}
        />
      );
    }

    // Expose the actual size (in px) as a CSS variable so the stylesheet can
    // compute a padding that scales with any size in `iconFit="ratio"` mode.
    const style = {
      'width': size + 'px',
      'height': size + 'px',
      '--app-icon-size': size + 'px',
    } as CSSProperties;

    return (
      <div ref={ref} className={classes} style={style}>
        <IconComponent width={size} height={size} />
      </div>
    );
  },
);

AppIcon.displayName = 'AppIcon';

export default AppIcon;
