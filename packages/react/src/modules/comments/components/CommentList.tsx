import { useState } from 'react';
import { useEdificeClient } from '../../../providers/EdificeClientProvider/EdificeClientProvider.hook';
import { useCommentsContext } from '../hooks/useCommentsContext';
import { Comment } from './Comment';
import { CommentReplies } from './CommentReplies';

export function CommentList() {
  const [replyFormCommentId, setReplyFormCommentId] = useState('');

  const { user } = useEdificeClient();
  const { comments, profiles } = useCommentsContext();

  const handleReply = (commentId: string) => {
    setReplyFormCommentId(commentId);
  };

  return comments?.map((comment) => {
    const { authorId } = comment;

    const profile =
      profiles?.find((user) => user?.userId === authorId)?.profile ?? 'Guest';

    return (
      <div key={comment.id}>
        {!comment.replyTo && (
          <Comment
            comment={comment}
            profile={profile}
            userId={user?.userId as string}
            onReply={handleReply}
          />
        )}
        <CommentReplies
          parentComment={comment}
          replyFormCommentId={replyFormCommentId}
        />
      </div>
    );
  });
}
