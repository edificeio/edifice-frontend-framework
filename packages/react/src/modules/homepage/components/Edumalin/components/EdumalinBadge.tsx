import clsx from 'clsx';
import { ComponentType, SVGProps } from 'react';
import { useTranslation } from 'react-i18next';
import {
  IconCalendarLight,
  IconHeadphone,
  IconInfoCircle,
  IconMegaphone,
  IconMic,
  IconPinOn,
  IconRecordVideo,
  IconReset,
  IconWand,
} from '../../../../icons/components';
import { EdumalinType } from '../types';
import { getEdumalinType } from '../utils';

const TYPE_ICONS: Record<
  EdumalinType,
  ComponentType<SVGProps<SVGSVGElement>>
> = {
  webinar: IconRecordVideo,
  announcement: IconMegaphone,
  news: IconPinOn,
  rdv: IconCalendarLight,
  testimonial: IconMic,
  replay: IconReset,
  podcast: IconHeadphone,
  tutorial: IconWand,
  other: IconInfoCircle,
};

export interface EdumalinBadgeProps {
  /** Type name as sent by Édumalin. */
  typeName?: string;
}

export default function EdumalinBadge({ typeName }: EdumalinBadgeProps) {
  const { t } = useTranslation();
  const type = getEdumalinType(typeName);
  const Icon = TYPE_ICONS[type];

  return (
    <span className={clsx('edumalin-badge', `edumalin-badge--${type}`)}>
      <Icon className="edumalin-badge__icon" />
      {t(`homepage.widget.edumalin.type.${type}`)}
    </span>
  );
}
