import { createContext } from "react";
import {
  CommentOptions,
  CommentProps,
  UserProfileResult,
} from "./Comments.types";

export const CommentContext = createContext<{
  comments: CommentProps[] | undefined;
  content: string;
  editCommentId: string | null;
  profiles: (UserProfileResult | undefined)[];
  options: Partial<CommentOptions>;
  setEditCommentId: (value: string | null) => void;
  handleModifyComment: (commentId: string) => void;
  handleChangeContent: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleCreateComment: (content: string) => void;
  handleUpdateComment: (comment: string) => void;
  handleDeleteComment: (id: string) => void;
  handleReset: () => void;
} | null>(null);
