import { Editor, Extension } from '@tiptap/core';

export type FeedbackLevel = 'info' | 'success' | 'warning' | 'error';

/**
 * A user-facing feedback raised by an extension.
 *
 * This extension stays UI-agnostic: it only carries a translatable `code`.
 * The host application decides how to render it (toast, inline alert...),
 * typically through a `feedback` event listener on the editor.
 */
export interface EditorFeedback {
  /** Name of the extension raising the feedback, e.g. `speech-recognition`. */
  source: string;
  /** Machine-readable reason, e.g. `not-allowed`. Used to pick a message. */
  code: string;
  level: FeedbackLevel;
  /** Technical details, for logging only (not meant to be displayed). */
  details?: string;
}

export interface FeedbackOptions {
  /** Optional callback, called for every feedback, in addition to the event. */
  onFeedback?: (feedback: EditorFeedback) => void;
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    feedback: {
      /** Raise a user-facing feedback (emits the editor `feedback` event). */
      notifyFeedback: (feedback: EditorFeedback) => ReturnType;
    };
  }

  interface EditorEvents {
    feedback: { editor: Editor; feedback: EditorFeedback };
  }
}

export const Feedback = Extension.create<FeedbackOptions>({
  name: 'feedback',

  addOptions() {
    return {
      onFeedback: undefined,
    };
  },

  addCommands() {
    return {
      notifyFeedback:
        (feedback) =>
        ({ editor }) => {
          this.options.onFeedback?.(feedback);
          editor.emit('feedback', { editor, feedback });
          return true;
        },
    };
  },
});
