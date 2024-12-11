import { useTranslation } from 'react-i18next';
import { Avatar, useDirectory } from '../../..';

export const CommentAvatar = ({ id }: { id: string }) => {
  const { getAvatarURL } = useDirectory();
  const { t } = useTranslation();

  return (
    <Avatar
      alt={t('comment.author.avatar')}
      size="sm"
      src={getAvatarURL(id, 'user')}
      variant="circle"
    />
  );
};
