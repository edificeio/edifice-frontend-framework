import { ReactNode } from 'react';

import clsx from 'clsx';

import { useDropdownContext } from './DropdownContext';
import { useDropdownItemFilter } from './useDropdownItemFilter';
import DropdownItemHidden from './DropdownItemHidden';

export interface DropdownItemProps {
  /**
   * Object type
   */
  type?: 'action' | 'select';
  /**
   * Icon component
   */
  icon?: JSX.Element;
  /**
   * Content
   */
  children: ReactNode;
  /**
   *
   * Action on click
   */
  onClick?: (event: React.MouseEvent) => void;
  /**
   * Additional class name
   */
  className?: string;
  /**
   * Set minimum width in pixels
   */
  minWidth?: number;
  /**
   * Disabled status
   */
  disabled?: boolean;
  /**
   * Value used to filter this item when `Dropdown.SearchInput` is present.
   * If provided, the item is hidden when the search query doesn't match.
   */
  searchValue?: string;
}

const DropdownItem = ({
  type = 'action',
  icon,
  onClick,
  children,
  className,
  minWidth,
  disabled,
  searchValue,
  ...restProps
}: DropdownItemProps) => {
  const { itemProps, itemRefs, isFocused } = useDropdownContext();
  const { id, isFiltered } = useDropdownItemFilter(searchValue);

  const { onMenuItemKeyDown, onMenuItemMouseEnter, onMenuItemClick } =
    itemProps;

  const handleOnClick = (event: React.MouseEvent) => {
    if (disabled) {
      return;
    }
    onClick?.(event);

    if (type === 'action') {
      onMenuItemClick();
      event.stopPropagation();
    }
  };

  const dropdownItem = clsx(
    'dropdown-item',
    {
      focus: isFocused === id,
    },
    { 'text-gray-600': disabled },
    className,
  );

  const style = {
    ...(minWidth && { minWidth: `${minWidth}px` }),
  };

  const content = (
    <div className="d-flex gap-8 align-items-center">
      {icon}
      {children}
    </div>
  );

  if (isFiltered) {
    return <DropdownItemHidden>{content}</DropdownItemHidden>;
  }

  return (
    <div
      id={id}
      role="menuitem"
      style={style}
      ref={(el) => (itemRefs.current[id] = el)}
      tabIndex={isFocused === id ? 0 : -1}
      className={dropdownItem}
      aria-current={isFocused === id}
      onClick={handleOnClick}
      onMouseEnter={onMenuItemMouseEnter}
      onKeyDown={(event) => onMenuItemKeyDown(event, onClick)}
      {...restProps}
    >
      {content}
    </div>
  );
};

DropdownItem.displayName = 'Dropdown.Item';

export default DropdownItem;
