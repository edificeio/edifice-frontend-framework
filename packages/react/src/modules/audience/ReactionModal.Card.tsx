import { ReactionDetailsData } from '@edifice.io/client';
import { useTranslation } from 'react-i18next';
import { Avatar } from '../../components';
import { useDirectory } from '../../hooks';
import useReactionIcons from './hooks/useReactionIcons';

export function ReactionModalCard({
  reaction,
}: {
  reaction: ReactionDetailsData['userReactions'][number];
}) {
  const { t } = useTranslation();
  const { getAvatarURL } = useDirectory();
  const { getReactionIcon, getReactionLabel } = useReactionIcons();

  return (
    <div className="reaction-modal-card w-100 d-flex gap-8">
      <div className="position-relative p-8">
        <Avatar
          variant="circle"
          size="md"
          src={getAvatarURL(reaction.userId, 'user')}
          alt={reaction.displayName}
        />
        <div className="position-absolute end-0 bottom-0">
          {getReactionIcon(reaction.reactionType, true)}
        </div>
      </div>
      <div className="d-flex flex-column w-100 pt-8">
        <div className="d-flex align-items-baseline">
          <div className="d-flex overflow-hidden">
            <div className="text-reset flex-shrink-0">
              {reaction.displayName}
            </div>
          </div>
          <strong className="ms-12 caption text-gray-700">
            {t(reaction.profile)}
          </strong>
        </div>
        <p className="caption text-gray-700">
          {t(getReactionLabel(reaction.reactionType))}
        </p>
      </div>
    </div>
  );
}
