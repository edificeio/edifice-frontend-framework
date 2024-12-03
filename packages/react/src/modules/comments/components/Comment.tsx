import { UserProfile } from "@edifice.io/ts-client";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "../../..";
import { IconSave } from "../../icons/components";
import { useAutosizeTextarea } from "../hooks/useAutosizeTextarea";
import { useCommentsContext } from "../hooks/useCommentsContext";
import { CommentProps } from "../types";
import { BadgeProfile } from "./BadgeProfile";
import { CommentAvatar } from "./CommentAvatar";
import { CommentDate } from "./CommentDate";
import { CommentTitle } from "./CommentTitle";
import { TextCounter } from "./TextCounter";

export const Comment = ({
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

  const [ref, onFocus, resizeTextarea] = useAutosizeTextarea(true);

  const { t } = useTranslation();

  const {
    editCommentId,
    options,
    type,
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
                  leftIcon={<IconSave />}
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

            {userId === authorId && type === "edit" && (
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
