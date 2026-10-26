import illuAlloRegion from '@edifice.io/bootstrap/dist/images/homepage/illu-allo-region.svg';
import { useTranslation } from 'react-i18next';
import { ButtonBeta } from '../../../../components/ButtonBeta/index';
import { Image } from '../../../../components/Image/index';
import { IconArrowRight } from '../../../icons/components';
import { HomeCard } from '../HomeCard';

export interface AlloRegionProps {
  /** Opens the requests the user already made. */
  onRequestsClick: () => void;
  /** Opens the form to make a new request. */
  onNewRequestClick: () => void;
}

const AlloRegion = ({
  onRequestsClick,
  onNewRequestClick,
}: AlloRegionProps) => {
  const { t } = useTranslation();

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
