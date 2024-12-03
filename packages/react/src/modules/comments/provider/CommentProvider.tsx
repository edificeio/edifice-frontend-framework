import { useMemo } from "react";
import { Button, EmptyScreen } from "../../..";
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
import { useComments } from "../hooks/useComments";
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

  const { type } = props;

  const {
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
  } = useComments({
    type,
    defaultComments,
    callbacks: type == "edit" ? props.callbacks : null,
    options,
  });

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
        <CommentHeader title={title} />

        <div className="my-24">
          {user && <CommentForm userId={user.userId} />}
          {!profilesQueries.isLoading ? (
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
              <EmptyScreen imageSrc={emptyscreenPath} size={150} />
            </div>
            <p>{t("comment.emptyscreen")}</p>
          </div>
        )}
      </div>
    </CommentContext.Provider>
  );
};

export default CommentProvider;
