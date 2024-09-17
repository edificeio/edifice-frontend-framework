import { Save, Send } from "@edifice-ui/icons";

import { useQueries } from "@tanstack/react-query";
import { UserProfile, odeServices } from "edifice-ts-client";
import { ReactNode, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Avatar,
  Badge,
  Button,
  EmptyScreen,
  Heading,
  useDate,
  useDirectory,
  useOdeClient,
  usePaths,
} from "../..";
import { CommentContext } from "./Comments.context";
import { CommentProps, RootProps } from "./Comments.types";
import { useCommentsContext } from "./useCommentsContext";

const TextCounter = ({
  content,
  maxLength,
}: {
  content: string;
  maxLength: number;
}) => {
  return (
    <p className="small text-gray-700 p-2 text-end">
      {`${content?.length || 0} / ${maxLength}`}
    </p>
  );
};

const CommentHeader = ({ title }: { title: string }) => {
  return (
    <Heading level="h3" headingStyle="h3">
      {title}
    </Heading>
  );
};

const CommentTitle = ({ children }: { children: ReactNode }) => {
  return <span className="small text-gray-800">{children}</span>;
};

const CommentAvatar = ({ id }: { id: string }) => {
  const { getAvatarURL } = useDirectory();
  const { t } = useTranslation();

  return (
    <Avatar
      alt={t("comment.author.avatar")}
      size="sm"
      src={getAvatarURL(id, "user")}
      variant="circle"
    />
  );
};

const CommentDate = ({
  createdAt,
  updatedAt,
}: {
  createdAt: number;
  updatedAt: number | undefined;
}) => {
  const { fromNow } = useDate();
  const { t } = useTranslation();

  const getPublishedDate = (date: number) =>
    t("comment.publish.date", {
      date: fromNow(date),
    });

  const getUpdatedDate = (date: number) =>
    t("comment.update.date", {
      date: fromNow(date),
    });

  if (updatedAt) {
    return (
      <>
        <span className="small text-gray-700">|</span>
        <span className="small text-gray-700">{getUpdatedDate(updatedAt)}</span>
      </>
    );
  }

  return createdAt ? (
    <>
      <span className="small text-gray-700">|</span>
      <span className="small text-gray-700">{getPublishedDate(createdAt)}</span>
    </>
  ) : null;
};

const BadgeProfile = ({ profile }: { profile: UserProfile[number] }) => {
  const { t } = useTranslation();

  const getProfile = (profile: UserProfile[0]) => t(`${profile}`);
  return (
    <Badge
      variant={{
        type: "user",
        profile,
        background: true,
      }}
    >
      {getProfile(profile)}
    </Badge>
  );
};

const useProfileQueries = (usersIds: string[]) => {
  const results = useQueries({
    queries: usersIds.map((userId) => ({
      queryKey: ["post", userId],
      queryFn: async () => {
        const data = await odeServices.session().getUserProfile({ userId });
        return {
          userId,
          profile: data[0],
        };
      },
      staleTime: Infinity,
    })),
    combine: (results) => {
      return {
        data: results.map((result) => result.data),
        isLoading: results.some((result) => result.isLoading),
      };
    },
  });
  return results;
};

export function CommentList() {
  const { user } = useOdeClient();

  const { comments, profiles } = useCommentsContext();

  return comments?.map((comment) => {
    const { authorId } = comment;

    const profile =
      profiles?.find((user) => user?.userId === authorId)?.profile ?? "Guest";

    return (
      <Comment
        key={comment.id}
        comment={comment}
        profile={profile}
        userId={user?.userId as string}
      />
    );
  });
}

const useAutosizeTextArea = (
  autoFocus?: boolean,
): [
  React.RefObject<HTMLTextAreaElement>,
  (event: React.FocusEvent<HTMLTextAreaElement>) => void,
  () => void,
] => {
  const ref = useRef<HTMLTextAreaElement | null>(null);

  const resizeTextarea = () => {
    if (ref.current) {
      ref.current.style.height = "auto"; // Réinitialise la hauteur avant de recalculer
      const scrollHeight = ref.current.scrollHeight;
      ref.current.style.height = `${scrollHeight}px`; // Ajuste à la nouvelle hauteur
    }
  };

  useEffect(() => {
    resizeTextarea();

    if (autoFocus) ref.current?.focus();
  });

  const onFocus = (event: React.FocusEvent<HTMLTextAreaElement>) => {
    event.currentTarget.setSelectionRange(
      event.currentTarget.value.length + 1,
      event.currentTarget.value.length + 1,
    );
  };

  return [ref, onFocus, resizeTextarea];
};

const CommentForm = ({ userId }: { userId: string }) => {
  const { t } = useTranslation();
  const { content, handleChangeContent, handleCreateComment, options } =
    useCommentsContext();

  const [ref, onFocus] = useAutosizeTextArea();

  return (
    <div className="border rounded-3 p-12 pb-8 d-flex gap-12 bg-gray-200">
      <CommentAvatar id={userId as string} />
      <div className="d-flex flex-column flex-fill gap-4">
        <textarea
          id="add-comment"
          ref={ref}
          value={content}
          className="form-control"
          placeholder={t("comment.placeholder.textarea")}
          maxLength={options.maxCommentLength as number}
          onChange={handleChangeContent}
          onFocus={onFocus}
          rows={1}
          style={{ resize: "none", overflow: "hidden" }}
        />
        <div className="d-flex justify-content-end align-items-center gap-4">
          <TextCounter
            content={content}
            maxLength={options.maxCommentLength as number}
          />
          <Button
            type="submit"
            variant="ghost"
            size="sm"
            leftIcon={<Send />}
            disabled={!content?.length}
            onClick={() => handleCreateComment(content)}
          >
            {t("comment.post")}
          </Button>
        </div>
      </div>
    </div>
  );
};

const Comment = ({
  comment,
  userId,
  profile,
}: {
  comment: CommentProps;
  userId: string;
  profile: UserProfile[number];
}) => {
  const [value, setValue] = useState<string>("");

  const {
    id,
    authorId,
    authorName,
    createdAt,
    updatedAt,
    comment: content,
  } = comment;

  const [ref, onFocus, resizeTextarea] = useAutosizeTextArea(true);

  const { t } = useTranslation();

  const {
    editCommentId,
    options,
    handleDeleteComment: onDeleteComment,
    handleModifyComment,
    handleReset,
    handleUpdateComment,
  } = useCommentsContext();

  const isEditing = editCommentId === comment.id;

  const handleChangeContent = (
    event: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    resizeTextarea();
    setValue(event.target.value);
  };

  return (
    <div
      key={id}
      className={`${
        isEditing
          ? "border rounded-3 p-12 pb-8 d-flex gap-12 bg-gray-200  my-16"
          : "border rounded-3 p-12 pb-8 d-flex gap-12 mt-16"
      }`}
    >
      <CommentAvatar id={authorId} />
      <div className="flex flex-fill">
        <div className="d-flex align-items-center gap-12">
          <CommentTitle>{authorName}</CommentTitle>
          <BadgeProfile profile={profile} />
          <CommentDate createdAt={createdAt} updatedAt={updatedAt} />
        </div>

        {isEditing ? (
          <>
            <div className="mt-8 mb-4">
              <textarea
                id="update-comment"
                ref={ref}
                value={value}
                className="form-control"
                placeholder={t("comment.placeholder")}
                maxLength={options.maxCommentLength as number}
                onChange={handleChangeContent}
                rows={1}
                style={{ resize: "none", overflow: "hidden" }}
                onFocus={onFocus}
              />
            </div>
            <div className="d-flex justify-content-between align-items-center">
              <Button
                variant="ghost"
                color="tertiary"
                size="sm"
                onClick={handleReset}
              >
                {t("comment.cancel")}
              </Button>
              <div className="d-flex justify-content-end align-items-center gap-4">
                <TextCounter
                  content={value}
                  maxLength={options.maxCommentLength as number}
                />
                <Button
                  type="submit"
                  variant="ghost"
                  size="sm"
                  leftIcon={<Save />}
                  disabled={!content?.length}
                  onClick={() => handleUpdateComment(value)}
                >
                  {t("comment.save")}
                </Button>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="mt-8 mb-4">{content}</div>

            {userId === authorId && (
              <div className="ms-n8">
                <Button
                  variant="ghost"
                  color="tertiary"
                  size="sm"
                  onClick={() => {
                    handleModifyComment(comment.id);
                    setValue(content);
                  }}
                >
                  {t("comment.edit")}
                </Button>
                <Button
                  variant="ghost"
                  color="tertiary"
                  size="sm"
                  onClick={() => onDeleteComment(id)}
                >
                  {t("comment.remove")}
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

const CommentProvider = ({
  comments,
  callbacks,
  options: commentOptions,
}: RootProps) => {
  const options = {
    maxCommentLength: 200,
    maxReplyLength: 200,
    maxComments: 4,
    additionalComments: 5,
    maxReplies: 5,
    ...commentOptions,
  };

  const [content, setContent] = useState<string>("");
  const [editCommentId, setEditCommentId] = useState<string | null>(null);
  const [commentLimit, setCommentLimit] = useState(options.maxComments);
  const [imagePath] = usePaths();

  const { t } = useTranslation();
  const { user } = useOdeClient();

  const usersIds = Array.from(
    new Set(comments?.map((comment) => comment.authorId)),
  );

  const profilesQueries = useProfileQueries(usersIds);

  const commentsCount = comments?.length ?? 0;

  const title =
    commentsCount && commentsCount > 1
      ? t("comment.several", { number: commentsCount })
      : t("comment.little", { number: commentsCount });

  const sortedComments = comments?.sort((a, b) => b.createdAt - a.createdAt);

  const displayedComments = useMemo(
    () => sortedComments?.slice(0, commentLimit) ?? [],
    [sortedComments, commentLimit],
  );

  const handleMoreComments = () => {
    const newLimit =
      displayedComments?.length + (options.additionalComments ?? 5);

    if (newLimit === displayedComments.length) return;

    setCommentLimit(newLimit);
  };

  const handleChangeContent = (
    event: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    setContent(event.target.value);
  };

  const handleReset = () => {
    callbacks.reset?.();
    setContent("");

    if (editCommentId) setEditCommentId(null);
  };

  const handleDeleteComment = (id: string) => {
    callbacks.delete(id);
  };

  const handleUpdateComment = (comment: string) => {
    if (editCommentId) {
      callbacks.put({ comment, commentId: editCommentId });
      setEditCommentId(null);
    }
  };

  const handleCreateComment = (content: string) => {
    callbacks.post(content);
    setContent("");
  };

  const handleModifyComment = (commentId: string) => {
    setEditCommentId(commentId);
  };

  const values = useMemo(
    () => ({
      comments: displayedComments,
      content,
      profiles: profilesQueries.data,
      editCommentId,
      options,
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
          {commentsCount && !profilesQueries.isLoading ? (
            <>
              <CommentList />

              {displayedComments.length !== comments?.length && (
                <Button
                  variant="ghost"
                  color="tertiary"
                  onClick={handleMoreComments}
                  className="my-16"
                >
                  Lire plus de commentaires
                </Button>
              )}
            </>
          ) : null}
        </div>

        {!commentsCount && (
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
