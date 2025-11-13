import { useEdificeClient } from '../../../providers/EdificeClientProvider/EdificeClientProvider.hook';
import { useCommentsContext } from '../hooks/useCommentsContext';
import { Comment } from './Comment';

export function CommentList() {
  const { user } = useEdificeClient();
  const { displayedComments, profiles } = useCommentsContext();

  return displayedComments?.map((comment) => {
    const { authorId } = comment;

    const profile =
      profiles?.find((user) => user?.userId === authorId)?.profile ?? 'Guest';

    return (
      <div id={`comment-${comment.id}`} key={comment.id}>
        <Comment
          comment={comment}
          profile={profile}
          userId={user?.userId as string}
        />
      </div>
    );
  });
}
