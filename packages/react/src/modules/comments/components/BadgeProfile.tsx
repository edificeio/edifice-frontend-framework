import { UserProfile } from '@edifice.io/client';
import { useTranslation } from 'react-i18next';
import { Badge } from '../../..';

export const BadgeProfile = ({ profile }: { profile: UserProfile[number] }) => {
  const { t } = useTranslation();

  const getProfile = (profile: UserProfile[0]) => t(`${profile}`);
  return (
    <Badge
      variant={{
        type: 'user',
        profile,
        background: true,
      }}
    >
      {getProfile(profile)}
    </Badge>
  );
};
