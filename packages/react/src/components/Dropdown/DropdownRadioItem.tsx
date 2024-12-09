import { ReactNode, useId } from 'react';

import clsx from 'clsx';

import { useDropdownContext } from './DropdownContext';
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
}

const DropdownRadioItem = ({
  children,
  value,
  model,
  onChange,
}: DropdownRadioItemProps) => {
  const { itemProps, itemRefs, isFocused } = useDropdownContext();
  const { onMenuItemKeyDown, onMenuItemMouseEnter } = itemProps;

  const id = useId();

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
      <div className="d-flex gap-8 align-items-center justify-content-between position-relative">
        {children}
        <Radio
          {...radioProps}
          className="position-absolute start-0 end-0 top-0 bottom-0 opacity-0"
        />
      </div>
    </div>
  );
};

DropdownRadioItem.displayName = 'Dropdown.RadioItem';

export default DropdownRadioItem;
