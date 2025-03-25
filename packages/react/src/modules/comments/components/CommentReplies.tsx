import { CommentProps } from '../types';
import { Comment } from './Comment';
import { CommentForm } from './CommentForm';
import { Button } from '../../..';
import { useCommentReplies } from '../hooks/useCommentReplies';

export const CommentReplies = ({
  parentComment,
}: {
  parentComment: CommentProps;
}) => {
  const {
    t,
    profiles,
    user,
    displayedReplies,
    showCommentForm,
    showMoreReplies,
    handleMoreReplies,
  } = useCommentReplies({ parentComment });

  return (
    <div className="comments-replies-container">
      {showCommentForm && (
        <div className="comments-replies-form">
          <CommentForm
            userId={user?.userId as string}
            replyTo={parentComment.id}
          />
        </div>
      )}

      <div className="comments-replies-list">
        {displayedReplies.map((reply) => {
          const profile =
            profiles?.find((user) => user?.userId === reply.authorId)
              ?.profile ?? 'Guest';

          if (!reply.deleted) {
            return (
              <div key={reply.id} className="comments-replies-reply">
                <Comment
                  comment={reply}
                  profile={profile}
                  userId={user?.userId as string}
                />
              </div>
            );
          }
        })}
      </div>

      {showMoreReplies && (
        <Button
          variant="ghost"
          color="tertiary"
          onClick={handleMoreReplies}
          className="ms-24"
        >
          {t('comment.more.replies')}
        </Button>
      )}
    </div>
  );
};
