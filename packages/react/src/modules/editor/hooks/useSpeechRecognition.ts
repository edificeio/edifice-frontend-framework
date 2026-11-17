import { useEffect, useState } from 'react';

import { odeServices } from '@edifice.io/client';
import type { EditorFeedback } from '@edifice.io/tiptap-extensions/feedback';
import { Editor } from '@tiptap/react';

export const useSpeechRecognition = (editor: Editor | null) => {
  const [isActive, setActive] = useState(false);

  // A recognition error ends the recognition: reflect it in the UI state.
  useEffect(() => {
    if (!editor) return;

    const handleFeedback = ({ feedback }: { feedback: EditorFeedback }) => {
      if (
        feedback.source === 'speech-recognition' &&
        feedback.level === 'error'
      )
        setActive(false);
    };

    editor.on('feedback', handleFeedback);
    return () => {
      editor.off('feedback', handleFeedback);
    };
  }, [editor]);

  const toggle = () => {
    if (isActive) {
      editor?.commands.stopSpeechRecognition();
      setActive(false);
    } else {
      odeServices.data().trackSpeechAndText('STT');
      const started = editor?.commands.startSpeechRecognition() || false;
      setActive(started);
    }
  };

  const isAvailable =
    (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
      ? true
      : false;

  return { isAvailable, isActive, toggle };
};
