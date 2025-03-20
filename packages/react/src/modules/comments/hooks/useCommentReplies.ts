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
      (comment) => comment.replyTo === parentComment.id,
    ) ?? [];

  const slicedReplies =
    defaultReplies
      ?.sort((a, b) => b.createdAt - a.createdAt)
      .slice(0, repliesLimit) ?? [];

  const handleMoreReplies = () => {
    const newLimit = slicedReplies.length + (additionalReplies ?? 2);
    if (newLimit === slicedReplies.length) return;
    setRepliesLimit(newLimit);
  };

  return {
    t,
    user,
    profile,
    slicedReplies,
    defaultReplies,
    handleMoreReplies,
  };
};
