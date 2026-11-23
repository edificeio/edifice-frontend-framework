import {
  FocusEvent,
  ReactNode,
  Ref,
  forwardRef,
  useEffect,
  useRef,
  useState,
} from 'react';

import clsx from 'clsx';

import { useBreakpoint } from '../../hooks';
import { mergeRefs } from '../../utilities';
import {
  ButtonColors,
  ButtonProps,
  ButtonSizes,
  IconButtonProps,
} from '../Button';
import {
  ButtonBeta as Button,
  ButtonBetaColor,
  ButtonBetaProps,
  ButtonBetaSizes,
} from '../ButtonBeta';
import { Dropdown, DropdownProps } from '../Dropdown';
import { Placement, Tooltip } from '../Tooltip';

type ToolbarButtonColor = ButtonColors | ButtonBetaColor;
type ToolbarButtonSize = ButtonSizes | ButtonBetaSizes;

/**
 * Props of a toolbar button. Accepts both legacy `Button` values and the new
 * `ButtonBeta` values; legacy-only values are deprecated.
 */
export interface ToolbarButtonProps extends Omit<
  ButtonProps,
  'color' | 'size' | 'loadingIcon' | 'loadingPosition'
> {
  /**
   * `default`, `secondary`, `tertiary` or `destructive`.
   *
   * Deprecated values: `primary` (use `default`), `danger` (use
   * `destructive`) and `black` (use `tertiary`).
   */
  color?: ToolbarButtonColor;
  /**
   * `sm` or `md`.
   *
   * Deprecated value: `lg` (use `md`).
   */
  size?: ToolbarButtonSize;
  /** @deprecated Not supported by the new toolbar buttons, ignored. */
  loadingIcon?: ButtonProps['loadingIcon'];
  /** @deprecated Not supported by the new toolbar buttons, ignored. */
  loadingPosition?: ButtonProps['loadingPosition'];
}

export interface ToolbarIconButtonProps extends Omit<
  ToolbarButtonProps,
  'children' | 'leftIcon' | 'rightIcon'
> {
  icon?: IconButtonProps['icon'];
}

const BUTTON_BETA_COLORS: Record<ToolbarButtonColor, ButtonBetaColor> = {
  default: 'default',
  secondary: 'secondary',
  tertiary: 'tertiary',
  destructive: 'destructive',
  primary: 'default',
  danger: 'destructive',
  black: 'tertiary',
};

const BUTTON_BETA_SIZES: Record<ToolbarButtonSize, ButtonBetaSizes> = {
  sm: 'sm',
  md: 'md',
  lg: 'md',
};

const DEPRECATED_COLORS: ReadonlyArray<ToolbarButtonColor> = [
  'primary',
  'danger',
  'black',
];
const DEPRECATED_SIZES: ReadonlyArray<ToolbarButtonSize> = ['lg'];

const warnedDeprecations = new Set<string>();

const warnDeprecated = (usage: string, replacement: string) => {
  if (process.env.NODE_ENV === 'production') return;
  if (warnedDeprecations.has(usage)) return;
  warnedDeprecations.add(usage);
  console.warn(`[Toolbar] ${usage} is deprecated, use ${replacement} instead.`);
};

const toButtonBetaProps = ({
  color,
  size,
  ...rest
}: Omit<ToolbarButtonProps, 'ref'>): ButtonBetaProps => {
  const betaColor = color && BUTTON_BETA_COLORS[color];
  const betaSize = size && BUTTON_BETA_SIZES[size];

  if (color && DEPRECATED_COLORS.includes(color)) {
    warnDeprecated(`color "${color}"`, `color "${betaColor}"`);
  }
  if (size && DEPRECATED_SIZES.includes(size)) {
    warnDeprecated(`size "${size}"`, `size "${betaSize}"`);
  }
  if (rest.loadingIcon !== undefined || rest.loadingPosition !== undefined) {
    warnDeprecated(
      'loadingIcon/loadingPosition',
      'nothing (no longer supported)',
    );
  }

  delete rest.loadingIcon;
  delete rest.loadingPosition;
  return { ...rest, color: betaColor, size: betaSize };
};

export interface ToolbarCommonItem {
  /** Object type */
  type: string;
  /** Items should be named, except for dividers */
  name?: string;
  /** Set to "hide" to hide this item. Defaults to "show" when undefined. */
  visibility?: 'show' | 'hide';
}

export interface ToolbarTooltipProps {
  tooltip?:
    | string
    | {
        message: string;
        position?: Placement;
      };
}

export interface ToolbarButtonItem
  extends ToolbarCommonItem, ToolbarTooltipProps {
  type: 'button';
  name: string;
  props: ToolbarButtonProps;
}

export interface ToolbarIconButtonItem
  extends ToolbarCommonItem, ToolbarTooltipProps {
  type: 'icon';
  name: string;
  props: ToolbarIconButtonProps;
}

export interface ToolbarDropdownItem extends ToolbarCommonItem {
  type: 'dropdown';
  props: DropdownProps;
  overflow?: boolean;
}

export interface ToolbarPrimaryItem
  extends ToolbarCommonItem, ToolbarTooltipProps {
  type: 'primary';
  props: ToolbarButtonProps;
}

export interface ToolbarDividerItem extends ToolbarCommonItem {
  type: 'divider';
}

export type ToolbarRef = HTMLDivElement;
export type ToolbarVariant = 'default' | 'no-shadow';
export type ToolbarAlign = 'left' | 'center' | 'space' | 'right';
export type ToolbarItem =
  | ToolbarButtonItem
  | ToolbarIconButtonItem
  | ToolbarDropdownItem
  | ToolbarPrimaryItem
  | ToolbarDividerItem;

export interface ToolbarProps extends React.ComponentPropsWithRef<'div'> {
  /**
   * Toolbar data items
   */
  items: ToolbarItem[];
  /**
   * Toolbar variant
   */
  variant?: ToolbarVariant;
  /**
   * Buttons alignement when isBlock is true
   */
  align?: ToolbarAlign;
  /**
   * Toolbar has width 100%
   */
  isBlock?: boolean;
  /**
   * Editor container ID for a11y purpose
   */
  ariaControls?: string;
  /**
   * Additional CSS classes.
   */
  className?: string;
  /**
   * Accept optional children
   */
  children?: ReactNode;
  /**
   * Hide labels on mobile
   */
  shouldHideLabelsOnMobile?: boolean;
}

export const Toolbar = forwardRef(
  (
    {
      items,
      variant = 'default',
      align = 'space',
      isBlock = false,
      ariaControls,
      className,
      shouldHideLabelsOnMobile = false,
    }: ToolbarProps,
    ref: Ref<ToolbarRef>,
  ) => {
    const [firstFocusableItemIndex, setFirstFocusableItemIndex] =
      useState<number>(0);
    const [a11yNavigationItems, setA11yNavigationItems] = useState<
      Array<HTMLElement>
    >([]);
    const [firstA11yNavigationItem, setFirstA11yNavigationItem] =
      useState<HTMLElement>();
    const [lastA11yNavigationItem, setA11yNavigationLastItem] =
      useState<HTMLElement>();

    const divToolbarRef = useRef<HTMLDivElement>();
    const { lg } = useBreakpoint();

    const classes = clsx('toolbar z-1000 bg-white', className, {
      'default': variant === 'default',
      'no-shadow': variant === 'no-shadow',
      'd-flex': isBlock,
      'd-inline-flex': !isBlock,
      'overflow-x-auto': isBlock,
      'justify-content-start': align === 'left',
      'justify-content-between': align === 'space',
      'justify-content-center': align === 'center',
      'justify-content-end': align === 'right',
    });

    useEffect(() => {
      // a11y: set first and last item for keyboard arrow navigation
      const buttons: NodeListOf<HTMLButtonElement> | undefined =
        divToolbarRef.current?.querySelectorAll('button');
      const enabledItems: Array<HTMLElement> = [];
      let isfirstItemSet: boolean = false;

      buttons?.forEach((item) => {
        if (!item.disabled) {
          if (!isfirstItemSet) {
            setFirstA11yNavigationItem(item);
            isfirstItemSet = true;
          }
          setA11yNavigationLastItem(item);
          enabledItems.push(item);
        }
      });

      setA11yNavigationItems(enabledItems);

      // a11y: set first element to focus with tab keyboard
      setFirstFocusableItemIndex(
        items.findIndex(
          (item) =>
            (item.type === 'button' || item.type === 'icon') &&
            !item.props.disabled,
        ),
      );
    }, [items]);

    const handleFocus = (event: FocusEvent<HTMLDivElement>) => {
      // focused button
      event.target.classList.add('focus');
    };

    const handleBlur = (event: FocusEvent<HTMLDivElement>) => {
      // focused button
      event.target.classList.remove('focus');
    };

    /**
     * Handle a11y toolbar navigation with Arrow keys.
     */
    const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
      const index = a11yNavigationItems.indexOf(event.currentTarget);
      switch (event.code) {
        case 'ArrowLeft':
          // switch to previous item
          if (event.currentTarget === firstA11yNavigationItem) {
            lastA11yNavigationItem?.focus();
          } else {
            a11yNavigationItems[index - 1]?.focus();
          }
          break;
        case 'ArrowRight':
          // switch to next item
          if (event.currentTarget === lastA11yNavigationItem) {
            firstA11yNavigationItem?.focus();
          } else {
            a11yNavigationItems[index + 1]?.focus();
          }
          break;
        default:
          break;
      }
    };

    const renderTooltipMessage = (
      item: Exclude<ToolbarItem, ToolbarDropdownItem | ToolbarDividerItem>,
    ) => {
      return typeof item.tooltip === 'string'
        ? item.tooltip
        : item.tooltip?.message;
    };

    const renderTooltipPosition = (
      item: Exclude<ToolbarItem, ToolbarDropdownItem | ToolbarDividerItem>,
    ) => {
      return typeof item.tooltip !== 'string' ? item.tooltip?.position : 'top';
    };

    return (
      <div
        ref={mergeRefs(ref, divToolbarRef)}
        className={classes}
        role="toolbar"
        aria-label="Text Formatting"
        aria-controls={ariaControls}
        onFocus={handleFocus}
        onBlur={handleBlur}
      >
        {items.map((item, index) => {
          if (item.visibility === 'hide') return null;
          const hideLabel = shouldHideLabelsOnMobile && !lg;

          switch (item.type) {
            case 'divider':
              return (
                <div key={item.name ?? index} className="toolbar-divider"></div>
              );

            case 'button': {
              const buttonProps = toButtonBetaProps(item.props);
              return (
                <Tooltip
                  key={item.name ?? index}
                  message={hideLabel ? renderTooltipMessage(item) : undefined}
                  placement={renderTooltipPosition(item)}
                >
                  <Button
                    {...buttonProps}
                    children={!hideLabel && buttonProps.children}
                    aria-label={item.name}
                    color={buttonProps.color || 'tertiary'}
                    variant="ghost"
                    size={buttonProps.size || 'md'}
                    tabIndex={index === firstFocusableItemIndex ? 0 : -1}
                    onKeyDown={handleKeyDown}
                  />
                </Tooltip>
              );
            }

            case 'icon': {
              const { icon, ...iconProps } = item.props;
              const buttonProps = toButtonBetaProps(iconProps);
              return (
                <Tooltip
                  key={item.name ?? index}
                  message={renderTooltipMessage(item)}
                  placement={renderTooltipPosition(item)}
                >
                  <Button
                    {...buttonProps}
                    leftIcon={icon}
                    color={buttonProps.color || 'tertiary'}
                    variant={buttonProps.variant || 'ghost'}
                    size={buttonProps.size || 'md'}
                    tabIndex={index === firstFocusableItemIndex ? 0 : -1}
                    onKeyDown={handleKeyDown}
                  />
                </Tooltip>
              );
            }

            case 'dropdown':
              return (
                <Dropdown
                  {...item.props}
                  key={item.name ?? index}
                  extraTriggerKeyDownHandler={handleKeyDown}
                  overflow={item.overflow}
                >
                  {/* Set the children through props */}
                </Dropdown>
              );

            case 'primary':
              return (
                <Tooltip
                  key={item.name ?? index}
                  message={renderTooltipMessage(item)}
                  placement={renderTooltipPosition(item)}
                >
                  <Button
                    {...toButtonBetaProps(item.props)}
                    variant="filled"
                    color="default"
                    tabIndex={index === firstFocusableItemIndex ? 0 : -1}
                    onKeyDown={handleKeyDown}
                  />
                </Tooltip>
              );

            default:
              break;
          }
          return null;
        })}
      </div>
    );
  },
);

Toolbar.displayName = 'Toolbar';

export default Toolbar;
