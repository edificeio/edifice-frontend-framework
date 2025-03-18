import { useCommentsContext } from '../hooks/useCommentsContext';
import { CommentProps } from '../types';
import { Comment } from './Comment';
import { CommentForm } from './CommentForm';
import { Button } from '../../..';
import { useCommentReplies } from '../hooks/useCommentReplies';

export const CommentReplies = ({
  parentComment,
  replyFormCommentId,
}: {
  parentComment: CommentProps;
  replyFormCommentId: string;
}) => {
  const { comments, profiles, options } = useCommentsContext();
  const { t, user, profile, slicedReplies, defaultReplies, handleMoreReplies } =
    useCommentReplies({ parentComment, comments, profiles, options });
  const showCommentForm =
    replyFormCommentId === parentComment.id && !parentComment.deleted;

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
        {slicedReplies.map((reply) => (
          <div key={reply.id} className="comments-replies-reply">
            <Comment
              comment={reply}
              profile={profile}
              userId={user?.userId as string}
            />
          </div>
        ))}
      </div>

      {slicedReplies.length < defaultReplies?.length && (
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
