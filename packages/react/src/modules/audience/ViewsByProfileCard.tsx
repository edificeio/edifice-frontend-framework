import { ViewsDetailsProfile } from '@edifice.io/client';
import { StringUtils } from '@edifice.io/utilities';
import { useTranslation } from 'react-i18next';
import { IconUsers } from '../icons/components';
import {
  IconGuest,
  IconParent,
  IconPersonnel,
  IconStudent,
  IconTeacher,
} from '../icons/components/audience';

export interface ViewsCardProps {
  viewsByProfile: ViewsDetailsProfile;
}

const ViewsByProfileCard = ({ viewsByProfile }: ViewsCardProps) => {
  const { t } = useTranslation();
  const profile = viewsByProfile.profile.toLowerCase();
  const classNameIcon = `views-detail-icon rounded p-8 views-detail-icon-${profile}`;

  function getIcon(profile: string) {
    switch (profile) {
      case 'student':
        return <IconStudent />;
      case 'relative':
        return <IconParent />;
      case 'teacher':
        return <IconTeacher />;
      case 'personnel':
        return <IconPersonnel />;
      case 'guest':
        return <IconGuest />;
      default:
        return <IconUsers />;
    }
  }

  return (
    <div key={profile} className="views-detail-line p-8 ms-32 mb-12">
      <div className={classNameIcon}>{getIcon(profile)}</div>
      <div className="h3">{StringUtils.toCounter(viewsByProfile.counter)}</div>
      <div>{t(`audience.views.uniqueViewsPerProfile.${profile}`)}</div>
    </div>
  );
};

ViewsByProfileCard.displayName = 'ViewsByProfileCard';

export default ViewsByProfileCard;
