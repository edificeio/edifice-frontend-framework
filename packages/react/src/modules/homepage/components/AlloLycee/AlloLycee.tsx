import illuAlloLycee from '@edifice.io/bootstrap/dist/images/homepage/illu-allo-lycee.png';
import { useTranslation } from 'react-i18next';
import { ButtonBeta } from '../../../../components/ButtonBeta/index';
import { Image } from '../../../../components/Image/index';
import { IconArrowRight } from '../../../icons/components';
import { HomeCard } from '../HomeCard';

export interface AlloLyceeProps {
  /** Opens the requests the user already made. */
  onRequestsClick: () => void;
  /** Opens the form to make a new request. */
  onNewRequestClick: () => void;
}

const AlloLycee = ({ onRequestsClick, onNewRequestClick }: AlloLyceeProps) => {
  const { t } = useTranslation();

  return (
    <HomeCard variant="primary">
      <HomeCard.Header
        title={t('homepage.allolycee.title', 'Allô Lycée')}
        actionLabel={t('homepage.allolycee.actionLabel', 'Mes demandes')}
        actionRightIcon={<IconArrowRight />}
        onActionClick={onRequestsClick}
        actionProps={{ 'data-testid': 'allo-lycee-requests' }}
      />
      <HomeCard.Content className="align-items-center gap-8">
        <Image
          src={illuAlloLycee}
          alt=""
          aria-hidden="true"
          width={120}
          height={86}
        />
        <p className="mb-0 w-100">
          {t(
            'homepage.allolycee.description',
            'Des dysfonctionnements matériels ou cadre de vie au sein de l’établissement ?',
          )}{' '}
          <strong>
            {t('homepage.allolycee.callToAction', 'Signalez-le !')}
          </strong>
        </p>
        <ButtonBeta
          variant="outline"
          rightIcon={<IconArrowRight />}
          onClick={onNewRequestClick}
        >
          {t('homepage.allolycee.newRequest', 'Faire une demande')}
        </ButtonBeta>
      </HomeCard.Content>
    </HomeCard>
  );
};

AlloLycee.displayName = 'AlloLycee';

export default AlloLycee;
