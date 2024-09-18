import { UserProfile } from "edifice-ts-client";

export interface CommentProps {
  id: string;
  comment: string;
  authorId: string;
  authorName: string;
  createdAt: number;
  updatedAt?: number;
}

export interface CommentCallbacks {
  post: (comment: string) => Promise<void>;
  put: ({
    comment,
    commentId,
  }: {
    comment: string;
    commentId: string;
  }) => Promise<void>;
  delete: (commentId: string) => Promise<void>;
  reset?: () => void;
}

interface BaseProps {
  comments: CommentProps[] | undefined;
  options?: Partial<CommentOptions>;
}
interface EditRootProps extends BaseProps {
  type: "edit";
  callbacks: CommentCallbacks;
}

interface ReadRootProps extends BaseProps {
  type: "read";
}

export type RootProps = EditRootProps | ReadRootProps;


export type CommentOptions = {
  /**
   * Set new comment limit
   */
  maxCommentLength: number;
  /**
   * Setting the limit on a response
   */
  maxReplyLength: number;
  /**
   * Limit for displaying comments in the list
   */
  maxComments: number;
  /**
   * Number of comments to load additionally
   */
  additionalComments: number;
  /**
     * Limit on displaying replies to a comment
  
     */
  maxReplies: number;
};

export interface UserProfileResult {
  userId: string;
  profile: UserProfile[number];
}

export type CommentType = "read" | "edit";
