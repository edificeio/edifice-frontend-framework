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

  const comments = useMemo(
    () => {
      if (type === 'edit') {
        return (
          defaultComments
            ?.sort((a, b) => b.createdAt - a.createdAt)
            .slice(0, commentLimit) ?? []
        );
      } else {
        return defaultComments?.sort((a, b) => b.createdAt - a.createdAt) ?? [];
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [commentLimit, defaultComments],
  );

  const commentsCount =
    comments?.filter((comment) => !comment.deleted)?.length ?? 0;
  const defaultCommentsCount =
    defaultComments?.filter((comment) => !comment.deleted)?.length ?? 0;

  const title =
    defaultCommentsCount && defaultCommentsCount > 1
      ? t('comment.several', { number: defaultCommentsCount })
      : t('comment.little', { number: defaultCommentsCount });

  const handleMoreComments = () => {
    const newLimit = comments?.length + (options.additionalComments ?? 5);

    if (newLimit === comments.length) return;

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
    defaultCommentsCount,
    comments,
    editCommentId,
    setEditCommentId,
    replyToCommentId,
    setReplyToCommentId,
    commentsCount,
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
