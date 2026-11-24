import illuAlloRegion from '@edifice.io/bootstrap/dist/images/homepage/illu-allo-region.svg';
import { useTranslation } from 'react-i18next';
import { ButtonBeta } from '../../../../components/ButtonBeta/index';
import { Image } from '../../../../components/Image/index';
import { Skeleton } from '../../../../components/Skeleton/index';
import { VisuallyHidden } from '../../../../components/VisuallyHidden/index';
import { IconArrowRight } from '../../../icons/components';
import { HomeCard } from '../HomeCard';

export interface AlloRegionProps {
  /** Opens the requests the user already made. */
  onRequestsClick: () => void;
  /** Opens the form to make a new request. */
  onNewRequestClick: () => void;
  isLoading?: boolean;
}

const AlloRegion = ({
  onRequestsClick,
  onNewRequestClick,
  isLoading = false,
}: AlloRegionProps) => {
  const { t } = useTranslation();

  if (isLoading) {
    return (
      <HomeCard
        variant="primary"
        className="allo-region allo-region--skeleton"
        role="status"
        aria-busy="true"
      >
        <VisuallyHidden>{t('homepage.widget.loading')}</VisuallyHidden>
        <div className="allo-region__header-skeleton">
          <Skeleton className="allo-region__title-skeleton" />
          <Skeleton
            variant="circle"
            tone="strong"
            className="allo-region__button-skeleton"
          />
        </div>
        <Skeleton variant="block" className="allo-region__content-skeleton" />
      </HomeCard>
    );
  }

  return (
    <HomeCard variant="primary">
      <HomeCard.Header
        title={t('homepage.alloregion.title', 'Allô Région')}
        actionLabel={t('homepage.alloregion.actionLabel', 'Mes signalements')}
        actionRightIcon={<IconArrowRight />}
        onActionClick={onRequestsClick}
        actionProps={{ 'data-testid': 'allo-region-requests' }}
      />
      <HomeCard.Content className="align-items-center gap-8">
        <Image
          src={illuAlloRegion}
          alt=""
          aria-hidden="true"
          width={120}
          height={86}
        />
        <p className="mb-0 w-100">
          {t(
            'homepage.alloregion.description',
            'Bâtiments, équipements : un souci dans ton lycée ?',
          )}{' '}
          <strong>
            {t(
              'homepage.alloregion.callToAction',
              'Fais-le remonter à la Région !',
            )}
          </strong>
        </p>
        <ButtonBeta
          variant="outline"
          rightIcon={<IconArrowRight />}
          onClick={onNewRequestClick}
        >
          {t('homepage.alloregion.newRequest', 'Faire un signalement')}
        </ButtonBeta>
      </HomeCard.Content>
    </HomeCard>
  );
};

AlloRegion.displayName = 'AlloRegion';

export default AlloRegion;
