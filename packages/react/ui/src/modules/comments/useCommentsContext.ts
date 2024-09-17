import { useContext } from "react";
import { CommentContext } from "./Comments.context";

export const useCommentsContext = () => {
  const context = useContext(CommentContext);
  if (!context) {
    throw new Error(`Cannot be rendered outside the Card component`);
  }
  return context;
};
