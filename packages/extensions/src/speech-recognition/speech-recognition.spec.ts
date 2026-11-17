import { Editor } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Feedback } from '../feedback';
import { SpeechRecognition } from './speech-recognition';

// jsdom has no Web Speech API: provide a minimal fake, capturing instances.
class FakeSpeechRecognition {
  static last: FakeSpeechRecognition | undefined;
  onerror: ((event: Partial<SpeechRecognitionErrorEvent>) => void) | null =
    null;
  onend: (() => void) | null = null;
  start = vi.fn();
  stop = vi.fn();
  constructor() {
    FakeSpeechRecognition.last = this;
  }
}

describe('SpeechRecognition error feedback', () => {
  let editor: Editor | undefined;

  beforeEach(() => {
    vi.stubGlobal('SpeechRecognition', FakeSpeechRecognition);
    vi.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    editor?.destroy();
    editor = undefined;
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  function startWithError(error: string) {
    editor!.commands.startSpeechRecognition();
    FakeSpeechRecognition.last!.onerror!({ error, message: 'details' } as any);
  }

  it('raises an error feedback on recognition error', () => {
    editor = new Editor({
      extensions: [StarterKit, Feedback, SpeechRecognition],
    });
    const listener = vi.fn();
    editor.on('feedback', listener);

    startWithError('not-allowed');

    expect(listener).toHaveBeenCalledWith(
      expect.objectContaining({
        feedback: {
          source: 'speech-recognition',
          code: 'not-allowed',
          level: 'error',
          details: 'details',
        },
      }),
    );
  });

  it('raises a warning feedback when no speech was detected', () => {
    editor = new Editor({
      extensions: [StarterKit, Feedback, SpeechRecognition],
    });
    const listener = vi.fn();
    editor.on('feedback', listener);

    startWithError('no-speech');

    expect(listener.mock.calls[0][0].feedback.level).toBe('warning');
  });

  it('ignores the "aborted" error, raised by an intentional stop', () => {
    editor = new Editor({
      extensions: [StarterKit, Feedback, SpeechRecognition],
    });
    const listener = vi.fn();
    editor.on('feedback', listener);

    startWithError('aborted');

    expect(listener).not.toHaveBeenCalled();
  });

  it('does not fail when the feedback extension is not registered', () => {
    editor = new Editor({ extensions: [StarterKit, SpeechRecognition] });

    expect(() => startWithError('network')).not.toThrow();
  });
});

describe('SpeechRecognition end event', () => {
  let editor: Editor;

  beforeEach(() => {
    vi.stubGlobal('SpeechRecognition', FakeSpeechRecognition);
    editor = new Editor({ extensions: [StarterKit, SpeechRecognition] });
  });

  afterEach(() => {
    editor.destroy();
    vi.unstubAllGlobals();
  });

  it('emits "speechRecognitionEnd" when the session ends', () => {
    const listener = vi.fn();
    editor.on('speechRecognitionEnd', listener);

    editor.commands.startSpeechRecognition();
    FakeSpeechRecognition.last!.onend!();

    expect(listener).toHaveBeenCalledWith({ editor });
  });

  it('ignores the late end of a session replaced by a new one', () => {
    const listener = vi.fn();
    editor.on('speechRecognitionEnd', listener);

    editor.commands.startSpeechRecognition();
    const previous = FakeSpeechRecognition.last!;
    editor.commands.startSpeechRecognition();
    previous.onend!();

    expect(listener).not.toHaveBeenCalled();
  });
});
