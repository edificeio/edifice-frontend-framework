import { useEffect, useState } from "react";

import { useTranslation } from "react-i18next";

import SelectTrigger from "./SelectTrigger";
import Dropdown, { DropdownProps } from "../Dropdown/Dropdown";
import { DropdownTriggerProps } from "../Dropdown/DropdownTrigger";

export interface OptionsType {
  /**
   * Select Option Value
   */
  value: string;
  /**
   * Option Option Label
   */
  label: string;
  /**
   * Icon Left Options
   */
  icon?: JSX.Element;
}

export interface SelectProps
  extends Omit<DropdownProps, "children">,
    Omit<DropdownTriggerProps, "badgeContent"> {
  /**
   * Default select label
   */
  placeholderOption: string;
  /**
   * Select options
   * */
  options: OptionsType[] | string[];
  /**
   * Callback to get value
   */
  onValueChange?: (option: OptionsType | string) => void;
}

/**
 *
 * Select component is based on Dropdown Component. It extends `Dropdown` and `Dropdown.Trigger` props `block`, `overflow`, `icon`, `variant`, `size`, `disabled`
 */

const Select = ({
  icon,
  options,
  overflow,
  block,
  variant,
  size,
  disabled,
  placeholderOption,
  onValueChange,
}: SelectProps) => {
  const [localValue, setLocalValue] = useState<OptionsType | string>();

  const { t } = useTranslation();

  useEffect(() => {
    if (localValue) {
      const value =
        typeof localValue === "object" ? localValue.value : localValue;
      onValueChange?.(value);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localValue]);

  const label = typeof localValue === "object" ? localValue.label : localValue;
  const iconChange =
    typeof localValue === "object" ? localValue.icon : undefined;

  return (
    <Dropdown overflow={overflow} block={block}>
      <SelectTrigger
        icon={iconChange || icon}
        label={t(label || placeholderOption)}
        variant={variant}
        size={size}
        disabled={disabled}
      />
      <Dropdown.Menu role="listbox">
        {options?.map((option) => {
          const value = typeof option === "object" ? option.value : option;
          const label = typeof option === "object" ? option.label : option;
          const icon = typeof option === "object" ? option.icon : undefined;
          return (
            <Dropdown.Item
              type="action"
              key={value}
              onClick={() => setLocalValue(option)}
              icon={icon}
            >
              {label}
            </Dropdown.Item>
          );
        })}
      </Dropdown.Menu>
    </Dropdown>
  );
};

Select.displayName = "Select";

export default Select;
