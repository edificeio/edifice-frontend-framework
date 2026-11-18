import { useEffect } from 'react';

import type { EditorFeedback } from '@edifice.io/tiptap-extensions/feedback';
import { Editor } from '@tiptap/react';
import { useTranslation } from 'react-i18next';

import useToast from '../../../hooks/useToast/useToast';

/**
 * Display the feedbacks raised by the editor extensions (see the "feedback"
 * tiptap extension) as toasts.
 *
 * The message is looked up with the i18n key
 * `tiptap.feedback.<source>.<code>`, falling back to
 * `tiptap.feedback.<source>.default`.
 */
export const useEditorFeedback = (editor: Editor | null) => {
  const { t } = useTranslation();
  const toast = useToast();

  useEffect(() => {
    if (!editor) return;

    const handleFeedback = ({ feedback }: { feedback: EditorFeedback }) => {
      const { source, code, level } = feedback;
      const message = t([
        `tiptap.feedback.${source}.${code}`,
        `tiptap.feedback.${source}.default`,
      ]);
      // A stable id prevents the same feedback from stacking up.
      toast[level](message, { id: `tiptap-feedback-${source}-${code}` });
    };

    editor.on('feedback', handleFeedback);
    return () => {
      editor.off('feedback', handleFeedback);
    };
    // `toast` is a new object on each render, but its methods are stable.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editor, t]);
};
