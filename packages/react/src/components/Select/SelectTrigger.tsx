import { RefAttributes } from 'react';

import { JSX } from 'react/jsx-runtime';

import Dropdown from '../Dropdown/Dropdown';
import { DropdownTriggerProps } from '../Dropdown/DropdownTrigger';

const SelectTrigger = (
  props: JSX.IntrinsicAttributes &
    Omit<DropdownTriggerProps, 'ref'> &
    RefAttributes<HTMLButtonElement>,
) => {
  return (
    <Dropdown.Trigger {...props} aria-haspopup="listbox" role="combobox" />
  );
};

SelectTrigger.displayName = 'SelectTrigger';
export default SelectTrigger;
