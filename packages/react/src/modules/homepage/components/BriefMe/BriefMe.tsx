import illuBriefMeError from '@edifice.io/bootstrap/dist/images/homepage/illu-briefme-error.svg';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';
import {
  IconButton,
  Image,
  SegmentedControl,
  TextSkeleton,
} from '../../../../components';
import SvgIconExternalLink from '../../../icons/components/IconExternalLink';
import { HomeCard } from '../HomeCard';

export type BriefMeStatus = 'loading' | 'default' | 'empty' | 'error';

export interface BriefMeArticle {
  id: string;
  date: string;
  title: string;
  url: string;
}

export interface BriefMeProps {
  handleActionClick: () => void;
  status: BriefMeStatus;
  category: string;
  onCategoryChange: (value: string) => void;
  articles: BriefMeArticle[];
}

export default function BriefMe({
  handleActionClick,
  status,
  category,
  onCategoryChange,
  articles,
}: BriefMeProps) {
  const { t } = useTranslation();

  const categoryOptions = [
    {
      label: t('homepage.briefme.category.briefme'),
      value: 'briefme',
    },
    {
      label: t('homepage.briefme.category.brief-eco'),
      value: 'brief-eco',
    },
    {
      label: t('homepage.briefme.category.brief-science'),
      value: 'brief-science',
    },
  ];

  return (
    <HomeCard variant="primary" className="briefme">
      <div className="briefme__header">
        <h3 className="briefme__title">{t('homepage.briefme.title')}</h3>
        <IconButton
          aria-label={t('homepage.briefme.open')}
          onClick={handleActionClick}
          icon={<SvgIconExternalLink />}
          variant="ghost"
          color="tertiary"
        />
      </div>

      <HomeCard.Content
        className={clsx('briefme__body', `briefme__body-${status}`)}
      >
        {status !== 'error' && (
          <SegmentedControl
            aria-label={t('homepage.briefme.categories')}
            options={categoryOptions}
            value={category}
            onChange={onCategoryChange}
            className="briefme__categories"
          />
        )}

        {status === 'loading' && (
          <div className="briefme__loading" data-testid="briefme-loading">
            <TextSkeleton size="lg" className="briefme__loading-item" />
            <TextSkeleton size="lg" className="briefme__loading-item" />
            <TextSkeleton size="lg" className="briefme__loading-item" />
          </div>
        )}

        {status === 'error' && (
          <div className="briefme__error">
            <Image
              src={illuBriefMeError}
              alt=""
              className="briefme__error-illu"
            />
            <p className="briefme__error-message">
              <span className="briefme__error-line">
                {t('homepage.briefme.error.connection')}
              </span>
              <span className="briefme__error-line">
                {t('homepage.briefme.error.help')}
              </span>
            </p>
          </div>
        )}

        {status === 'empty' && (
          <p className="briefme__empty">{t('homepage.briefme.empty')}</p>
        )}

        {status === 'default' && (
          <ul className="briefme__list">
            {articles.map((article) => (
              <li className="briefme__article" key={article.id}>
                <span className="briefme__article-date">{article.date}</span>
                <a
                  className="briefme__article-title"
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {article.title}
                </a>
              </li>
            ))}
          </ul>
        )}
      </HomeCard.Content>
    </HomeCard>
  );
}
