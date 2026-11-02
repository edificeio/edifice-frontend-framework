import { Editor } from '@tiptap/react';
import { useToggle } from '../../../hooks';

/**
 * Custom hook to manage MathsModal events in an editor.
 * @param editor an instance
 * @returns {
 * `isOpen`: truthy boolean when MathsModal sholud be visible,
 * `toggle`: an imperative function to toggle the `isOpen` value,
 * `onCancel`: Cancel event handler,
 * `onSuccess`: Success event handler (adds a formula to the editor content),
 * }
 */
export const useMathsModal = (editor: Editor | null) => {
  const [isOpen, toggle] = useToggle(false);

  const onCancel = () => {
    toggle();
  };

  const onSuccess = (latex: string) => {
    // A raw `$...$` string here would NOT become a math node: TipTap's input
    // rules (which convert that syntax) only fire on live keystrokes, never
    // on a programmatic content insertion like this one - insert the node
    // directly instead.
    if (latex) {
      editor?.commands.insertContentAt(editor.view.state.selection, {
        type: 'inlineMath',
        attrs: { latex },
      });
    }
    editor?.commands.enter();
    toggle();
  };

  return {
    isOpen,
    toggle,
    onCancel,
    onSuccess,
  };
};
