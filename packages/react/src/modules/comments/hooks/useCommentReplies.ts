import { useState } from 'react';
import { CommentProps } from '../types';
import { useTranslation } from 'react-i18next';
import { useEdificeClient } from '../../../providers/EdificeClientProvider/EdificeClientProvider.hook';
import { useCommentsContext } from './useCommentsContext';

export const useCommentReplies = ({
  parentComment,
}: {
  parentComment: CommentProps;
}) => {
  const { profiles, options, replyToCommentId, defaultComments } =
    useCommentsContext();
  const { maxReplies, additionalReplies } = options;

  const [repliesLimit, setRepliesLimit] = useState(maxReplies);

  const { user } = useEdificeClient();
  const { t } = useTranslation();

  const showCommentForm =
    replyToCommentId === parentComment.id && !parentComment.deleted;

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
    profiles,
    user,
    showCommentForm,
    displayedReplies,
    showMoreReplies,
    handleMoreReplies,
  };
};
