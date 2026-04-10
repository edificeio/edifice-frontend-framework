import { ReactNode, useId, useLayoutEffect } from 'react';

import clsx from 'clsx';

import { useDropdownContext } from './DropdownContext';

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
  const {
    itemProps,
    itemRefs,
    isFocused,
    searchQuery,
    reportMatch,
    unregisterMatch,
  } = useDropdownContext();
  const id = useId();

  const { onMenuItemKeyDown, onMenuItemMouseEnter, onMenuItemClick } =
    itemProps;

  const isFiltered =
    searchValue !== undefined &&
    searchQuery !== '' &&
    !searchValue.toLowerCase().includes(searchQuery.toLowerCase());

  useLayoutEffect(() => {
    if (searchValue === undefined) return;
    reportMatch(id, !isFiltered);
    return () => unregisterMatch(id);
  }, [id, isFiltered, searchValue, reportMatch, unregisterMatch]);

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

  if (isFiltered) {
    return (
      <div aria-hidden="true" style={{ display: 'none' }}>
        <div className="dropdown-item">
          <div className="d-flex gap-8 align-items-center">
            {icon}
            {children}
          </div>
        </div>
      </div>
    );
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
      <div className="d-flex gap-8 align-items-center">
        {icon}
        {children}
      </div>
    </div>
  );
};

DropdownItem.displayName = 'Dropdown.Item';

export default DropdownItem;
