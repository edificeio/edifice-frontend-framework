import illuCantineEmpty from '@edifice.io/bootstrap/dist/images/homepage/cantine/illu-cantine-empty.svg';
import { useTranslation } from 'react-i18next';
import {
  ButtonBeta,
  IconButton,
  Image,
  TextSkeleton,
} from '../../../../components';
import { IconFullScreen } from '../../../icons/components';
import { HomeCard } from '../HomeCard';
import CantineMenuSection from './components/CantineMenuSection';
import { CantineSection, CantineStatus } from './hooks/useCantineMenu';

export interface CantineProps {
  status: CantineStatus;
  sections: CantineSection[];
  handleFullScreenClick: () => void;
}

export default function Cantine({
  status,
  sections,
  handleFullScreenClick,
}: CantineProps) {
  const { t } = useTranslation();

  return (
    <HomeCard variant="primary" className="cantine">
      <div className="cantine__header">
        <h3 className="cantine__title">
          {t('homepage.widget.cantine.title', 'Menu de la cantine')}
        </h3>
        {status !== 'error' && (
          <IconButton
            aria-label={t(
              'homepage.widget.cantine.open',
              'Ouvrir en plein écran',
            )}
            onClick={handleFullScreenClick}
            icon={<IconFullScreen />}
            variant="ghost"
            color="tertiary"
          />
        )}
      </div>

      <HomeCard.Content className="cantine__content">
        {status === 'loading' && (
          <div className="cantine__loading" data-testid="cantine-loading">
            <TextSkeleton size="lg" className="cantine__loading-item" />
            <TextSkeleton size="lg" className="cantine__loading-item" />
            <TextSkeleton size="lg" className="cantine__loading-item" />
          </div>
        )}

        {status === 'error' && (
          <div className="cantine__error">
            <Image
              src={illuCantineEmpty}
              alt=""
              className="cantine__error-illu"
            />
            <p className="cantine__error-message">
              {t(
                'homepage.widget.cantine.error',
                'Problème de connexion avec le service de cantine. Si le problème persiste, contactez votre établissement.',
              )}
            </p>
          </div>
        )}

        {status === 'empty' && (
          <div className="cantine__empty">
            <Image
              src={illuCantineEmpty}
              alt=""
              className="cantine__empty-illu"
            />
            <p className="cantine__empty-message">
              {t(
                'homepage.widget.cantine.empty',
                'Le menu n’est pas disponible pour ce jour',
              )}
            </p>
            <ButtonBeta
              variant="outline"
              rightIcon={<IconFullScreen />}
              onClick={handleFullScreenClick}
            >
              {t('homepage.widget.cantine.seeMore', 'voir plus')}
            </ButtonBeta>
          </div>
        )}

        {status === 'default' && (
          <ul className="cantine__menu">
            {sections.map((section) => (
              <CantineMenuSection
                key={section.category}
                category={section.category}
                items={section.items}
              />
            ))}
          </ul>
        )}
      </HomeCard.Content>
    </HomeCard>
  );
}
