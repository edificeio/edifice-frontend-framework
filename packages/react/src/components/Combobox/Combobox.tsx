import {
  ChangeEvent,
  forwardRef,
  Fragment,
  KeyboardEvent,
  ReactNode,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';

import { useTranslation } from 'react-i18next';

import { Dropdown } from '../Dropdown';
import { Loading } from '../Loading';
import ComboboxTrigger from './ComboboxTrigger';

export interface ComboboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onSearchInputChange: (event: ChangeEvent<HTMLInputElement>) => void;
  options: OptionListItemType[];
  value: string;
  isLoading: boolean;
  noResult: boolean;
  onFocus?: (event: ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (event: ChangeEvent<HTMLInputElement>) => void;
  onSearchResultsChange?: (model: (string | number)[]) => void;
  onSearchInputKeyUp?: (event: KeyboardEvent<HTMLInputElement>) => void;
  searchMinLength?: number;
  placeholder?: string;
  variant?: 'outline' | 'ghost';
  renderInputGroup?: ReactNode;
  renderList?: (items: OptionListItemType[]) => ReactNode;
  renderListItem?: (item: OptionListItemType) => ReactNode;
  renderSelectedItems?: ReactNode;
  renderNoResult?: ReactNode;
  hasDefault?: boolean;
}

export interface ComboboxRef {
  focus: () => void;
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
  /**
   * Disable option
   */
  disabled?: boolean;
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
 * @param props.onFocus - Callback fired when the input is focused
 * @param props.onBlur - Callback fired when the input is blured
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
 * @param props.renderList - Custom render function for the dropdown list
 * @param props.renderListItem - Custom render function for each option item
 * @param props.renderSelectedItems - Custom render function for selected items
 * @param props.renderNoResult - Custom render function for no results message
 * @param props.hasDefault - Whether to show default options
 *
 * @extends {React.InputHTMLAttributes<HTMLInputElement>}
 */
const ComboboxComponent = forwardRef<ComboboxRef, ComboboxProps>(
  (
    {
      onFocus,
      onBlur,
      onSearchResultsChange,
      onSearchInputChange,
      onSearchInputKeyUp,
      options,
      value,
      isLoading,
      noResult,
      searchMinLength,
      placeholder,
      variant = 'outline',
      renderInputGroup,
      renderList,
      renderListItem,
      renderSelectedItems,
      renderNoResult,
    }: ComboboxProps,
    ref,
  ) => {
    const { t } = useTranslation();
    const inputRef = useRef<HTMLInputElement>(null);

    const [localValue, setLocalValue] = useState<(string | number)[]>([]);

    useEffect(() => {
      onSearchResultsChange?.(localValue);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [localValue]);

    const focusInput = () => {
      inputRef.current?.focus();
    };

    const handleOptionClick = (value: string | number) => {
      setLocalValue([value]);
      focusInput();
    };

    useImperativeHandle(ref, () => ({
      focus: focusInput,
    }));

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
        if (renderNoResult) {
          return renderNoResult;
        }
        return <div className="p-4">{t('portal.no.result')}</div>;
      }

      if (renderList) {
        return renderList(options);
      }

      return options.map((option, index) => (
        <Fragment key={index}>
          <Dropdown.Item
            type="select"
            icon={option.icon}
            onClick={() => handleOptionClick(option.value)}
            disabled={option.disabled}
          >
            {renderListItem ? renderListItem(option) : option.label}
          </Dropdown.Item>

          {(option.withSeparator || option.withSeparator === undefined) &&
            index < options.length - 1 && <Dropdown.Separator />}
        </Fragment>
      ));
    };

    return (
      <Dropdown
        block
        focusOnVisible={false}
        openOnSpace={false}
        focusOnMouseEnter={false}
        onToggle={(open) => {
          if (!open && inputRef.current) {
            inputRef.current.value = '';
          }
        }}
      >
        <Combobox.Trigger
          placeholder={placeholder}
          searchMinLength={searchMinLength}
          handleSearchInputChange={onSearchInputChange}
          handleSearchInputKeyUp={(event) => {
            onSearchInputKeyUp?.(event);
          }}
          value={value}
          variant={variant}
          renderInputGroup={renderInputGroup}
          renderSelectedItems={renderSelectedItems}
          hasDefault={!!options.length}
          onFocus={onFocus}
          onBlur={onBlur}
          inputRef={inputRef}
        />
        <Dropdown.Menu data-testid="combobox-search-menu">
          {renderContent()}
        </Dropdown.Menu>
      </Dropdown>
    );
  },
);

// Create the Combobox object with Trigger
const Combobox = Object.assign(ComboboxComponent, {
  Trigger: ComboboxTrigger,
});
Combobox.displayName = 'Combobox';

export default Combobox;
