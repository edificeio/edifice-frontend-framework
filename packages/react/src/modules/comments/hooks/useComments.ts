import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useEdificeClient } from '../../../providers/EdificeClientProvider/EdificeClientProvider.hook';
import {
  CommentCallbacks,
  CommentOptions,
  CommentProps,
  CommentType,
} from '../types';
import { useProfileQueries } from './useProfileQueries';

import illuPad from '@edifice.io/bootstrap/dist/images/emptyscreen/illu-pad.svg';

export const useComments = ({
  defaultComments,
  options,
  type,
  callbacks,
}: {
  defaultComments: CommentProps[] | undefined;
  options: CommentOptions;
  type: CommentType;
  callbacks: CommentCallbacks | null;
}) => {
  const [editCommentId, setEditCommentId] = useState<string | null>(null);
  const [replyToCommentId, setReplyToCommentId] = useState<string | null>(null);
  const [commentLimit, setCommentLimit] = useState(options.maxComments);

  const { t } = useTranslation();
  const { user } = useEdificeClient();

  const usersIds = Array.from(
    new Set(defaultComments?.map((comment) => comment.authorId)),
  );

  const profilesQueries = useProfileQueries(usersIds);

  const limitedSortedParentComments = useMemo(
    () => {
      const filteredAndSortedComments =
        defaultComments
          ?.filter((comment) => !comment.replyTo)
          ?.sort((a, b) => b.createdAt - a.createdAt) ?? [];

      if (type === 'edit') {
        return filteredAndSortedComments.slice(0, commentLimit) ?? [];
      }
      return filteredAndSortedComments;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [commentLimit, defaultComments],
  );

  const limitedSortedParentCommentsCount =
    limitedSortedParentComments?.length ?? 0;
  const defaultParentCommentsCount =
    defaultComments?.filter((comment) => !comment.replyTo)?.length ?? 0;

  const title =
    defaultComments?.length && defaultComments?.length > 1
      ? t('comment.several', { number: defaultComments?.length })
      : t('comment.little', { number: defaultComments?.length });

  const handleMoreComments = () => {
    const filteredComments = limitedSortedParentComments?.filter(
      (comment) => !comment.replyTo,
    );

    const newLimit =
      filteredComments?.length + (options.additionalComments ?? 5);

    if (newLimit === filteredComments?.length) return;

    setCommentLimit(newLimit);
  };

  const handleReset = () => {
    if (editCommentId) setEditCommentId(null);
  };

  const handleDeleteComment = (id: string) => {
    if (type === 'edit') {
      callbacks?.delete(id);
    }
  };

  const handleUpdateComment = async (comment: string) => {
    if (editCommentId) {
      if (type === 'edit') {
        callbacks?.put({
          comment,
          commentId: editCommentId,
        });
      }

      setEditCommentId(null);
    }
  };

  const handleCreateComment = (content: string, replyTo?: string) => {
    if (type === 'edit') {
      callbacks?.post(content, replyTo);
    }

    if (replyTo) {
      setReplyToCommentId(null);
    }
  };

  const handleModifyComment = (commentId: string) => {
    setEditCommentId(commentId);
  };

  const handleReplyToComment = (commentId: string) => {
    setReplyToCommentId(commentId);
  };

  return {
    profilesQueries,
    title,
    user,
    emptyscreenPath: illuPad,
    defaultParentCommentsCount,
    limitedSortedParentComments,
    editCommentId,
    setEditCommentId,
    replyToCommentId,
    setReplyToCommentId,
    limitedSortedParentCommentsCount,
    t,
    handleMoreComments,
    handleDeleteComment,
    handleCreateComment,
    handleModifyComment,
    handleUpdateComment,
    handleReplyToComment,
    handleReset,
  };
};
