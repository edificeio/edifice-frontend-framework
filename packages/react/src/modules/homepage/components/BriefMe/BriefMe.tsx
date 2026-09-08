import illuBriefMeError from '@edifice.io/bootstrap/dist/images/homepage/illu-briefme-error.svg';
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
      label: t('homepage.widget.briefme.category.briefme', 'Brief.me'),
      value: 'briefme',
    },
    {
      label: t('homepage.widget.briefme.category.brief-eco', 'Brief.eco'),
      value: 'brief-eco',
    },
    {
      label: t(
        'homepage.widget.briefme.category.brief-science',
        'Brief.science',
      ),
      value: 'brief-science',
    },
  ];

  return (
    <HomeCard variant="primary">
      <div className="briefme__header">
        <h3 className="briefme__title">
          {t('homepage.widget.briefme.title', 'Brief.me')}
        </h3>
        <IconButton
          aria-label={t('homepage.widget.briefme.open', 'Ouvrir')}
          onClick={handleActionClick}
          icon={<SvgIconExternalLink />}
          variant="ghost"
          color="tertiary"
        />
      </div>

      <HomeCard.Content>
        <div className="briefme">
          {status !== 'error' && (
            <SegmentedControl
              options={categoryOptions}
              value={category}
              onChange={onCategoryChange}
              className="briefme__categories"
            />
          )}

          <div className="briefme__content">
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
                  {t(
                    'homepage.widget.briefme.error',
                    'Impossible d’établir une connexion avec Brief.me. Si le problème persiste, ouvrez une demande d’aide sur le module Assistance ENT.',
                  )}
                </p>
              </div>
            )}

            {status === 'empty' && (
              <p className="briefme__empty">
                {t(
                  'homepage.widget.briefme.empty',
                  'Il n’y a pas d’articles à afficher.',
                )}
              </p>
            )}

            {status === 'default' && (
              <ul className="briefme__list">
                {articles.map((article) => (
                  <li className="briefme__article" key={article.id}>
                    <span className="briefme__article-date">
                      {article.date}
                    </span>
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
          </div>
        </div>
      </HomeCard.Content>
    </HomeCard>
  );
}
