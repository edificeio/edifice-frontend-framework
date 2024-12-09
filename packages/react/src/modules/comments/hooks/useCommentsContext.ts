import { useContext } from 'react';
import { CommentContext } from '../context/Context';

export const useCommentsContext = () => {
  const context = useContext(CommentContext);
  if (!context) {
    throw new Error(`Cannot be rendered outside the Card component`);
  }
  return context;
};
