import { useEffect, useState } from 'react';

import { Editor } from '@tiptap/react';

/**
 * Hook to track editor state changes in Tiptap v3.
 * Replaces the pattern of using `editor?.state` in useEffect dependencies.
 *
 * @param editor - The Tiptap editor instance
 * @returns A counter that increments on each editor update
 *
 * @example
 * ```tsx
 * const { editor } = useEditorContext();
 * const editorState = useEditorState(editor);
 *
 * useEffect(() => {
 *   const attrs = editor?.getAttributes('textStyle');
 *   // ... do something with attrs
 * }, [editor, editorState]);
 * ```
 */
export const useEditorState = (editor: Editor | null | undefined): number => {
  const [updateCount, setUpdateCount] = useState(0);

  useEffect(() => {
    if (!editor) return;

    const handleUpdate = () => {
      setUpdateCount((prev) => prev + 1);
    };

    // Listen to both selection changes and content updates
    editor.on('update', handleUpdate);

    return () => {
      editor.off('update', handleUpdate);
    };
  }, [editor]);

  return updateCount;
};
