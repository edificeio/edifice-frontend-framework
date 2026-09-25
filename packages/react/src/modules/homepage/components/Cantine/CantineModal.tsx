import illuCantineEmpty from '@edifice.io/bootstrap/dist/images/homepage/cantine/illu-cantine-empty.svg';
import { School } from '@edifice.io/client';
import { useTranslation } from 'react-i18next';
import {
  ButtonBeta,
  FormControl,
  Image,
  Label,
  Modal,
  Select,
  TextSkeleton,
} from '../../../../components';
import { useDate } from '../../../../hooks';
import { IconRafterLeft, IconRafterRight } from '../../../icons/components';
import CantineLegend from './components/CantineLegend';
import CantineMenuSection from './components/CantineMenuSection';
import {
  CantineMenuType,
  CantineSection,
  CantineStatus,
} from './hooks/useCantineMenu';

export interface CantineModalProps {
  isOpen: boolean;
  onClose: () => void;
  schools: School[];
  selectedSchool?: School;
  onSchoolChange: (schoolId: string) => void;
  hasDinner: boolean;
  menuType: CantineMenuType;
  onMenuTypeChange: (menuType: CantineMenuType) => void;
  date: string;
  canGoPrevious: boolean;
  canGoNext: boolean;
  onPreviousDay: () => void;
  onNextDay: () => void;
  sections: CantineSection[];
  status: CantineStatus;
}

const CantineModal = ({
  isOpen,
  onClose,
  schools,
  selectedSchool,
  onSchoolChange,
  hasDinner,
  menuType,
  onMenuTypeChange,
  date,
  canGoPrevious,
  canGoNext,
  onPreviousDay,
  onNextDay,
  sections,
  status,
}: CantineModalProps) => {
  const { t } = useTranslation();
  const { formatDate } = useDate();

  // Both selects are only offered when there is something to choose from.
  const hasSchoolSelect = schools.length > 1;

  const menuTypeOptions = [
    {
      value: 'lunch',
      label: t('homepage.widget.cantine.lunch', 'Déjeuner'),
    },
    {
      value: 'dinner',
      label: t('homepage.widget.cantine.dinner', 'Dîner'),
    },
  ];

  return (
    <Modal
      id="cantine-modal"
      size="lg"
      scrollable
      isOpen={isOpen}
      onModalClose={onClose}
    >
      <Modal.Header onModalClose={onClose}>
        {t('homepage.widget.cantine.title', 'Menu de la cantine')}
      </Modal.Header>

      <Modal.Body className="cantine-modal">
        <div className="cantine-modal__aside">
          {(hasSchoolSelect || hasDinner) && (
            <div className="cantine-modal__form">
              <div className="cantine-modal__fields">
                {hasSchoolSelect && (
                  <FormControl
                    id="cantine-modal-school"
                    className="cantine-modal__field"
                  >
                    <Label className="cantine-modal__label">
                      {t('homepage.widget.cantine.school', 'Établissement')}
                    </Label>
                    <Select
                      block
                      placeholderOption={t(
                        'homepage.widget.cantine.school',
                        'Établissement',
                      )}
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
                        onSchoolChange(
                          typeof option === 'string' ? option : option.value,
                        )
                      }
                    />
                  </FormControl>
                )}

                {hasDinner && (
                  <FormControl
                    id="cantine-modal-menu"
                    className="cantine-modal__field"
                  >
                    <Label className="cantine-modal__label">
                      {t('homepage.widget.cantine.menu', 'Menu')}
                    </Label>
                    <Select
                      block
                      placeholderOption={t(
                        'homepage.widget.cantine.lunch',
                        'Déjeuner',
                      )}
                      options={menuTypeOptions}
                      selectedValue={menuTypeOptions.find(
                        (option) => option.value === menuType,
                      )}
                      onValueChange={(option) =>
                        onMenuTypeChange(
                          (typeof option === 'string'
                            ? option
                            : option.value) as CantineMenuType,
                        )
                      }
                    />
                  </FormControl>
                )}
              </div>
            </div>
          )}

          <CantineLegend />
        </div>

        <div className="cantine-modal__panel">
          <div className="cantine-modal__nav">
            <ButtonBeta
              aria-label={t(
                'homepage.widget.cantine.previousDay',
                'Jour précédent',
              )}
              leftIcon={<IconRafterLeft />}
              variant="ghost"
              color="tertiary"
              disabled={!canGoPrevious}
              onClick={onPreviousDay}
            />
            <p className="cantine-modal__date">
              {formatDate(date, 'dddd D MMMM')}
            </p>
            <ButtonBeta
              aria-label={t('homepage.widget.cantine.nextDay', 'Jour suivant')}
              leftIcon={<IconRafterRight />}
              variant="ghost"
              color="tertiary"
              disabled={!canGoNext}
              onClick={onNextDay}
            />
          </div>

          {status === 'loading' && (
            <div
              className="cantine-modal__loading"
              data-testid="cantine-modal-loading"
            >
              <TextSkeleton size="lg" className="cantine-modal__loading-item" />
              <TextSkeleton size="lg" className="cantine-modal__loading-item" />
              <TextSkeleton size="lg" className="cantine-modal__loading-item" />
            </div>
          )}

          {/* An API failure reads like a missing menu inside the modal. */}
          {(status === 'empty' || status === 'error') && (
            <div className="cantine-modal__empty">
              <Image
                src={illuCantineEmpty}
                alt=""
                className="cantine-modal__empty-illu"
              />
              <p className="cantine-modal__empty-message">
                {t(
                  'homepage.widget.cantine.empty',
                  'Le menu n’est pas disponible pour ce jour',
                )}
              </p>
            </div>
          )}

          {status === 'default' && (
            <ul className="cantine-modal__menu">
              {sections.map((section) => (
                <CantineMenuSection
                  key={section.category}
                  category={section.category}
                  items={section.items}
                />
              ))}
            </ul>
          )}
        </div>
      </Modal.Body>
    </Modal>
  );
};

CantineModal.displayName = 'CantineModal';

export default CantineModal;
