import { ChangeEvent, useEffect } from "react";

import { useDropdownContext } from "../Dropdown/DropdownContext";
import { FormControl } from "../Form";
import Input from "../Input/Input";

export interface ComboboxTriggerProps
  extends React.ComponentPropsWithRef<"button"> {
  handleSearchInputChange: (event: ChangeEvent<HTMLInputElement>) => void;
  value: string;
  searchMinLength?: number;
  placeholder?: string;
}

const ComboboxTrigger = ({
  placeholder,
  value = "",
  searchMinLength = 3,
  handleSearchInputChange,
}: ComboboxTriggerProps) => {
  const { triggerProps, itemProps, setVisible } = useDropdownContext();

  const inputProps: Record<string, any> = {
    ...triggerProps,
    role: "combobox",
    onClick: () => {
      if (value.length >= searchMinLength) {
        setVisible(true);
      }
    },
    onChange: handleSearchInputChange,
  };

  useEffect(() => {
    setVisible(value.length >= searchMinLength);
  }, [setVisible, value, searchMinLength]);

  return (
    <FormControl className="d-flex align-items-center" id="search">
      <Input
        {...inputProps}
        className="max-w-512"
        noValidationIcon
        placeholder={placeholder}
        size="md"
        type="search"
        onKeyDown={itemProps.onMenuItemKeyDown}
      />
    </FormControl>
  );
};

export default ComboboxTrigger;
