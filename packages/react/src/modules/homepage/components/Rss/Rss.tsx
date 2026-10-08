import clsx from 'clsx';
import { useTranslation } from 'react-i18next';

import illuEmptyArticles from '@edifice.io/bootstrap/dist/images/homepage/illu-rss-empty-articles.svg';
import illuError from '@edifice.io/bootstrap/dist/images/homepage/illu-rss-error.svg';
import illuEmptyFeeds from '@edifice.io/bootstrap/dist/images/homepage/illu-empty-useful-links.png';
import { ButtonBeta, Image, TextSkeleton } from '../../../../components';
import { useDate } from '../../../../hooks';
import { IconEdit, IconPlus } from '../../../icons/components';
import { HomeCard } from '../HomeCard';
import { RssArticle, RssArticlesStatus, RssFeed } from './types';
import { htmlToText } from './utils';

const SKELETON_ARTICLES = [0, 1, 2];

export interface RssProps {
  feeds: RssFeed[];
  /** True while the user's feeds are being fetched. */
  isLoading?: boolean;
  selectedIndex: number;
  onSelectFeed: (index: number) => void;
  /** Articles of the selected feed. */
  articles: RssArticle[];
  articlesStatus: RssArticlesStatus;
  /** Opens the feeds management modal. */
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

  const renderArticles = (status: RssArticlesStatus) => {
    if (status === 'loading') {
      return (
        <div className="rss-widget__articles" data-testid="rss-skeleton">
          {SKELETON_ARTICLES.map((key) => (
            <div key={key} className="rss-widget__article" aria-hidden="true">
              <TextSkeleton className="rss-widget__skeleton-title" />
              <TextSkeleton size="xs" className="rss-widget__skeleton-date" />
              <TextSkeleton size="sm" />
              <TextSkeleton size="sm" />
            </div>
          ))}
        </div>
      );
    }

    if (status === 'error') {
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
            <span className="rss-widget__article-date">
              {formatDate(new Date(article.pubDate), 'dddd D MMMM YYYY')}
            </span>
            <span className="rss-widget__article-description">
              {htmlToText(article.description)}
            </span>
          </a>
        ))}
      </div>
    );
  };

  return (
    <HomeCard variant="primary">
      <div className="rss-widget__header">
        <h3 className="rss-widget__title">{t('homepage.widget.rss.title')}</h3>
        {!isLoading &&
          (hasFeeds ? (
            <ButtonBeta
              type="button"
              variant="ghost"
              color="tertiary"
              leftIcon={<IconEdit />}
              aria-label={t('homepage.widget.rss.edit')}
              data-testid="rss-button-edit"
              onClick={onEditClick}
            />
          ) : (
            <ButtonBeta
              type="button"
              variant="ghost"
              color="tertiary"
              size="sm"
              rightIcon={<IconPlus />}
              data-testid="rss-button-add"
              onClick={onEditClick}
            >
              {t('homepage.widget.rss.add')}
            </ButtonBeta>
          ))}
      </div>
      <HomeCard.Content>
        <div className="rss-widget">
          {!isLoading && !hasFeeds && (
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

          {!isLoading && hasFeeds && (
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

          {(isLoading || hasFeeds) &&
            renderArticles(isLoading ? 'loading' : articlesStatus)}
        </div>
      </HomeCard.Content>
    </HomeCard>
  );
}
