import { Editor } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { EditorFeedback, Feedback } from './feedback';

const feedback: EditorFeedback = {
  source: 'test',
  code: 'some-error',
  level: 'error',
  details: 'technical details',
};

describe('Feedback', () => {
  let editor: Editor | undefined;

  afterEach(() => {
    editor?.destroy();
    editor = undefined;
  });

  it('emits a "feedback" event on the editor', () => {
    editor = new Editor({ extensions: [StarterKit, Feedback] });
    const listener = vi.fn();
    editor.on('feedback', listener);

    const result = editor.commands.notifyFeedback(feedback);

    expect(result).toBe(true);
    expect(listener).toHaveBeenCalledWith({ editor, feedback });
  });

  it('calls the onFeedback option', () => {
    const onFeedback = vi.fn();
    editor = new Editor({
      extensions: [StarterKit, Feedback.configure({ onFeedback })],
    });

    editor.commands.notifyFeedback(feedback);

    expect(onFeedback).toHaveBeenCalledWith(feedback);
  });
});
