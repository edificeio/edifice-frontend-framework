import { ChangeEvent } from 'react';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';

import { IconSearch, IconClose } from '../../modules/icons/components';
import { Size } from '../../types';
import { SearchButton } from '../Button';
import FormControl from '../Form/FormControl';

export interface BaseProps {
  placeholder?: string;
  size?: Exclude<Size, 'sm'>;
  disabled?: boolean;
  className?: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  value?: string;
  clearable?: boolean; // Show a clear button when value is present (only works with isVariant)
}

type DefaultSearchBar = {
  isVariant: false;
  onClick: () => void;
};

type DynamicSearchBar = {
  isVariant: true;
  onClick?: undefined;
};

export type Props = DefaultSearchBar | DynamicSearchBar;
export type SearchBarProps = BaseProps & Props;

const SearchBar = ({
  isVariant = false,
  size = 'md',
  placeholder = 'search',
  className,
  disabled,
  onChange,
  onClick,
  value,
  clearable = false,
  ...restProps
}: SearchBarProps) => {
  const { t } = useTranslation();

  const searchbar = clsx(className, {
    'input-group': !isVariant,
    'position-relative': isVariant,
  });

  const input = clsx({
    'border-end-0': !isVariant,
    'ps-48': isVariant,
    'searchbar-hide-native-clear': isVariant && clearable,
  });

  const handleClick = () => {
    onClick?.();
  };

  const handleClear = () => {
    const event = {
      target: { value: '' },
    } as ChangeEvent<HTMLInputElement>;
    onChange?.(event);
  };

  return (
    <FormControl id="search-bar" className={searchbar}>
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
        {...restProps}
      />

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

      {!isVariant && (
        <SearchButton
          type="submit"
          aria-label={t('search')}
          icon={<IconSearch />}
          className="border-start-0"
          onClick={handleClick}
        />
      )}
    </FormControl>
  );
};

SearchBar.displayName = 'SearchBar';
export default SearchBar;
