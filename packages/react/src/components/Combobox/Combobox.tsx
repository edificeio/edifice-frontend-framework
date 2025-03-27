import { ChangeEvent, Fragment, ReactNode, useEffect, useState } from 'react';

import { useTranslation } from 'react-i18next';

import { Dropdown } from '../Dropdown';
import { Loading } from '../Loading';
import ComboboxTrigger from './ComboboxTrigger';

export interface ComboboxProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  onSearchResultsChange: (model: (string | number)[]) => void;
  onSearchInputChange: (event: ChangeEvent<HTMLInputElement>) => void;
  options: OptionListItemType[];
  value: string;
  isLoading: boolean;
  noResult: boolean;
  searchMinLength?: number;
  placeholder?: string;
  variant?: 'outline' | 'ghost';
  renderInputGroup?: ReactNode;
  renderListItem?: (item: OptionListItemType) => ReactNode;
  renderSelectedItems?: ReactNode;
}

export interface OptionListItemType {
  /**
   * Value
   */
  value: string | number;
  /**
   * Label
   */
  label?: string;
  /**
   * Add an icon
   */
  icon?: any;
  /**
   * Display Separator or not
   */
  withSeparator?: boolean;
}
/**
 * A component that combines an input field with a dropdown list of selectable options.
 *
 * @component
 * @example
 * ```tsx
 * <Combobox
 *   onSearchResultsChange={(values) => console.log(values)}
 *   onSearchInputChange={(e) => console.log(e.target.value)}
 *   options={[{ value: '1', label: 'Option 1' }]}
 *   value=""
 *   isLoading={false}
 *   noResult={false}
 * />
 * ```
 *
 * @param props - The component props
 * @param props.onSearchResultsChange - Callback fired when the selected values change
 * @param props.onSearchInputChange - Callback fired when the search input value changes
 * @param props.options - Array of options to display in the dropdown
 * @param props.value - Current value of the search input
 * @param props.isLoading - Whether the component is in a loading state
 * @param props.noResult - Whether to show a "no results" message
 * @param props.searchMinLength - Minimum number of characters required to trigger search
 * @param props.placeholder - Placeholder text for the input field
 * @param props.variant - Visual variant of the input ('outline' or 'ghost')
 * @param props.renderInputGroup - Custom render function for the input group
 * @param props.renderListItem - Custom render function for each option item
 * @param props.renderSelectedItems - Custom render function for selected items
 *
 * @extends {React.InputHTMLAttributes<HTMLInputElement>}
 */
const Combobox = ({
  onSearchResultsChange,
  onSearchInputChange,
  options,
  value,
  isLoading,
  noResult,
  searchMinLength,
  placeholder,
  variant = 'outline',
  renderInputGroup,
  renderListItem,
  renderSelectedItems,
}: ComboboxProps) => {
  const { t } = useTranslation();

  const [localValue, setLocalValue] = useState<(string | number)[]>([]);

  useEffect(() => {
    onSearchResultsChange(localValue);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localValue]);

  const handleOptionClick = (value: string | number) => {
    setLocalValue([value]);
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="d-flex align-items-center p-4">
          <Loading isLoading={isLoading} />
          <span className="ps-4">{t('explorer.search.pending')}</span>
        </div>
      );
    }

    if (noResult) {
      return <div className="p-4">{t('portal.no.result')}</div>;
    }

    return options.map((option, index) => (
      <Fragment key={index}>
        <Dropdown.Item
          type="select"
          icon={option.icon}
          onClick={() => handleOptionClick(option.value)}
        >
          {renderListItem ? renderListItem(option) : option.label}
        </Dropdown.Item>

        {(option.withSeparator || option.withSeparator === undefined) &&
          index < options.length - 1 && <Dropdown.Separator />}
      </Fragment>
    ));
  };

  return (
    <Dropdown block>
      <Combobox.Trigger
        placeholder={placeholder}
        searchMinLength={searchMinLength}
        handleSearchInputChange={onSearchInputChange}
        value={value}
        renderInputGroup={renderInputGroup}
        variant={variant}
        renderSelectedItems={renderSelectedItems}
      />
      <Dropdown.Menu>{renderContent()}</Dropdown.Menu>
    </Dropdown>
  );
};

Combobox.Trigger = ComboboxTrigger;
Combobox.displayName = 'Combobox';

export default Combobox;
