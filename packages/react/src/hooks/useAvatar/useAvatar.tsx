import { ID, UserProfile, odeServices } from '@edifice.io/client';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Badge } from '../../components';

export default function useAvatar(
  userId: ID,
  userProfile?: UserProfile[number],
) {
  const { t } = useTranslation();

  const badge = useMemo((): JSX.Element | null => {
    const profile = userProfile?.toLowerCase() ?? 'guest';
    return ['teacher', 'student', 'relative', 'personnel'].includes(profile) ? (
      <Badge
        variant={{
          type: 'user',
          profile: profile as 'Teacher' | 'Student' | 'Relative' | 'Personnel',
        }}
      >
        {t(profile)}
      </Badge>
    ) : null;
  }, [userProfile, t]);

  function getAvatarURL(userId: ID): string {
    return odeServices.directory().getAvatarUrl(userId, 'user');
  }
  function getUserbookURL(userId: ID): string {
    return odeServices.directory().getDirectoryUrl(userId, 'user');
  }

  return {
    badge,
    avatarURL: getAvatarURL(userId),
    userbookURL: getUserbookURL(userId),
  };
}
