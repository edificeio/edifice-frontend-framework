import { createContext, useContext } from 'react';

import { Editor } from '@tiptap/react';

export const EditorContext = createContext<{
  /**
   * Application code (example: "blog")
   */
  appCode: string;

  /**
   * TipTap editor instance
   */
  editor: Editor | null;
  /**
   * To know if TipTap editor is editable
   */
  editable: boolean;
  /**
   * Id of the editor's HTMLElement
   */
  id: string;
}>(null!);

export function useEditorContext() {
  const context = useContext(EditorContext);
  if (!context) {
    throw new Error(
      `Editor compound components cannot be rendered outside the Editor component`,
    );
  }
  return context;
}
