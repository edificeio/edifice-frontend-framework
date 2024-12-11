import { ReactNode } from 'react';

export const CommentTitle = ({ children }: { children: ReactNode }) => {
  return <span className="small text-gray-800">{children}</span>;
};
