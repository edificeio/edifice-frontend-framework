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

  const usersIds: string[] = Array.from(
    new Set(defaultComments?.map((comment) => comment.authorId)),
  );

  const profilesQueries = useProfileQueries(usersIds);

  const idsOfDeletedCommentWithNoReply: string[] = useMemo(
    () =>
      defaultComments
        ?.filter(
          (comment) =>
            comment.deleted &&
            !defaultComments.some((c) => c.replyTo === comment.id),
        )
        .map((comment) => comment.id) ?? [],
    [defaultComments],
  );

  /**
   * Get comments filtered by non reply comment and non deleted comments that have reply.
   * Sorted by date.
   * If type is "edit" then limit the number of comments to paginate comments.
   * This constant is used by the CommentList component through Context to display comments.
   * Comments and Replies have their own pagination. In this hook, we only handle Comments pagination.
   * Replies Pagination is handled by the CommentReplies component.
   */
  const displayedComments: CommentProps[] = useMemo(
    () => {
      const result =
        defaultComments
          ?.filter(
            (comment) =>
              !comment.replyTo &&
              !idsOfDeletedCommentWithNoReply.includes(comment.id),
          )
          ?.sort((a, b) => b.createdAt - a.createdAt) ?? [];

      if (type === 'edit') {
        return result.slice(0, commentLimit) ?? [];
      }
      return result;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [commentLimit, defaultComments],
  );

  // Used to display the Show more comments button.
  // Compares the number of comments displayed with the number of total comments.
  // We need to exclude deleted comments that have no replies from the calculation.
  const showMoreComments: boolean =
    displayedComments?.length <
    (defaultComments?.filter(
      (comment) =>
        !comment.replyTo &&
        !idsOfDeletedCommentWithNoReply.includes(comment.id),
    )?.length ?? 0);

  // Used to display the number of comments in the title.
  const titleCommentsCount: number =
    defaultComments?.filter((comment) => !comment.deleted)?.length ?? 0;

  // Title of the comments section. It displays the number of comments.
  const title: string =
    titleCommentsCount > 1
      ? t('comment.several', { number: titleCommentsCount })
      : t('comment.little', { number: titleCommentsCount });

  /**
   * Handle the parent comments pagination.
   * @returns void
   */
  const handleMoreComments = () => {
    const newLimit =
      displayedComments.length + (options.additionalComments ?? 5);
    if (newLimit === displayedComments.length) return;
    setCommentLimit(newLimit);
  };

  const handleReset = () => {
    if (editCommentId) setEditCommentId(null);
  };

  /**
   * Called when the user clicks on the Delete button of a comment.
   * @param id the comment id to delete
   * @returns void
   */
  const handleDeleteComment = (id: string) => {
    if (type === 'edit') {
      callbacks?.delete(id);
    }
  };

  /**
   * Called when the user clicks on the Save button when updating a comment.
   * @param comment the comment content to update
   * @returns void
   */
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

  /**
   * Called when the user clicks on the Send button of the creation comment form.
   * @param content the comment content to post
   * @param replyTo if the comment is a reply, the id of the parent comment
   * @returns void
   */
  const handleCreateComment = (content: string, replyTo?: string) => {
    // Call the post callback.
    if (type === 'edit') {
      callbacks?.post(content, replyTo);
    }
    // Hide the reply form if the user is replying to a comment.
    if (replyTo) {
      setReplyToCommentId(null);
    }
  };

  /**
   * Called when the user clicks on the Update button of a comment.
   * @param commentId the comment id to modify
   */
  const handleModifyComment = (commentId: string) => {
    setEditCommentId(commentId);
  };

  /**
   * Called when the user clicks on the reply button of a comment.
   * Used by the CommentReplies component to display the comment form for corresponding comment id.
   * @param commentId the comment id to reply to
   * @returns void
   */
  const handleReplyToComment = (commentId: string) => {
    setReplyToCommentId(commentId);
  };

  return {
    t,
    profilesQueries,
    title,
    user,
    emptyscreenPath: illuPad,
    displayedComments,
    showMoreComments,
    editCommentId,
    setEditCommentId,
    replyToCommentId,
    setReplyToCommentId,
    handleMoreComments,
    handleDeleteComment,
    handleCreateComment,
    handleModifyComment,
    handleUpdateComment,
    handleReplyToComment,
    handleReset,
  };
};
