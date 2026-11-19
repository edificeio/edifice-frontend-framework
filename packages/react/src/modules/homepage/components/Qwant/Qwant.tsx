import illuQwant from '@edifice.io/bootstrap/dist/images/homepage/illu-qwant.png';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ButtonBeta as Button,
  Image,
  SearchBar,
  Skeleton,
  VisuallyHidden,
} from '../../../../components';
import SvgIconExternalLink from '../../../../modules/icons/components/IconExternalLink';
import { HomeCard } from '../HomeCard';

export interface QwantProps {
  handleActionClick: () => void;
  handleSearch: (query: string) => void;
  isLoading?: boolean;
}

export default function Qwant({
  handleActionClick,
  handleSearch,
  isLoading = false,
}: QwantProps) {
  const { t } = useTranslation();
  const [query, setQuery] = useState('');

  if (isLoading) {
    return (
      <HomeCard
        variant="primary"
        className="qwant--skeleton"
        role="status"
        aria-busy="true"
      >
        <VisuallyHidden>{t('homepage.widget.loading')}</VisuallyHidden>
        <div className="qwant__header-skeleton">
          <Skeleton className="qwant__title-skeleton" />
          <Skeleton
            variant="circle"
            tone="strong"
            className="qwant__button-skeleton"
          />
        </div>
        <Skeleton variant="block" className="qwant__content-skeleton" />
      </HomeCard>
    );
  }

  const handleSubmit = () => {
    const trimmedQuery = query.trim();
    if (trimmedQuery) handleSearch(trimmedQuery);
  };

  return (
    <HomeCard variant="primary">
      <div className="qwant__header">
        <h3 className="qwant__title">{t('homepage.widget.qwant.title')}</h3>
        <Button
          className="qwant__header-button"
          data-testid="qwant-button-open"
          aria-label={t('homepage.widget.qwant.open')}
          onClick={handleActionClick}
          leftIcon={<SvgIconExternalLink />}
          variant="ghost"
          color="tertiary"
        />
      </div>

      <HomeCard.Content>
        <div className="qwant">
          <div className="qwant__intro">
            <Image src={illuQwant} alt="Qwant" className="qwant__logo" />
            <p className="qwant__description">
              {t('homepage.widget.qwant.description')}
            </p>
          </div>
          <SearchBar
            isVariant={false}
            id="qwant-search-input"
            className="qwant__search"
            placeholder="search"
            aria-label={t('search')}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onClick={handleSubmit}
            maxLength={255}
            data-testid="qwant-search-input"
          />
        </div>
      </HomeCard.Content>
    </HomeCard>
  );
}
