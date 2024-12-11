import { useId, useRef } from 'react';

import { useTranslation } from 'react-i18next';

import { FormControl, Popover, SearchButton } from '../../../components';
import { useHover } from '../../../hooks';
import IconSearch from '../../../modules/icons/components/nav/IconSearch';
import { NavItem } from '../components/NavItem';

const SearchEngine = () => {
  const [searchRef, isSearchHovered] = useHover<HTMLLIElement>();
  const inputRef = useRef<HTMLInputElement>(null);
  const popoverSearchId = useId();
  const { t } = useTranslation();

  function redirectToSearch() {
    if (inputRef.current) {
      const value = inputRef.current.value;
      window.location.href = `/searchengine#/${value}`;
    }
  }

  return (
    <NavItem
      id={popoverSearchId}
      ref={searchRef}
      className="position-relative"
      aria-haspopup="true"
      aria-expanded={isSearchHovered}
    >
      <a href="/searchengine" className="nav-link dropdown-item">
        <IconSearch className="icon search" />
        <span className="nav-text">{t('navbar.search')}</span>
      </a>
      <Popover
        id={popoverSearchId}
        isVisible={isSearchHovered}
        className="d-none d-md-flex"
      >
        <FormControl
          id="my-search-input"
          className="search-text input-group py-8 px-12"
        >
          <FormControl.Input
            ref={inputRef}
            size="sm"
            type="text"
            name="my-search-input"
            placeholder="Rechercher"
          />
          <SearchButton
            type="submit"
            size="sm"
            onClick={redirectToSearch}
            aria-label={t('navbar.search')}
          />
        </FormControl>
      </Popover>
    </NavItem>
  );
};

SearchEngine.displayName = 'SearchEngine';

export default SearchEngine;
