import clsx from 'clsx';
import { useTranslation } from 'react-i18next';

import illuEmptyArticles from '@edifice.io/bootstrap/dist/images/homepage/illu-rss-empty-articles.svg';
import illuError from '@edifice.io/bootstrap/dist/images/homepage/illu-rss-error.svg';
import illuEmptyFeeds from '@edifice.io/bootstrap/dist/images/homepage/illu-empty-useful-links.png';
import {
  ButtonBeta as Button,
  Image,
  Skeleton,
  VisuallyHidden,
} from '../../../../components';
import { useDate } from '../../../../hooks';
import { IconEdit, IconPlus } from '../../../icons/components';
import { HomeCard } from '../HomeCard';
import { RssArticle, RssArticlesStatus, RssFeed } from './types';
import { htmlToText } from './utils';

export interface RssProps {
  feeds: RssFeed[];
  isLoading?: boolean;
  selectedIndex: number;
  onSelectFeed: (index: number) => void;
  articles: RssArticle[];
  articlesStatus: RssArticlesStatus;
  onEditClick: () => void;
}

export function Rss({
  feeds,
  isLoading = false,
  selectedIndex,
  onSelectFeed,
  articles,
  articlesStatus,
  onEditClick,
}: RssProps) {
  const { t } = useTranslation();
  const { formatDate } = useDate();

  const hasFeeds = feeds.length > 0;

  if (isLoading) {
    return (
      <HomeCard
        variant="primary"
        className="rss-widget--skeleton"
        role="status"
        aria-busy="true"
      >
        <VisuallyHidden>{t('homepage.widget.loading')}</VisuallyHidden>
        <div className="rss-widget__header-skeleton">
          <Skeleton className="rss-widget__title-skeleton" />
          <Skeleton
            variant="circle"
            tone="strong"
            className="rss-widget__button-skeleton"
          />
        </div>
        <Skeleton variant="block" className="rss-widget__content-skeleton" />
      </HomeCard>
    );
  }

  const renderArticles = () => {
    if (articlesStatus === 'loading') {
      return (
        <div role="status" aria-busy="true" data-testid="rss-skeleton">
          <VisuallyHidden>{t('homepage.widget.loading')}</VisuallyHidden>
          <Skeleton variant="block" className="rss-widget__loading-skeleton" />
        </div>
      );
    }

    if (articlesStatus === 'error') {
      return (
        <div className="rss-widget__state">
          <div className="rss-widget__state-illustration">
            <Image
              src={illuError}
              alt=""
              aria-hidden="true"
              className="rss-widget__error-image"
            />
          </div>
          <p className="rss-widget__state-text">
            {t('homepage.widget.rss.error')}
          </p>
        </div>
      );
    }

    if (articles.length === 0) {
      return (
        <div className="rss-widget__state">
          <Image
            src={illuEmptyArticles}
            alt=""
            aria-hidden="true"
            className="rss-widget__empty-articles-image"
          />
          <p className="rss-widget__state-text">
            {t('homepage.widget.rss.noArticles')}
          </p>
        </div>
      );
    }

    return (
      <div className="rss-widget__articles">
        {articles.map((article, index) => (
          <a
            key={`${article.link}-${index}`}
            href={article.link}
            target="_blank"
            rel="noopener noreferrer"
            className="rss-widget__article"
            data-testid={`rss-link-article-${index}`}
          >
            <span className="rss-widget__article-title">{article.title}</span>
            {article.pubDate && (
              <span className="rss-widget__article-date">
                {formatDate(new Date(article.pubDate), 'dddd D MMMM YYYY')}
              </span>
            )}
            {article.description && (
              <span className="rss-widget__article-description">
                {htmlToText(article.description)}
              </span>
            )}
          </a>
        ))}
      </div>
    );
  };

  return (
    <HomeCard variant="primary">
      <div className="rss-widget__header">
        <h3 className="rss-widget__title">{t('homepage.widget.rss.title')}</h3>
        {hasFeeds ? (
          <Button
            type="button"
            variant="ghost"
            color="tertiary"
            leftIcon={<IconEdit />}
            aria-label={t('homepage.widget.rss.edit')}
            data-testid="rss-button-edit"
            onClick={onEditClick}
          />
        ) : (
          <Button
            type="button"
            variant="ghost"
            color="tertiary"
            size="sm"
            rightIcon={<IconPlus />}
            data-testid="rss-button-add"
            onClick={onEditClick}
          >
            {t('homepage.widget.rss.add')}
          </Button>
        )}
      </div>
      <HomeCard.Content>
        <div className="rss-widget">
          {!hasFeeds && (
            <div className="rss-widget__empty">
              <Image
                src={illuEmptyFeeds}
                alt=""
                aria-hidden="true"
                className="rss-widget__empty-image"
              />
              <p className="rss-widget__state-text">
                {t('homepage.widget.rss.empty')}
              </p>
            </div>
          )}

          {hasFeeds && (
            <div
              className="rss-widget__feeds"
              role="group"
              aria-label={t('homepage.widget.rss.feeds')}
            >
              {feeds.map((feed, index) => (
                <button
                  key={`${feed.link}-${index}`}
                  type="button"
                  className={clsx('rss-widget__chip', {
                    'rss-widget__chip-active': index === selectedIndex,
                  })}
                  aria-pressed={index === selectedIndex}
                  data-testid={`rss-button-feed-${index}`}
                  onClick={() => onSelectFeed(index)}
                >
                  {feed.title}
                </button>
              ))}
            </div>
          )}

          {hasFeeds && renderArticles()}
        </div>
      </HomeCard.Content>
    </HomeCard>
  );
}
