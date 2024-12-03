import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { usePaths } from "../../..";
import { useEdificeClient } from "../../../providers/EdificeClientProvider/EdificeClientProvider.hook";
import {
  CommentCallbacks,
  CommentOptions,
  CommentProps,
  CommentType,
} from "../types";
import { useProfileQueries } from "./useProfileQueries";

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
  const [content, setContent] = useState<string>("");
  const [editCommentId, setEditCommentId] = useState<string | null>(null);
  const [commentLimit, setCommentLimit] = useState(options.maxComments);
  const [imagePath] = usePaths();

  const { t } = useTranslation();
  const { user } = useEdificeClient();

  const emptyscreenPath = `${imagePath}/emptyscreen/illu-pad.svg`;

  const usersIds = Array.from(
    new Set(defaultComments?.map((comment) => comment.authorId)),
  );

  const profilesQueries = useProfileQueries(usersIds);

  const comments = useMemo(
    () => {
      if (type === "edit") {
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

  const commentsCount = comments?.length ?? 0;
  const defaultCommentsCount = defaultComments?.length ?? 0;

  const title =
    defaultCommentsCount && defaultCommentsCount > 1
      ? t("comment.several", { number: defaultCommentsCount })
      : t("comment.little", { number: defaultCommentsCount });

  const handleMoreComments = () => {
    const newLimit = comments?.length + (options.additionalComments ?? 5);

    if (newLimit === comments.length) return;

    setCommentLimit(newLimit);
  };

  const handleChangeContent = (
    event: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    setContent(event.target.value);
  };

  const handleReset = () => {
    setContent("");

    if (editCommentId) setEditCommentId(null);
  };

  const handleDeleteComment = (id: string) => {
    if (type === "edit") {
      callbacks?.delete(id);
    }
  };

  const handleUpdateComment = (comment: string) => {
    if (editCommentId) {
      if (type === "edit") {
        callbacks?.put({ comment, commentId: editCommentId });
      }

      setEditCommentId(null);
    }
  };

  const handleCreateComment = (content: string) => {
    if (type === "edit") {
      callbacks?.post(content);
    }
    setContent("");
  };

  const handleModifyComment = (commentId: string) => {
    setEditCommentId(commentId);
  };

  return {
    profilesQueries,
    content,
    title,
    user,
    emptyscreenPath,
    defaultCommentsCount,
    comments,
    editCommentId,
    setEditCommentId,
    commentsCount,
    t,
    handleMoreComments,
    handleChangeContent,
    handleDeleteComment,
    handleCreateComment,
    handleModifyComment,
    handleUpdateComment,
    handleReset,
  };
};
