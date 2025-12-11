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
import { Button, ButtonProps, IconButton, IconButtonProps } from '../Button';
import { Dropdown, DropdownProps } from '../Dropdown';
import { Placement, Tooltip } from '../Tooltip';

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
  props: ButtonProps;
}

export interface ToolbarIconButtonItem
  extends ToolbarCommonItem, ToolbarTooltipProps {
  type: 'icon';
  name: string;
  props: IconButtonProps;
}

export interface ToolbarDropdownItem extends ToolbarCommonItem {
  type: 'dropdown';
  props: DropdownProps;
  overflow?: boolean;
}

export interface ToolbarPrimaryItem
  extends ToolbarCommonItem, ToolbarTooltipProps {
  type: 'primary';
  props: ButtonProps;
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

            case 'button':
              return (
                <Tooltip
                  key={item.name ?? index}
                  message={hideLabel ? renderTooltipMessage(item) : undefined}
                  placement={renderTooltipPosition(item)}
                >
                  <Button
                    {...item.props}
                    children={!hideLabel && item.props.children}
                    aria-label={item.name}
                    key={item.name ?? index}
                    color={item.props.color || 'tertiary'}
                    variant="ghost"
                    size={item.props.size || hideLabel ? 'sm' : 'md'}
                    tabIndex={index === firstFocusableItemIndex ? 0 : -1}
                    onKeyDown={handleKeyDown}
                  />
                </Tooltip>
              );

            case 'icon':
              return (
                <Tooltip
                  key={item.name ?? index}
                  message={renderTooltipMessage(item)}
                  placement={renderTooltipPosition(item)}
                >
                  <IconButton
                    {...item.props}
                    key={item.name ?? index}
                    color={item.props.color ? item.props.color : 'tertiary'}
                    variant={item.props.variant ? item.props.variant : 'ghost'}
                    tabIndex={index === firstFocusableItemIndex ? 0 : -1}
                    onKeyDown={handleKeyDown}
                  />
                </Tooltip>
              );

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
                    {...item.props}
                    variant="filled"
                    color="primary"
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
