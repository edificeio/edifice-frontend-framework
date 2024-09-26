import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button, EmptyScreen, useOdeClient, usePaths } from "../../..";
import { CommentForm } from "../components/CommentForm";
import { CommentHeader } from "../components/CommentHeader";
import { CommentList } from "../components/CommentList";
import {
  DEFAULT_ADD_COMMENTS,
  DEFAULT_MAX_COMMENTS,
  DEFAULT_MAX_COMMENT_LENGTH,
  DEFAULT_MAX_REPLIES,
  DEFAULT_MAX_REPLY_LENGTH,
} from "../constants";
import { CommentContext } from "../context/Context";
import { useProfileQueries } from "../hooks/useProfileQueries";
import { RootProps } from "../types";

const CommentProvider = ({
  comments: defaultComments,
  options: commentOptions,
  ...props
}: RootProps) => {
  const options = {
    maxCommentLength: DEFAULT_MAX_COMMENT_LENGTH,
    maxReplyLength: DEFAULT_MAX_REPLY_LENGTH,
    maxComments: DEFAULT_MAX_COMMENTS,
    additionalComments: DEFAULT_ADD_COMMENTS,
    maxReplies: DEFAULT_MAX_REPLIES,
    ...commentOptions,
  };

  const [content, setContent] = useState<string>("");
  const [editCommentId, setEditCommentId] = useState<string | null>(null);
  const [commentLimit, setCommentLimit] = useState(options.maxComments);
  const [imagePath] = usePaths();

  const { t } = useTranslation();
  const { user } = useOdeClient();
  const { type } = props;

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
    commentsCount && commentsCount > 1
      ? t("comment.several", { number: commentsCount })
      : t("comment.little", { number: commentsCount });

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
    if (type === "edit") {
      props.callbacks.reset?.();
    }
    setContent("");

    if (editCommentId) setEditCommentId(null);
  };

  const handleDeleteComment = (id: string) => {
    if (type === "edit") {
      props.callbacks.delete(id);
    }
  };

  const handleUpdateComment = (comment: string) => {
    if (editCommentId) {
      if (type === "edit") {
        props.callbacks.put({ comment, commentId: editCommentId });
      }

      setEditCommentId(null);
    }
  };

  const handleCreateComment = (content: string) => {
    if (type === "edit") {
      props.callbacks.post(content);
    }
    setContent("");
  };

  const handleModifyComment = (commentId: string) => {
    setEditCommentId(commentId);
  };

  const values = useMemo(
    () => ({
      comments,
      content,
      profiles: profilesQueries.data,
      editCommentId,
      options,
      type,
      setEditCommentId,
      handleCreateComment,
      handleModifyComment,
      handleUpdateComment,
      handleDeleteComment,
      handleReset,
      handleChangeContent,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [comments, content, editCommentId, profilesQueries, options],
  );

  return (
    <CommentContext.Provider value={values}>
      <div className="my-24">
        {type === "edit" && <CommentHeader title={title} />}

        <div className="my-24">
          {user && <CommentForm userId={user.userId} />}
          {commentsCount && !profilesQueries.isLoading ? (
            <>
              <CommentList />

              {commentsCount !== defaultCommentsCount && (
                <Button
                  variant="ghost"
                  color="tertiary"
                  onClick={handleMoreComments}
                  className="my-16"
                >
                  {t("comment.more")}
                </Button>
              )}
            </>
          ) : null}
        </div>

        {!commentsCount && type === "edit" && (
          <div className="comments-emptyscreen">
            <div className="comments-emptyscreen-wrapper">
              <EmptyScreen
                imageSrc={`${imagePath}/emptyscreen/illu-pad.svg`}
                size={150}
              />
            </div>
            <p>{t("comment.emptyscreen")}</p>
          </div>
        )}
      </div>
    </CommentContext.Provider>
  );
};

export default CommentProvider;
