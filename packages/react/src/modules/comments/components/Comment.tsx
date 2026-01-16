import { UserProfile } from '@edifice.io/client';
import { lazy, Suspense, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, LoadingScreen } from '../../..';
import { IconSave } from '../../icons/components';
import { useAutosizeTextarea } from '../hooks/useAutosizeTextarea';
import { useCommentsContext } from '../hooks/useCommentsContext';
import { CommentProps } from '../types';
import { BadgeProfile } from './BadgeProfile';
import { CommentAvatar } from './CommentAvatar';
import { CommentDate } from './CommentDate';
import { CommentTitle } from './CommentTitle';
//import { DeleteModal } from './DeleteModal';
import { CommentDeleted } from './CommentDeleted';
import { CommentReplies } from './CommentReplies';
import { TextCounter } from './TextCounter';

const DeleteModal = lazy(() => import('./DeleteModal'));

export const Comment = ({
  comment,
  userId,
  profile,
}: {
  comment: CommentProps;
  userId: string;
  profile: UserProfile[number];
}) => {
  const [value, setValue] = useState<string>('');

  const {
    id,
    authorId,
    authorName,
    createdAt,
    updatedAt,
    comment: content,
    replyTo,
  } = comment;

  const [ref, onFocus, resizeTextarea] = useAutosizeTextarea(true);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const { t } = useTranslation();

  const {
    defaultComments,
    editCommentId,
    options,
    type,
    userRights,
    handleDeleteComment: onDeleteComment,
    handleModifyComment,
    handleReset,
    handleUpdateComment,
    handleReplyToComment,
  } = useCommentsContext();

  const replies =
    defaultComments?.filter((comm) => comm.replyTo === comment.id) ?? [];

  const hasReplies = replies.length > 0;
  const hasAllDeletedReplies = replies.every((reply) => reply.deleted);

  const isEditing = editCommentId === comment.id;

  const handleChangeContent = (
    event: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    resizeTextarea();
    setValue(event.target.value);
  };

  const handleDeleteComment = (id: string) => {
    onDeleteComment(id);
    setIsDeleteModalOpen(false);
  };

  return (
    <>
      {comment.deleted && hasReplies && !hasAllDeletedReplies && (
        <>
          <CommentDeleted />
          <CommentReplies parentComment={comment} />
        </>
      )}
      {!comment.deleted && (
        <>
          <div
            data-testid="div-comment-read"
            key={id}
            className={`${
              isEditing
                ? 'border rounded-3 p-12 pb-8 d-flex gap-12 bg-gray-200  my-16'
                : 'border rounded-3 p-12 pb-8 d-flex gap-12 mt-16'
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
                      placeholder={t('comment.placeholder')}
                      maxLength={options.maxCommentLength as number}
                      onChange={handleChangeContent}
                      rows={1}
                      style={{ resize: 'none', overflow: 'hidden' }}
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
                      {t('comment.cancel')}
                    </Button>
                    <div className="d-flex justify-content-end align-items-center gap-4">
                      <TextCounter
                        content={value}
                        maxLength={options.maxCommentLength as number}
                      />
                      <Button
                        data-testid="comment-save"
                        type="submit"
                        variant="ghost"
                        size="sm"
                        leftIcon={<IconSave />}
                        disabled={!content?.length}
                        onClick={() => handleUpdateComment(value)}
                      >
                        {t('comment.save')}
                      </Button>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="mt-8 mb-4" style={{ whiteSpace: 'pre-line' }}>
                    {content}
                  </div>
                  {type === 'edit' && (
                    <div className="ms-n8">
                      {!replyTo && options.allowReplies && (
                        <Button
                          variant="ghost"
                          color="tertiary"
                          size="sm"
                          onClick={() => handleReplyToComment(comment.id)}
                        >
                          {t('comment.reply')}
                        </Button>
                      )}
                      {userId === authorId && (
                        <Button
                          data-testid="comment-edit"
                          variant="ghost"
                          color="tertiary"
                          size="sm"
                          onClick={() => {
                            handleModifyComment(comment.id);
                            setValue(content);
                          }}
                        >
                          {t('comment.edit')}
                        </Button>
                      )}
                      {(userId === authorId || userRights?.manager) && (
                        <Button
                          data-testid="comment-delete"
                          variant="ghost"
                          color="tertiary"
                          size="sm"
                          onClick={() => setIsDeleteModalOpen(true)}
                        >
                          {t('comment.remove')}
                        </Button>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          <CommentReplies parentComment={comment} />

          <Suspense fallback={<LoadingScreen position={false} />}>
            {isDeleteModalOpen && (
              <DeleteModal
                isOpen={isDeleteModalOpen}
                onCancel={() => setIsDeleteModalOpen(false)}
                onSuccess={() => handleDeleteComment(id)}
              />
            )}
          </Suspense>
        </>
      )}
    </>
  );
};
