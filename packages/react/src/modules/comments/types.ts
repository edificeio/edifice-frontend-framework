import { RightRole, UserProfile } from '@edifice.io/client';

export interface CommentProps {
  /**
   * Comment Id
   */
  id: string;
  /**
   * Comment text
   */
  comment: string;
  /**
   * Author Id
   */
  authorId: string;
  /**
   * Name of the author of the comment
   */
  authorName: string;
  /**
   * Date when comment was created
   */
  createdAt: number;
  /**
   * Date when comment was updated
   */
  updatedAt?: number;
  /**
   * The comment parent ID.
   */
  replyTo?: string;
  /**
   * If the comment is deleted.
   */
  deleted?: boolean;
}

export interface CommentCallbacks {
  /**
   * Method to create a new comment
   * Get the new comment in the callback function
   * If replyTo is provided, it is a reply to a comment
   */
  post: (comment: string, replyTo?: string) => Promise<void>;
  /**
   * Method to update a comment
   * Get the comment and commentId in the callback function
   */
  put: ({
    comment,
    commentId,
  }: {
    comment: string;
    commentId: string;
  }) => Promise<void>;
  /**
   * Method to delete a comment
   * Get the commentId in the callback function
   */
  delete: (commentId: string) => Promise<void>;
}

interface BaseProps {
  /**
   * List of comments
   */
  comments: CommentProps[] | undefined;
  /**
   * Options to configure CommentProvider
   */
  options?: Partial<CommentOptions>;
}

interface EditRootProps extends BaseProps {
  type: 'edit';
  /**
   * Callbacks to perform CRUD on comment
   */
  callbacks: CommentCallbacks;
  /**
   * Rights to perform CRUD on comment
   */
  rights?: Record<RightRole, boolean>;
}

interface ReadRootProps extends BaseProps {
  type: 'read';
}

export type RootProps = EditRootProps | ReadRootProps;

export type CommentOptions = {
  /**
   * Setting the text limit on a comment
   */
  maxCommentLength: number;
  /**
   * Setting the text limit on a response
   */
  maxReplyLength: number;
  /**
   * Limit for displaying comments in the list
   */
  maxComments: number;
  /**
   * Number of comments to load additionally in the limited list
   */
  additionalComments: number;
  /**
   * Limit on displaying replies to a comment
   */
  maxReplies: number;
  /**
   * Number of replies to load additionally in the limited list
   */
  additionalReplies: number;
};

export interface UserProfileResult {
  /**
   * If of a user
   */
  userId: string;
  /**
   * Profile of a user (Teacher, Student, ...)
   */
  profile: UserProfile[number];
}

export type CommentType = 'read' | 'edit';
