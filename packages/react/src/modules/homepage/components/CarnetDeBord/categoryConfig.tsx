import { ReactNode } from 'react';
import {
  IconClockAlert,
  IconNotes,
  IconTeacher,
} from '../../../icons/components';
import { IconCahierDeTexte } from '../../../icons/components/apps';
import { ContentTitle } from './types';

export type CarnetDeBordCategoryColor = 'orange' | 'blue' | 'green' | 'pink';

interface CategoryConfig {
  /** Segment of the category's i18n keys. */
  i18nKey: string;
  color: CarnetDeBordCategoryColor;
  icon: ReactNode;
}

export const CATEGORY_CONFIG: Record<ContentTitle, CategoryConfig> = {
  'retards-absences': {
    i18nKey: 'absences',
    color: 'orange',
    icon: <IconClockAlert width={20} height={20} />,
  },
  'grades': {
    i18nKey: 'grades',
    color: 'blue',
    icon: <IconNotes width={20} height={20} />,
  },
  'diary': {
    i18nKey: 'diary',
    color: 'green',
    icon: <IconCahierDeTexte width={20} height={20} />,
  },
  'skills': {
    i18nKey: 'skills',
    color: 'pink',
    icon: <IconTeacher width={20} height={20} />,
  },
};

export const getCategoryI18nKey = (category: ContentTitle, suffix: string) =>
  `homepage.widget.carnetDeBord.${CATEGORY_CONFIG[category].i18nKey}.${suffix}`;

export const CONTENT_TITLES: ContentTitle[] = [
  'retards-absences',
  'grades',
  'diary',
  'skills',
];
