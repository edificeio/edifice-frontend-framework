import {
  Guest,
  Parent,
  Personnel,
  Student,
  Teacher,
} from '@edifice.io/icons/audience';
import { ViewsDetailsProfile } from '@edifice.io/ts-client';
import { useTranslation } from 'react-i18next';
import { Users } from '../../../../icons/dist';
import { StringUtils } from '../../utils';

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
        return <Student />;
      case 'relative':
        return <Parent />;
      case 'teacher':
        return <Teacher />;
      case 'personnel':
        return <Personnel />;
      case 'guest':
        return <Guest />;
      default:
        return <Users />;
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
