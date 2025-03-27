import { ChangeEvent, ReactNode, useEffect } from 'react';

import clsx from 'clsx';
import { useDropdownContext } from '../Dropdown/DropdownContext';
import { FormControl } from '../Form';
import Input from '../Input/Input';

export interface ComboboxTriggerProps
  extends React.ComponentPropsWithRef<'button'> {
  handleSearchInputChange: (event: ChangeEvent<HTMLInputElement>) => void;
  value: string;
  searchMinLength?: number;
  placeholder?: string;
  renderInputGroup?: React.ReactNode;
  variant?: 'outline' | 'ghost';
  renderSelectedItems?: ReactNode;
}

const ComboboxTrigger = ({
  placeholder,
  value = '',
  searchMinLength = 3,
  handleSearchInputChange,
  renderInputGroup,
  variant = 'outline',
  renderSelectedItems,
}: ComboboxTriggerProps) => {
  const { triggerProps, itemProps, setVisible } = useDropdownContext();

  const containerProps: Record<string, any> = {
    ...triggerProps,
    className: clsx(
      'd-flex align-items-center flex-wrap combobox-trigger',
      renderInputGroup ? 'input-group' : '',
      triggerProps.className,
    ),
  };
  const inputProps: Record<string, any> = {
    role: 'combobox',
    onClick: () => {
      if (value.length >= searchMinLength) {
        setVisible(true);
      } else {
        setVisible(false);
      }
    },
    onChange: handleSearchInputChange,
  };

  const classNameVariant = variant === 'ghost' ? ' border-0' : '';
  const classNameInput =
    (renderSelectedItems ? ' w-auto ' : '') + classNameVariant;

  useEffect(() => {
    setVisible(value.length >= searchMinLength);
  }, [setVisible, value, searchMinLength]);

  return (
    <FormControl id="search" {...containerProps}>
      {renderInputGroup ? (
        <span className={'input-group-text pe-0' + classNameVariant}>
          {renderInputGroup}
        </span>
      ) : null}
      {renderSelectedItems}
      <Input
        {...inputProps}
        className={classNameInput}
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
