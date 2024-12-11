import { createContext, useContext } from 'react';

export interface DropzoneContextType {
  inputRef: React.MutableRefObject<HTMLInputElement | null>;
  files: File[];
  addFile: (file: File) => void;
  deleteFile: (file: File) => void;
  replaceFileAt: (index: number, file: File) => void;
}

export const DropzoneContext = createContext<DropzoneContextType | null>(null);

export function useDropzoneContext() {
  const context = useContext(DropzoneContext);
  if (!context) {
    throw new Error('Cannot be rendered outside Dropzone Provider');
  }
  return context;
}
