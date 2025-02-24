import { useEdificeClient } from '../../../providers/EdificeClientProvider/EdificeClientProvider.hook';
import { useCommentsContext } from '../hooks/useCommentsContext';
import { Comment } from './Comment';

export function CommentList() {
  const { user } = useEdificeClient();

  const { comments, profiles } = useCommentsContext();

  return comments?.map((comment) => {
    const { authorId } = comment;

    const profile =
      profiles?.find((user) => user?.userId === authorId)?.profile ?? 'Guest';

    const replies = comments.filter((comm) => comm.replyTo === comment.id);

    return (
      <div key={comment.id}>
        {!comment.replyTo && (
          <Comment
            comment={comment}
            profile={profile}
            userId={user?.userId as string}
          />
        )}
        {replies &&
          replies.map((reply) => {
            return (
              <div key={reply.id} className={'ps-48'}>
                <Comment
                  comment={reply}
                  profile={profile}
                  userId={user?.userId as string}
                />
              </div>
            );
          })}
      </div>
    );
  });
}
