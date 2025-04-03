import { ChangeEvent, MouseEvent, ReactNode, useEffect } from 'react';

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
  hasDefault?: boolean;
}
/**
 * A trigger component for the Combobox that handles user input and displays selected items.
 *
 * @component
 * @example
 * ```tsx
 * <ComboboxTrigger
 *   value={searchValue}
 *   handleSearchInputChange={(e) => setSearchValue(e.target.value)}
 *   placeholder="Search..."
 * />
 * ```
 *
 * @param {object} props - Component props
 * @param {string} [props.placeholder] - Placeholder text for the search input
 * @param {string} [props.value=''] - Current value of the search input
 * @param {number} [props.searchMinLength=3] - Minimum number of characters required before showing dropdown
 * @param {(event: ChangeEvent<HTMLInputElement>) => void} props.handleSearchInputChange - Handler for input change events
 * @param {ReactNode} [props.renderInputGroup] - Optional content to render in the input group (e.g., icons)
 * @param {'outline' | 'ghost'} [props.variant='outline'] - Visual variant of the input
 * @param {ReactNode} [props.renderSelectedItems] - Optional content to render selected items
 *
 * @returns {JSX.Element} A form control containing an input field with optional input group and selected items
 */
const ComboboxTrigger = ({
  placeholder,
  value = '',
  searchMinLength = 3,
  handleSearchInputChange,
  renderInputGroup,
  variant = 'outline',
  renderSelectedItems,
  hasDefault,
}: ComboboxTriggerProps) => {
  const { triggerProps, itemProps, setVisible } = useDropdownContext();

  const containerProps: Record<string, any> = {
    ...triggerProps,
    className: clsx(
      'd-flex align-items-center flex-wrap combobox-trigger',
      renderInputGroup ? 'input-group' : '',
      triggerProps.className,
    ),
    onClick: (event: MouseEvent) => {
      event.stopPropagation();
    },
  };
  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    handleSearchInputChange(event);
    setVisible(event.target.value.length >= searchMinLength);
  };
  const inputProps: Record<string, any> = {
    role: 'combobox',
    onChange: handleSearchChange,
    onClick: (event: MouseEvent<HTMLInputElement>) => {
      setVisible(
        (event.target as HTMLInputElement).value.length >= searchMinLength ||
          !!hasDefault,
      );
      (event.target as HTMLInputElement).focus();
    },
  };

  const classNameVariant = variant === 'ghost' ? ' border-0' : '';
  const classNameInput = clsx(
    classNameVariant,
    renderSelectedItems ? ' w-auto ' : '',
  );

  useEffect(() => {
    setVisible(value.length >= searchMinLength);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, searchMinLength]);

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
