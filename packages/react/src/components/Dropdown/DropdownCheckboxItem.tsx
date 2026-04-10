import { ReactNode, useId, useLayoutEffect } from 'react';

import clsx from 'clsx';

import { useDropdownContext } from './DropdownContext';
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
  const {
    itemProps,
    itemRefs,
    isFocused,
    searchQuery,
    reportMatch,
    unregisterMatch,
  } = useDropdownContext();
  const id = useId();

  const { onMenuItemKeyDown, onMenuItemMouseEnter } = itemProps;

  const isFiltered =
    searchValue !== undefined &&
    searchQuery !== '' &&
    !searchValue.toLowerCase().includes(searchQuery.toLowerCase());

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

  useLayoutEffect(() => {
    if (searchValue === undefined) return;
    reportMatch(id, !isFiltered);
    return () => unregisterMatch(id);
  }, [id, isFiltered, searchValue, reportMatch, unregisterMatch]);

  if (isFiltered) {
    return (
      <div
        aria-hidden="true"
        style={{
          visibility: 'hidden',
          height: 0,
          overflow: 'hidden',
          pointerEvents: 'none',
        }}
      >
        <div className="dropdown-item">
          <div className="d-flex gap-8 align-items-center justify-content-between position-relative">
            {children}
          </div>
        </div>
      </div>
    );
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
      <div className="d-flex gap-8 align-items-center justify-content-between position-relative">
        {children}
        <Checkbox {...checkboxProps} />
      </div>
    </div>
  );
};

DropdownCheckboxItem.displayName = 'Dropdown.CheckboxItem';

export default DropdownCheckboxItem;
