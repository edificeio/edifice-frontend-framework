import { SpeechRecognition } from '@edifice.io/tiptap-extensions/speech-recognition';
import { Editor } from '@tiptap/core';

import { act, renderHook } from '~/setup';
import { createTestEditor } from '../test-utils/createTestEditor';
import { useSpeechRecognition } from './useSpeechRecognition';

vi.mock('@edifice.io/client', () => ({
  odeServices: { data: () => ({ trackSpeechAndText: vi.fn() }) },
}));

// jsdom has no Web Speech API: provide a minimal fake.
class FakeSpeechRecognition {
  start = vi.fn();
  stop = vi.fn();
}

describe('useSpeechRecognition', () => {
  let editor: Editor;

  beforeEach(() => {
    vi.stubGlobal('SpeechRecognition', FakeSpeechRecognition);
    editor = createTestEditor({ extensions: [SpeechRecognition] });
  });

  afterEach(() => {
    editor.destroy();
    vi.unstubAllGlobals();
  });

  it('becomes inactive when the recognition session ends on its own', () => {
    const { result } = renderHook(() => useSpeechRecognition(editor as any));

    act(() => result.current.toggle());
    expect(result.current.isActive).toBeTruthy();

    act(() => {
      editor.emit('speechRecognitionEnd', { editor });
    });
    expect(result.current.isActive).toBe(false);
  });
});
