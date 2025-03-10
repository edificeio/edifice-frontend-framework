import { useState } from 'react';
import { CommentOptions, CommentProps, UserProfileResult } from '../types';
import { useTranslation } from 'react-i18next';
import { useEdificeClient } from '../../../providers/EdificeClientProvider/EdificeClientProvider.hook';

export const useCommentReplies = ({
  parentComment,
  comments,
  profiles,
  options,
}: {
  parentComment: CommentProps;
  comments: CommentProps[] | undefined;
  profiles: (UserProfileResult | undefined)[];
  options: Partial<CommentOptions>;
}) => {
  const { maxReplies, additionalReplies } = options;
  const [repliesLimit, setRepliesLimit] = useState(maxReplies);
  const { user } = useEdificeClient();
  const { t } = useTranslation();

  const { authorId } = parentComment;
  const profile =
    profiles?.find((user) => user?.userId === authorId)?.profile ?? 'Guest';

  const defaultReplies =
    comments?.filter((comment) => comment.replyTo === parentComment.id) ?? [];

  const slicedReplies =
    defaultReplies
      ?.sort((a, b) => b.createdAt - a.createdAt)
      .slice(0, repliesLimit) ?? [];

  const orphanReplies =
    comments?.filter(
      (comment) =>
        comment.replyTo && !comments.find((c) => c.id === comment.replyTo),
    ) ?? [];

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
    orphanReplies,
    handleMoreReplies,
  };
};
