import { useCommentsContext } from '../hooks/useCommentsContext';
import { CommentProps } from '../types';
import { Comment } from './Comment';
import { useEdificeClient } from '../../../providers/EdificeClientProvider/EdificeClientProvider.hook';
import { CommentForm } from './CommentForm';

export const CommentReplies = ({
  parent: comment,
  replyFormCommentId,
}: {
  parent: CommentProps;
  replyFormCommentId: string;
}) => {
  const { user } = useEdificeClient();
  const { comments, profiles } = useCommentsContext();

  const { authorId } = comment;
  const profile =
    profiles?.find((user) => user?.userId === authorId)?.profile ?? 'Guest';

  const replies = comments?.filter((comm) => comm.replyTo === comment.id);

  return (
    <>
      {replyFormCommentId === comment.id && (
        <div className="ps-48 mt-16">
          <CommentForm userId={user?.userId as string} replyTo={comment.id} />
        </div>
      )}

      {replies?.map((reply) => (
        <div key={reply.id} className={'ps-48'}>
          <Comment
            comment={reply}
            profile={profile}
            userId={user?.userId as string}
          />
        </div>
      ))}
    </>
  );
};
