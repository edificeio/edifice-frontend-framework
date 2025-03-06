import { RightRole } from '@edifice.io/client';
import { createContext } from 'react';
import {
  CommentOptions,
  CommentProps,
  CommentType,
  UserProfileResult,
} from '../types';

export const CommentContext = createContext<{
  comments: CommentProps[] | undefined;
  editCommentId: string | null;
  profiles: (UserProfileResult | undefined)[];
  options: Partial<CommentOptions>;
  type: CommentType;
  userRights?: Record<RightRole, boolean>;
  setEditCommentId: (value: string | null) => void;
  handleModifyComment: (commentId: string) => void;
  handleCreateComment: (content: string, replyTo?: string) => void;
  handleUpdateComment: (comment: string) => void;
  handleDeleteComment: (id: string) => void;
  handleReset: () => void;
} | null>(null);
