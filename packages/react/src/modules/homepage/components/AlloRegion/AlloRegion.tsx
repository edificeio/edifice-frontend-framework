import illuAlloRegion from '@edifice.io/bootstrap/dist/images/homepage/illu-allo-region.svg';
import { useTranslation } from 'react-i18next';
import { ButtonBeta as Button } from '../../../../components/ButtonBeta/index';
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
        title={t('homepage.alloregion.title')}
        actionLabel={t('homepage.alloregion.actionLabel')}
        actionRightIcon={<IconArrowRight />}
        onActionClick={onRequestsClick}
        actionProps={{ 'data-testid': 'allo-region-requests' }}
      />
      <HomeCard.Content className="allo-region__content">
        <Image
          src={illuAlloRegion}
          alt=""
          aria-hidden="true"
          width={120}
          height={86}
        />
        <p className="allo-region__description">
          {t('homepage.alloregion.description')}{' '}
          <strong>{t('homepage.alloregion.callToAction')}</strong>
        </p>
        <Button
          variant="outline"
          rightIcon={<IconArrowRight />}
          onClick={onNewRequestClick}
        >
          {t('homepage.alloregion.newRequest')}
        </Button>
      </HomeCard.Content>
    </HomeCard>
  );
};

AlloRegion.displayName = 'AlloRegion';

export default AlloRegion;
