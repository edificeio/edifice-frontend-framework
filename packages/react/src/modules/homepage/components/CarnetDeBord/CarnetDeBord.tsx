import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TextSkeleton } from '../../../../components';
import { IconFullScreen } from '../../../icons/components';
import { HomeCard } from '../HomeCard';
import { TabsKids } from '../TabsKids';
import {
  CarnetDeBordCategoryIcon,
  CarnetDeBordCategoryRow,
} from './CarnetDeBordCategoryRow';
import { CarnetDeBordError } from './CarnetDeBordError';
import { CarnetDeBordModal } from './CarnetDeBordModal';
import { getCategoryI18nKey } from './categoryConfig';
import { CarnetDeBordStatus, ContentTitle, ParsedEleve } from './types';
import { computeContentTypes, getItemCount } from './utils';

export interface CarnetDeBordProps {
  status: CarnetDeBordStatus;
  eleves: ParsedEleve[];
  currentEleveIndex: number;
  onEleveChange: (index: number) => void;
  isRelative?: boolean;
}

export function CarnetDeBord({
  status,
  eleves,
  currentEleveIndex,
  onEleveChange,
  isRelative = false,
}: CarnetDeBordProps) {
  const { t } = useTranslation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<ContentTitle>('retards-absences');

  const currentEleve = eleves[currentEleveIndex] ?? null;

  const contentTypes = useMemo(
    () => computeContentTypes(currentEleve),
    [currentEleve],
  );

  const tabs = useMemo(
    () =>
      eleves.map((eleve, index) => ({
        id: String(index),
        label: eleve.name,
        avatar: eleve.avatar || undefined,
      })),
    [eleves],
  );

  const openModal = (title: ContentTitle) => {
    setActiveTab(title);
    setIsModalOpen(true);
  };

  const seeMoreTab = (
    contentTypes.find((contentType) => getItemCount(contentType) > 0) ??
    contentTypes[0]
  ).title;

  const renderCategories = () => (
    <div className="carnet-de-bord__categories">
      {contentTypes.map((contentType) => {
        const label = t(getCategoryI18nKey(contentType.title, 'label'));

        if (!currentEleve) {
          return (
            <div key={contentType.title} className="carnet-de-bord__entry">
              <CarnetDeBordCategoryIcon category={contentType.title} />
              <span className="carnet-de-bord__entry-text">
                <span className="carnet-de-bord__entry-label">{label}</span>
                <TextSkeleton size="sm" className="w-75" />
              </span>
            </div>
          );
        }

        const itemCount = getItemCount(contentType);
        const isEmpty = contentType.compact === false && itemCount === 0;

        return (
          <CarnetDeBordCategoryRow
            key={contentType.title}
            category={contentType.title}
            label={label}
            subtext={
              isEmpty
                ? t(getCategoryI18nKey(contentType.title, 'empty'))
                : contentType.compact || ''
            }
            isSubtextEmpty={isEmpty}
            isDisabled={itemCount === 0}
            onClick={() => openModal(contentType.title)}
          />
        );
      })}
    </div>
  );

  const renderContent = () => {
    if (status === 'error') return <CarnetDeBordError />;
    if (status === 'empty') {
      return (
        <p className="carnet-de-bord__empty">
          {t('homepage.widget.carnetDeBord.empty')}
        </p>
      );
    }
    if (eleves.length === 0) return renderCategories();

    return (
      <TabsKids
        items={tabs}
        activeId={String(currentEleveIndex)}
        onChange={(id) => onEleveChange(Number(id))}
        showTabBar={isRelative || eleves.length > 1}
        ariaLabel={t('homepage.widget.carnetDeBord.kids')}
        overflowLabel={t('homepage.widget.carnetDeBord.moreKids')}
      >
        {renderCategories()}
      </TabsKids>
    );
  };

  return (
    <>
      <HomeCard variant="primary" className="carnet-de-bord">
        <HomeCard.Header
          title={t('homepage.widget.carnetDeBord.title')}
          actionLabel={t('homepage.widget.carnetDeBord.open')}
          actionRightIcon={<IconFullScreen />}
          onActionClick={
            status === 'default' && currentEleve
              ? () => openModal(seeMoreTab)
              : undefined
          }
          actionProps={{ 'data-testid': 'carnet-de-bord-button-see-more' }}
        />
        <HomeCard.Content className="carnet-de-bord__content">
          {renderContent()}
        </HomeCard.Content>
      </HomeCard>

      <CarnetDeBordModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        studentName={isRelative ? currentEleve?.name : undefined}
        contentTypes={contentTypes}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        address={currentEleve?.address ?? ''}
      />
    </>
  );
}
