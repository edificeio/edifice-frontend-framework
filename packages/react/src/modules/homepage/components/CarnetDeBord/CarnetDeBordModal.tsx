import illuEmpty from '@edifice.io/bootstrap/dist/images/homepage/illu-carnet-de-bord-empty.png';
import clsx from 'clsx';
import { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ButtonBeta as Button,
  Image,
  ModalBeta as Modal,
  Select,
} from '../../../../components';
import { useBreakpoint } from '../../../../hooks';
import { IconExternalLink } from '../../../icons/components';
import { CarnetDeBordCategoryIcon } from './CarnetDeBordCategoryRow';
import { getCategoryI18nKey } from './categoryConfig';
import { ContentItem, ContentTitle, ContentType } from './types';

export interface CarnetDeBordModalProps {
  isOpen: boolean;
  onClose: () => void;
  /** Displayed in the title in parent view only; omitted in student view. */
  studentName?: string;
  contentTypes: ContentType[];
  activeTab: ContentTitle;
  onTabChange: (title: ContentTitle) => void;
  /** URL of the student's Pronote instance. */
  address: string;
}

interface RowProps {
  date?: string;
  title?: string;
  details?: ReactNode;
  aside?: ReactNode;
}

function Row({ date, title, details, aside }: RowProps) {
  return (
    <li className="carnet-de-bord-modal__row">
      <div className="carnet-de-bord-modal__row-main">
        {date && <span className="carnet-de-bord-modal__row-date">{date}</span>}
        {title && (
          <strong className="carnet-de-bord-modal__row-title">{title}</strong>
        )}
        {details}
      </div>
      {aside}
    </li>
  );
}

function RetardsAbsencesRow({ item }: { item: ContentItem }) {
  const { t } = useTranslation();
  return (
    <Row
      date={item.value}
      title={t(
        `homepage.widget.carnetDeBord.absences.${item.kind === 'absence' ? 'absence' : 'lateness'}`,
      )}
      details={
        item.motif && (
          <span className="carnet-de-bord-modal__row-details">
            {item.motif}
          </span>
        )
      }
    />
  );
}

function NoteRow({ item }: { item: ContentItem }) {
  const match = item.value.match(/^(.+) en (.+) le (.+)$/);
  const [grade, subject, date] = match
    ? [match[1], match[2], match[3]]
    : [item.value, '', ''];
  return (
    <Row
      date={date}
      title={subject}
      aside={<span className="carnet-de-bord-modal__row-value">{grade}</span>}
    />
  );
}

interface DiaryDayRowProps {
  subject: string;
  date?: number;
  content: string | null;
}

function DiaryDayRow({ subject, date, content }: DiaryDayRowProps) {
  const { t } = useTranslation();
  const format = (options: Intl.DateTimeFormatOptions) =>
    date ? new Intl.DateTimeFormat('fr-FR', options).format(date) : '';

  return (
    <Row
      date={
        date
          ? t('homepage.widget.carnetDeBord.diary.dueDate', {
              date: format({
                weekday: 'long',
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              }),
            })
          : undefined
      }
      title={subject}
      details={
        <span className="carnet-de-bord-modal__row-details carnet-de-bord-modal__row-details--italic">
          {content || t('homepage.widget.carnetDeBord.diary.noDescription')}
        </span>
      }
      aside={
        date && (
          <span className="carnet-de-bord-modal__day" aria-hidden="true">
            <span className="carnet-de-bord-modal__day-number">
              {format({ day: '2-digit' })}
            </span>
            <span className="carnet-de-bord-modal__day-month">
              {format({ month: 'long' })}
            </span>
          </span>
        )
      }
    />
  );
}

function SkillRow({ item }: { item: ContentItem }) {
  const withSubject = item.value.match(/^(.+) le (.+) en (.+)$/);
  const withoutSubject = item.value.match(/^(.+) le (.+)$/);
  const [status, date, subject] = withSubject
    ? [withSubject[1], withSubject[2], withSubject[3]]
    : withoutSubject
      ? [withoutSubject[1], withoutSubject[2], '']
      : [item.value, '', ''];

  return (
    <Row
      date={date}
      title={subject}
      details={item.subsections?.map(
        (sub, index) =>
          sub.content && (
            <span key={index} className="carnet-de-bord-modal__row-details">
              {sub.header} : {sub.content}
            </span>
          ),
      )}
      aside={<span className="carnet-de-bord-modal__row-value">{status}</span>}
    />
  );
}

function renderRow(type: ContentTitle, item: ContentItem, index: number) {
  switch (type) {
    case 'grades':
      return <NoteRow key={index} item={item} />;
    case 'skills':
      return <SkillRow key={index} item={item} />;
    default:
      return <RetardsAbsencesRow key={index} item={item} />;
  }
}

export function CarnetDeBordModal({
  isOpen,
  onClose,
  studentName,
  contentTypes,
  activeTab,
  onTabChange,
  address,
}: CarnetDeBordModalProps) {
  const { t } = useTranslation();
  const { md } = useBreakpoint();

  const activeContentType = contentTypes.find((ct) => ct.title === activeTab);
  const items = Array.isArray(activeContentType?.full)
    ? activeContentType.full
    : [];

  const diaryRows =
    activeTab === 'diary'
      ? items.flatMap((item) => {
          const subject = item.value.replace(/^Nouveau devoir\s+/i, '');
          return (item.subsections ?? []).map((sub) => ({
            subject,
            date: sub.date,
            content: sub.content,
          }));
        })
      : [];

  const hasContent =
    activeTab === 'diary' ? diaryRows.length > 0 : items.length > 0;

  const railLabel = (title: ContentTitle) =>
    t(getCategoryI18nKey(title, 'short'));

  const categoryOptions = contentTypes.map((ct) => ({
    value: ct.title,
    label: railLabel(ct.title),
  }));

  const pronoteButton = address && (
    <Button
      data-testid="carnet-de-bord-modal-button-pronote"
      variant="ghost"
      color="tertiary"
      size="sm"
      rightIcon={<IconExternalLink />}
      className="carnet-de-bord-modal__pronote"
      onClick={() => window.open(address, '_blank', 'noopener,noreferrer')}
    >
      {t('homepage.widget.carnetDeBord.pronote')}
    </Button>
  );

  return (
    <Modal
      id="carnet-de-bord-modal"
      size="l"
      isOpen={isOpen}
      onModalClose={onClose}
    >
      <Modal.Header onModalClose={onClose}>
        {studentName
          ? t('homepage.widget.carnetDeBord.modal.title', { name: studentName })
          : t('homepage.widget.carnetDeBord.title')}
      </Modal.Header>

      <Modal.Body>
        <div
          className={clsx('carnet-de-bord-modal', {
            'carnet-de-bord-modal--mobile': !md,
          })}
        >
          {md ? (
            <div
              className="carnet-de-bord-modal__rail"
              role="tablist"
              aria-orientation="vertical"
              aria-label={t('homepage.widget.carnetDeBord.modal.categories')}
            >
              {contentTypes.map((ct) => (
                <button
                  key={ct.title}
                  type="button"
                  role="tab"
                  aria-selected={ct.title === activeTab}
                  className={clsx('carnet-de-bord-modal__rail-tab', {
                    active: ct.title === activeTab,
                  })}
                  onClick={() => onTabChange(ct.title)}
                  data-testid={`carnet-de-bord-modal-button-${ct.title}`}
                >
                  <CarnetDeBordCategoryIcon category={ct.title} />
                  <span className="carnet-de-bord-modal__rail-label">
                    {railLabel(ct.title)}
                  </span>
                </button>
              ))}
            </div>
          ) : (
            <div data-testid="carnet-de-bord-modal-input-category">
              <Select
                block
                placeholderOption={railLabel(activeTab)}
                options={categoryOptions}
                selectedValue={categoryOptions.find(
                  (option) => option.value === activeTab,
                )}
                onValueChange={(option) =>
                  onTabChange(
                    (typeof option === 'string'
                      ? option
                      : option.value) as ContentTitle,
                  )
                }
              />
            </div>
          )}

          <div className="carnet-de-bord-modal__content">
            <h3 className="carnet-de-bord-modal__content-title">
              {t(getCategoryI18nKey(activeTab, 'label'))}
            </h3>
            {hasContent ? (
              <ul className="carnet-de-bord-modal__rows">
                {activeTab === 'diary'
                  ? diaryRows.map((row, index) => (
                      <DiaryDayRow key={index} {...row} />
                    ))
                  : items.map((item, index) =>
                      renderRow(activeTab, item, index),
                    )}
              </ul>
            ) : (
              <div className="carnet-de-bord-modal__empty">
                <Image
                  src={illuEmpty}
                  alt=""
                  className="carnet-de-bord-modal__empty-illu"
                />
                <p className="carnet-de-bord-modal__empty-message">
                  {t(getCategoryI18nKey(activeTab, 'empty'))}
                </p>
              </div>
            )}
            {pronoteButton}
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
}
