import { ChangeEvent } from 'react';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';

import { IconSearch, IconClose } from '../../modules/icons/components';
import { Size } from '../../types';
import { SearchButton } from '../Button';
import FormControl from '../Form/FormControl';

/**
 * Base props shared by both SearchBar variants
 */
export interface BaseProps extends Omit<
  React.ComponentPropsWithoutRef<'input'>,
  'size'
> {
  /**
   * String or template literal key for i18next translation
   */
  placeholder?: string;

  /**
   * Control SearchBar size (excluding 'sm')
   */
  size?: Exclude<Size, 'sm'>;

  /**
   * Disable the input
   */
  disabled?: boolean;

  /**
   * Disabled status for button
   */
  buttonDisabled?: boolean;
  /**
   * Optional class for styling purpose
   * Optional class for custom styling
   */
  className?: string;

  /**
   * onChange handler for input changes
   */
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;

  /**
   * Current value of the input
   */
  value?: string;

  /**
   * Show a clear (reset) button when value is present
   */
  clearable?: boolean;
}

/**
 * Default SearchBar with a submit button
 */
type DefaultSearchBar = {
  /**
   * Use false to render the default SearchBar (with a button)
   */
  isVariant: false;

  /**
   * Callback when clicking the search button
   */
  onClick: () => void;
};

/**
 * Dynamic SearchBar with icon and no submit button
 */
type DynamicSearchBar = {
  /**
   * Use true to render the dynamic SearchBar (with an icon inside input)
   */
  isVariant: true;

  /**
   * onClick must be undefined for dynamic variant
   */
  onClick?: undefined;
};

/**
 * Props for the SearchBar component
 */
export type Props = DefaultSearchBar | DynamicSearchBar;
export type SearchBarProps = BaseProps & Props;

/**
 * SearchBar component to handle dynamic or static search input
 */
const SearchBar = ({
  isVariant = false,
  size = 'md',
  placeholder = 'search',
  className,
  disabled,
  buttonDisabled,
  onChange,
  onClick,
  value,
  clearable = false,
  ...restProps
}: SearchBarProps) => {
  const { t } = useTranslation();

  // Compute wrapper classes
  const searchbar = clsx(className, {
    'input-group': !isVariant,
    'position-relative': isVariant,
  });

  // Compute input classes
  const input = clsx({
    'border-end-0': !isVariant,
    'ps-48': isVariant,
    'searchbar-hide-native-clear': isVariant && clearable,
  });

  // Handle click on SearchButton (default variant only)
  const handleClick = () => {
    onClick?.();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleClick();
    }
  };

  // Handle clear/reset of input value
  const handleClear = () => {
    const event = {
      target: { value: '' },
    } as ChangeEvent<HTMLInputElement>;
    onChange?.(event);
  };

  return (
    <FormControl id="search-bar" className={searchbar}>
      {/* Dynamic search icon on the left (only in dynamic variant) */}
      {isVariant && (
        <div className="position-absolute z-1 top-50 start-0 translate-middle-y border-0 ps-12 bg-transparent">
          <IconSearch />
        </div>
      )}

      <FormControl.Input
        type="search"
        placeholder={t(placeholder)}
        size={size}
        noValidationIcon
        className={input}
        onChange={onChange}
        value={value}
        disabled={disabled}
        onKeyDown={handleKeyDown}
        {...restProps}
      />

      {/* Clear button when clearable is true and input has value */}
      {isVariant && clearable && value && onChange && (
        <button
          type="button"
          onClick={handleClear}
          className="position-absolute end-0 top-50 translate-middle-y pe-12 bg-transparent border-0"
          aria-label={t('clear')}
        >
          <IconClose className="color-gray" style={{ width: 12, height: 12 }} />
        </button>
      )}

      {/* Default submit button when not in variant mode */}
      {!isVariant && (
        <SearchButton
          type="submit"
          aria-label={t('search')}
          icon={<IconSearch />}
          className="border-start-0"
          onClick={handleClick}
          disabled={buttonDisabled}
        />
      )}
    </FormControl>
  );
};

SearchBar.displayName = 'SearchBar';
export default SearchBar;
