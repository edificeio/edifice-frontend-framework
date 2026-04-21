import { ReactNode } from 'react';

import clsx from 'clsx';

import { useDropdownContext } from './DropdownContext';
import { useDropdownItemFilter } from './useDropdownItemFilter';
import DropdownItemHidden from './DropdownItemHidden';
import { Radio } from '../Radio';

export interface DropdownRadioItemProps {
  /**
   * Children Node
   */
  children: ReactNode;

  /**
   * Item Value
   */
  value: string;

  /**
   * Item model
   */
  model: string;

  /**
   * onKeyDown, onMouseUp handlers
   */
  onChange: (value: string) => void;

  /**
   * Value used to filter this item when `Dropdown.SearchInput` is present.
   * If provided, the item is hidden when the search query doesn't match.
   */
  searchValue?: string;
}

const DropdownRadioItem = ({
  children,
  value,
  model,
  onChange,
  searchValue,
}: DropdownRadioItemProps) => {
  const { itemProps, itemRefs, isFocused } = useDropdownContext();
  const { id, isFiltered } = useDropdownItemFilter(searchValue);
  const { onMenuItemKeyDown, onMenuItemMouseEnter } = itemProps;

  const checked = value === model;

  const radioProps = {
    value,
    model,
    checked,
    readOnly: true,
  };

  const dropdownRadioItem = clsx('dropdown-item c-pointer', {
    focus: isFocused === id,
  });

  const content = (
    <div className="d-flex gap-8 align-items-center justify-content-between position-relative">
      {children}
      <Radio
        {...radioProps}
        className="position-absolute start-0 end-0 top-0 bottom-0 opacity-0"
      />
    </div>
  );

  if (isFiltered) {
    return <DropdownItemHidden>{content}</DropdownItemHidden>;
  }

  return (
    <div
      id={id}
      ref={(el) => (itemRefs.current[id] = el)}
      role="menuitemradio"
      aria-checked={value === model}
      onMouseUp={() => onChange(value)}
      onKeyDown={(event) => onMenuItemKeyDown(event, () => onChange(value))}
      onMouseEnter={onMenuItemMouseEnter}
      tabIndex={value === model ? 0 : -1}
      className={dropdownRadioItem}
    >
      {content}
    </div>
  );
};

DropdownRadioItem.displayName = 'Dropdown.RadioItem';

export default DropdownRadioItem;
