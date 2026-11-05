import illuUniversalis from '@edifice.io/bootstrap/dist/images/homepage/illu-universalis-logo.svg';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { SearchBar } from '../../../../../components';

export const UNIVERSALIS_HOME_URL = 'http://www.universalis-edu.com';
export const UNIVERSALIS_SEARCH_URL =
  'https://www.universalis-edu.com/nomade/precherche/';
const UNIVERSALIS_ENGINE_PARAM = 'www';

export interface MediacentreUniversalisSearchProps {
  uai?: string;
}

export function MediacentreUniversalisSearch({
  uai,
}: MediacentreUniversalisSearchProps) {
  const { t } = useTranslation();
  const [query, setQuery] = useState('');

  const disabled = !uai;
  const placeholder = disabled
    ? t('homepage.widget.mediacentre.universalis.noUai')
    : t('homepage.widget.mediacentre.universalis.search');

  const handleSearch = () => {
    if (!uai || !query.trim()) return;
    const params = new URLSearchParams({
      r: UNIVERSALIS_ENGINE_PARAM,
      uai,
      q: query.trim(),
    });
    window.open(
      `${UNIVERSALIS_SEARCH_URL}?${params.toString()}`,
      '_blank',
      'noopener,noreferrer',
    );
  };

  return (
    <div className="mediacentre__universalis">
      <a
        href={UNIVERSALIS_HOME_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="mediacentre__universalis-logo"
        data-testid="mediacentre-universalis-link"
      >
        <img src={illuUniversalis} alt="Universalis Éducation" />
      </a>
      <SearchBar
        isVariant={false}
        id="mediacentre-universalis-search-input"
        className="mediacentre__universalis-search"
        placeholder={placeholder}
        aria-label={placeholder}
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        onClick={handleSearch}
        disabled={disabled}
        maxLength={255}
        data-testid="mediacentre-universalis-search-input"
      />
    </div>
  );
}
