import { useState } from 'react';
import { CommentOptions, CommentProps, UserProfileResult } from '../types';
import { useTranslation } from 'react-i18next';
import { useEdificeClient } from '../../../providers/EdificeClientProvider/EdificeClientProvider.hook';
import { useCommentsContext } from './useCommentsContext';

export const useCommentReplies = ({
  parentComment,
  profiles,
  options,
}: {
  parentComment: CommentProps;
  profiles: (UserProfileResult | undefined)[];
  options: Partial<CommentOptions>;
}) => {
  const { maxReplies, additionalReplies } = options;
  const [repliesLimit, setRepliesLimit] = useState(maxReplies);
  const { defaultComments } = useCommentsContext();
  const { user } = useEdificeClient();
  const { t } = useTranslation();

  const { authorId } = parentComment;
  const profile =
    profiles?.find((user) => user?.userId === authorId)?.profile ?? 'Guest';

  const defaultReplies =
    defaultComments?.filter(
      (comment) => comment.replyTo === parentComment.id && !comment.deleted,
    ) ?? [];

  const displayedReplies =
    defaultReplies
      ?.sort((a, b) => a.createdAt - b.createdAt)
      .slice(0, repliesLimit) ?? [];

  const showMoreReplies = displayedReplies.length < defaultReplies.length;

  const handleMoreReplies = () => {
    const newLimit = displayedReplies.length + (additionalReplies ?? 2);
    if (newLimit === displayedReplies.length) return;
    setRepliesLimit(newLimit);
  };

  return {
    t,
    user,
    profile,
    displayedReplies,
    showMoreReplies,
    handleMoreReplies,
  };
};
