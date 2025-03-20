import { useEdificeClient } from '../../../providers/EdificeClientProvider/EdificeClientProvider.hook';
import { useCommentsContext } from '../hooks/useCommentsContext';
import { Comment } from './Comment';

export function CommentList() {
  const { user } = useEdificeClient();
  const { limitedSortedParentComments, profiles } = useCommentsContext();

  return limitedSortedParentComments?.map((comment) => {
    const { authorId } = comment;

    const profile =
      profiles?.find((user) => user?.userId === authorId)?.profile ?? 'Guest';

    return (
      <div key={comment.id}>
        <Comment
          comment={comment}
          profile={profile}
          userId={user?.userId as string}
        />
      </div>
    );
  });
}
