import { ReactNode } from 'react';

export const CommentTitle = ({ children }: { children: ReactNode }) => {
  return (
    <span data-testid="comment-info-author" className="small text-gray-800">
      {children}
    </span>
  );
};
