import illuCantineEmpty from '@edifice.io/bootstrap/dist/images/homepage/cantine/illu-cantine-empty.svg';
import { useTranslation } from 'react-i18next';
import {
  ButtonBeta as Button,
  Image,
  Skeleton,
  VisuallyHidden,
} from '../../../../components';
import { IconFullScreen } from '../../../icons/components';
import { HomeCard } from '../HomeCard';
import CantineMenuSection from './components/CantineMenuSection';
import { CantineSection, CantineStatus } from './types';

export interface CantineProps {
  status: CantineStatus;
  sections: CantineSection[];
  handleFullScreenClick: () => void;
  isLoading?: boolean;
}

export default function Cantine({
  status,
  sections,
  handleFullScreenClick,
  isLoading = false,
}: CantineProps) {
  const { t } = useTranslation();

  if (isLoading) {
    return (
      <HomeCard
        variant="primary"
        className="cantine cantine--skeleton"
        role="status"
        aria-busy="true"
      >
        <VisuallyHidden>{t('homepage.widget.loading')}</VisuallyHidden>
        <div className="cantine__header-skeleton">
          <Skeleton className="cantine__title-skeleton" />
          <Skeleton
            variant="circle"
            tone="strong"
            className="cantine__button-skeleton"
          />
        </div>
        <Skeleton variant="block" className="cantine__content-skeleton" />
      </HomeCard>
    );
  }

  return (
    <HomeCard variant="primary" className="cantine">
      <div className="cantine__header">
        <h3 className="cantine__title">{t('homepage.widget.cantine.title')}</h3>
        {status !== 'error' && (
          <Button
            aria-label={t('homepage.widget.cantine.open')}
            onClick={handleFullScreenClick}
            leftIcon={<IconFullScreen />}
            variant="ghost"
            color="tertiary"
          />
        )}
      </div>

      <HomeCard.Content className="cantine__content">
        {status === 'loading' && (
          <div role="status" aria-busy="true" data-testid="cantine-loading">
            <VisuallyHidden>{t('homepage.widget.loading')}</VisuallyHidden>
            <Skeleton variant="block" className="cantine__loading-skeleton" />
          </div>
        )}

        {status === 'error' && (
          <div className="cantine__error">
            <Image
              src={illuCantineEmpty}
              alt={t('homepage.widget.cantine.emptyIllustration')}
              className="cantine__error-illu"
            />
            <p className="cantine__error-message">
              {t('homepage.widget.cantine.error')}
            </p>
          </div>
        )}

        {status === 'empty' && (
          <div className="cantine__empty">
            <Image
              src={illuCantineEmpty}
              alt={t('homepage.widget.cantine.emptyIllustration')}
              className="cantine__empty-illu"
            />
            <p className="cantine__empty-message">
              {t('homepage.widget.cantine.empty')}
            </p>
            <Button
              variant="outline"
              rightIcon={<IconFullScreen />}
              onClick={handleFullScreenClick}
            >
              {t('homepage.widget.cantine.seeMore')}
            </Button>
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
