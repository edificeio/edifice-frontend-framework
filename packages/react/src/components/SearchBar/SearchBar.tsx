import clsx from 'clsx';
import { ChangeEvent, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { IconClose, IconSearch } from '../../modules/icons/components';
import { Size } from '../../types';
import { SearchButton } from '../Button';
import FormControl from '../Form/FormControl';

/**
 * Base props shared by both SearchBar variants
 */
interface BaseProps extends Omit<
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
type Props = DefaultSearchBar | DynamicSearchBar;
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
  clearable = true,
  ...restProps
}: SearchBarProps) => {
  const { t } = useTranslation();

  // Compute input classes
  const input = 'searchbar__input';

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

  const inputRef = useRef<HTMLInputElement>(null);

  // Track whether the field holds text, whatever its source: `value`
  // (controlled), `defaultValue` or user typing (uncontrolled).
  const isControlled = value !== undefined;
  const [hasUncontrolledText, setHasUncontrolledText] = useState(
    Boolean(restProps.defaultValue?.toString()),
  );
  const hasText = isControlled ? Boolean(value) : hasUncontrolledText;

  // Focus is tracked on the whole pill (input, clear and submit buttons), so
  // moving between them doesn't count as leaving the field.
  const [isFocused, setIsFocused] = useState(false);
  const handleBlur = (e: React.FocusEvent<HTMLDivElement>) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
      setIsFocused(false);
    }
  };
  // Keep focus in the input when pressing one of the pill's buttons:
  // otherwise the input's blur would disable the submit button right
  // before its click lands (Safari doesn't focus buttons on click).
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest('button')) e.preventDefault();
  };

  // Submit button and border are "active" while the field is focused or
  // holds text; both go back to their idle state otherwise. The idle state
  // is purely visual (`searchbar--active`, see components/_search-bar.scss),
  // not `disabled`, so legacy themes can keep the button clickable.
  const isActive = isFocused || hasText;

  // Compute wrapper classes
  const searchbar = clsx(
    'searchbar',
    `searchbar--${size}`,
    { 'searchbar--active': isActive },
    className,
  );

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!isControlled) setHasUncontrolledText(Boolean(e.target.value));
    onChange?.(e);
  };

  return (
    <FormControl
      id="search-bar"
      className={searchbar}
      onFocus={() => setIsFocused(true)}
      onBlur={handleBlur}
      onMouseDown={handleMouseDown}
    >
      {/* Dynamic search icon on the left (only in dynamic variant) */}
      {isVariant && (
        <div className="searchbar__icon">
          <IconSearch width={20} height={20} />
        </div>
      )}

      <FormControl.Input
        ref={inputRef}
        type="search"
        placeholder={t(placeholder)}
        size={size}
        className={input}
        onChange={handleChange}
        value={value}
        disabled={disabled}
        onKeyDown={handleKeyDown}
        clearable={clearable}
        {...restProps}
      />

      {/* Default submit button when not in variant mode */}
      {!isVariant && (
        <SearchButton
          type="submit"
          aria-label={t('search')}
          icon={<IconSearch />}
          onClick={handleClick}
          disabled={buttonDisabled || disabled}
        />
      )}
    </FormControl>
  );
};

SearchBar.displayName = 'SearchBar';
export default SearchBar;
