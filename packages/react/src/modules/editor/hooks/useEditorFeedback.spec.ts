import { Feedback } from '@edifice.io/tiptap-extensions/feedback';
import { Editor } from '@tiptap/core';

import { renderHook } from '~/setup';
import { createTestEditor } from '../test-utils/createTestEditor';
import { useEditorFeedback } from './useEditorFeedback';

const { toastError, toastWarning } = vi.hoisted(() => ({
  toastError: vi.fn(),
  toastWarning: vi.fn(),
}));

vi.mock('../../../hooks/useToast/useToast', () => ({
  default: () => ({ error: toastError, warning: toastWarning }),
}));

describe('useEditorFeedback', () => {
  let editor: Editor;

  beforeEach(() => {
    editor = createTestEditor({ extensions: [Feedback] });
  });

  afterEach(() => {
    editor.destroy();
    vi.clearAllMocks();
  });

  it('displays a toast matching the feedback level and code', () => {
    renderHook(() => useEditorFeedback(editor as any));

    editor.commands.notifyFeedback({
      source: 'speech-recognition',
      code: 'not-allowed',
      level: 'error',
    });

    expect(toastError).toHaveBeenCalledWith(expect.any(String), {
      id: 'tiptap-feedback-speech-recognition-not-allowed',
    });
    expect(toastWarning).not.toHaveBeenCalled();
  });

  it('stops listening on unmount', () => {
    const { unmount } = renderHook(() => useEditorFeedback(editor as any));
    unmount();

    editor.commands.notifyFeedback({
      source: 'speech-recognition',
      code: 'no-speech',
      level: 'warning',
    });

    expect(toastWarning).not.toHaveBeenCalled();
  });
});
