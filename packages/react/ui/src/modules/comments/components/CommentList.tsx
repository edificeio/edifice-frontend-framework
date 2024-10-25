import { useOdeClient } from "../../..";
import { useCommentsContext } from "../hooks/useCommentsContext";
import { Comment } from "./Comment";

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
