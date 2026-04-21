import { ReactNode } from 'react';

import clsx from 'clsx';

import { useDropdownContext } from './DropdownContext';
import { useDropdownItemFilter } from './useDropdownItemFilter';
import DropdownItemHidden from './DropdownItemHidden';
import { Checkbox } from '../Checkbox';

interface DropdownCheckboxItem {
  /**
   * Children Node
   */
  children: ReactNode;
  /**
   * Value
   */
  value: string | number;
  /**
   * Model
   */
  model: (string | number)[];
  /**
   * OnKeyDown handler
   */
  onChange: (value: string | number) => void;
  /**
   * Value used to filter this item when `Dropdown.SearchInput` is present.
   * If provided, the item is hidden when the search query doesn't match.
   */
  searchValue?: string;
}

const DropdownCheckboxItem = ({
  children,
  value,
  model,
  onChange,
  searchValue,
}: DropdownCheckboxItem) => {
  const { itemProps, itemRefs, isFocused } = useDropdownContext();
  const { id, isFiltered } = useDropdownItemFilter(searchValue);

  const { onMenuItemKeyDown, onMenuItemMouseEnter } = itemProps;

  const checked = model.includes(value);

  const checkboxProps = {
    value,
    model,
    checked,
    readOnly: true,
  };

  const dropdownCheckboxItem = clsx('dropdown-item c-pointer', {
    focus: isFocused === id,
  });

  const content = (
    <div className="d-flex gap-8 align-items-center justify-content-between position-relative">
      {children}
      <Checkbox {...checkboxProps} />
    </div>
  );

  if (isFiltered) {
    return <DropdownItemHidden collapse>{content}</DropdownItemHidden>;
  }

  return (
    <div
      id={id}
      ref={(el) => (itemRefs.current[id] = el)}
      role="menuitemcheckbox"
      aria-checked={checked}
      onMouseUp={() => onChange(value)}
      onKeyDown={(event) => onMenuItemKeyDown(event, () => onChange(value))}
      onMouseEnter={onMenuItemMouseEnter}
      tabIndex={checked ? 0 : -1}
      className={dropdownCheckboxItem}
    >
      {content}
    </div>
  );
};

DropdownCheckboxItem.displayName = 'Dropdown.CheckboxItem';

export default DropdownCheckboxItem;
