import illuCantineEmpty from '@edifice.io/bootstrap/dist/images/homepage/cantine/illu-cantine-empty.svg';
import type { School } from '@edifice.io/client';
import { useTranslation } from 'react-i18next';
import {
  ButtonBeta as Button,
  FormControl,
  Image,
  Label,
  Select,
  TextSkeleton,
} from '../../../../components';
import { IconFullScreen } from '../../../icons/components';
import { HomeCard } from '../HomeCard';
import CantineMenuSection from './components/CantineMenuSection';
import { CantineSection, CantineStatus } from './types';

export interface CantineProps {
  status: CantineStatus;
  sections: CantineSection[];
  handleFullScreenClick: () => void;
  schools?: School[];
  selectedSchool?: School;
  onSelectedSchoolChange?: (schoolId: string) => void;
}

export default function Cantine({
  status,
  sections,
  handleFullScreenClick,
  schools = [],
  selectedSchool,
  onSelectedSchoolChange,
}: CantineProps) {
  const { t } = useTranslation();

  const hasSchoolSelect = schools.length > 1;

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
        {hasSchoolSelect && (
          <FormControl id="cantine-school" className="cantine__school">
            <Label>{t('homepage.widget.cantine.school')}</Label>
            {/* The key remounts Select on each school change. Without it,
                Select calls onValueChange again with the old school after
                the new one is saved, and overwrites it. The cost is that
                the keyboard focus leaves the trigger after a pick. */}
            <Select
              size="md"
              key={selectedSchool?.id}
              block
              placeholderOption={t('homepage.widget.cantine.school')}
              options={schools.map((school) => ({
                value: school.id,
                label: school.name,
              }))}
              selectedValue={
                selectedSchool && {
                  value: selectedSchool.id,
                  label: selectedSchool.name,
                }
              }
              onValueChange={(option) =>
                onSelectedSchoolChange?.(
                  typeof option === 'string' ? option : option.value,
                )
              }
            />
          </FormControl>
        )}

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
