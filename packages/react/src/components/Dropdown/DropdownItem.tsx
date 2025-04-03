import { ReactNode, useId } from 'react';

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
   * Disabled status
   */
  disabled?: boolean;
}

const DropdownItem = ({
  type = 'action',
  icon,
  onClick,
  children,
  className,
  disabled,
  ...restProps
}: DropdownItemProps) => {
  const { itemProps, itemRefs, isFocused } = useDropdownContext();
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

  const id = useId();

  const dropdownItem = clsx(
    'dropdown-item',
    {
      focus: isFocused === id,
    },
    { 'text-gray-600': disabled },
    className,
  );

  return (
    <div
      id={id}
      role="menuitem"
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
