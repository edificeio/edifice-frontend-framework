import illuEmptyFavorite from '@edifice.io/bootstrap/dist/images/homepage/illu-empty-favorite-mediacentre.svg';
import illuError from '@edifice.io/bootstrap/dist/images/homepage/illu-error-mediacentre.svg';
import { useTranslation } from 'react-i18next';
import { LinkPill, TextSkeleton } from '../../../../components';
import { IconExternalLink } from '../../../icons/components';
import { HomeCard } from '../HomeCard';
import { MediacentreUniversalisSearch } from './components/MediacentreUniversalisSearch';
import { MediacentreResource } from './types';

export const MAX_DISPLAYED_RESOURCES = 4;

export interface MediacentreProps {
  /** Opens the Médiacentre application. */
  handleActionClick: () => void;
  /** The user's favorite resources. */
  resources: MediacentreResource[];
  isLoading?: boolean;
  isError?: boolean;
  /** UAI code of the user's school, required by the Universalis search. */
  uai?: string;
}

export default function Mediacentre({
  handleActionClick,
  resources,
  isLoading = false,
  isError = false,
  uai,
}: MediacentreProps) {
  const { t } = useTranslation();

  const renderResources = () => {
    if (isLoading) {
      return (
        <div className="mediacentre__list" data-testid="mediacentre-loading">
          <TextSkeleton size="lg" />
          <TextSkeleton size="lg" />
          <TextSkeleton size="lg" />
        </div>
      );
    }

    if (isError) {
      return (
        <div
          className="mediacentre__state mediacentre__state-error"
          data-testid="mediacentre-error"
        >
          <img
            src={illuError}
            alt=""
            className="mediacentre__state-illustration-error"
          />
          <p className="mediacentre__state-text">
            {t('homepage.widget.mediacentre.error')}
          </p>
        </div>
      );
    }

    if (resources.length === 0) {
      return (
        <div className="mediacentre__state" data-testid="mediacentre-empty">
          <img
            src={illuEmptyFavorite}
            alt=""
            className="mediacentre__state-illustration-empty"
          />
          <p className="mediacentre__state-text">
            {t('homepage.widget.mediacentre.empty')}
          </p>
        </div>
      );
    }

    return (
      <div className="mediacentre__list">
        {resources.slice(0, MAX_DISPLAYED_RESOURCES).map((resource) => (
          <LinkPill
            key={resource.id}
            href={resource.href}
            label={resource.title}
            subtitle={resource.subtitle}
            data-testid="mediacentre-resource-link"
            // Without a cover, LinkPill falls back to its default link icon.
            {...(resource.imageUrl
              ? {
                  illustrationType: 'img' as const,
                  illustration: <img src={resource.imageUrl} alt="" />,
                }
              : {})}
          />
        ))}
      </div>
    );
  };

  return (
    <HomeCard variant="primary" className="mediacentre">
      <HomeCard.Header
        className="mediacentre__header"
        title={t('homepage.widget.mediacentre.title')}
        actionLabel={t('homepage.widget.mediacentre.seeMore')}
        actionRightIcon={<IconExternalLink />}
        onActionClick={handleActionClick}
        actionProps={{ 'data-testid': 'mediacentre-see-more-button' }}
      />
      <HomeCard.Content className="mediacentre__content">
        {renderResources()}
        <MediacentreUniversalisSearch uai={uai} />
      </HomeCard.Content>
    </HomeCard>
  );
}
