import { WorkspaceElement } from '@edifice.io/client';

import { act, renderHook, waitFor } from '~/setup';
import {
  ToolbarDividerItem,
  ToolbarDropdownItem,
  ToolbarItem,
} from '../../../components';
import {
  installMediaHarness,
  installWebAudioHarness,
} from '../testing/mediaHarness';
import useAudioRecorder from './useAudioRecorder';

// This hook's toolbar only ever exposes button/icon items (record, save,
// etc.) - no dropdowns - so narrow that far to get real `onClick`/
// `disabled`/`aria-label` typing on `.props` instead of a loose cast.
type NonDividerToolbarItem = Exclude<
  ToolbarItem,
  ToolbarDividerItem | ToolbarDropdownItem
>;

const { create } = vi.hoisted(() => ({ create: vi.fn() }));

// Only useWorkspaceFile is doubled: the barrel also feeds the components.
vi.mock('../../../hooks', async (importOriginal) => ({
  ...(await importOriginal<typeof import('../../../hooks')>()),
  useWorkspaceFile: () => ({ create }),
}));

const A_BLOB = new Blob(['audio'], { type: 'audio/wav' });

function setup({
  hideSaveAction = false,
  visibility = 'protected' as const,
  application = 'media-library',
}: {
  hideSaveAction?: boolean;
  visibility?: 'public' | 'protected';
  application?: string;
} = {}) {
  const media = installMediaHarness();
  const audio = installWebAudioHarness();
  const onSaveSuccess = vi.fn();
  const onUpdateRecord = vi.fn();

  const view = renderHook(() =>
    useAudioRecorder(
      onSaveSuccess,
      onUpdateRecord,
      hideSaveAction,
      visibility,
      application,
    ),
  );

  return { ...view, ...media, ...audio, onSaveSuccess, onUpdateRecord };
}

type Harness = ReturnType<typeof setup>;

/** Finds a toolbar entry by the name the hook gives it. */
const item = (harness: Harness, name: string): NonDividerToolbarItem => {
  const found = harness.result.current.toolbarItems.find(
    (entry) => 'name' in entry && entry.name === name,
  );
  if (!found || found.type === 'divider' || found.type === 'dropdown') {
    throw new Error(`Expected a button/icon toolbar item named "${name}"`);
  }
  return found;
};

const click = async (harness: Harness, name: string) => {
  await act(async () => {
    (item(harness, name).props.onClick as () => void)();
  });
};

/** Starts a recording and waits for the audio graph to be wired. */
async function startRecording(harness: Harness) {
  await click(harness, 'record');
  await waitFor(() =>
    expect(harness.result.current.recordState).toBe('RECORDING'),
  );
}

/** Records, then pauses, which is what produces a playable audio URL. */
async function recordAndPause(harness: Harness) {
  await startRecording(harness);
  await click(harness, 'recordPause');
  await act(async () => {
    harness.worker().emit(A_BLOB);
  });
}

describe('useAudioRecorder', () => {
  describe('mounting', () => {
    it('spins up the encoder worker and initialises it', () => {
      const harness = setup();

      expect(harness.worker().url).toBe('/infra/public/js/audioEncoder.js');
      expect(harness.worker().postMessage).toHaveBeenCalledWith([
        'init',
        48000,
      ]);
    });

    it('starts idle, with an empty timer', () => {
      const { result } = setup();

      expect(result.current.recordState).toBe('IDLE');
      expect(result.current.playState).toBe('IDLE');
      expect(result.current.recordTime).toBe(0);
      expect(result.current.maxDuration).toBe(180_000);
    });

    it('terminates the worker on unmount', () => {
      const harness = setup();

      harness.unmount();

      expect(harness.worker().terminate).toHaveBeenCalled();
    });
  });

  describe('starting a recording', () => {
    it('asks for the microphone only', async () => {
      const harness = setup();

      await startRecording(harness);

      expect(harness.getUserMedia).toHaveBeenCalledWith({ audio: true });
    });

    it('opens the context at the expected sample rate', async () => {
      const harness = setup();

      await startRecording(harness);

      expect(harness.context().sampleRate).toBe(48000);
    });

    it('loads the recorder processor into the worklet', async () => {
      const harness = setup();

      await startRecording(harness);

      expect(harness.addModule).toHaveBeenCalledWith(
        '/infra/public/js/audio-recorder-processor.js',
      );
      expect(harness.workletNode().processorName).toBe(
        'audio-recorder-processor',
      );
    });

    it('wires the microphone through the worklet to the output', async () => {
      const harness = setup();

      await startRecording(harness);

      const source = harness.context().createMediaStreamSource.mock.results[0]
        .value as { connect: ReturnType<typeof vi.fn> };
      expect(source.connect).toHaveBeenCalledWith(harness.workletNode());
      expect(harness.workletNode().connect).toHaveBeenCalledWith(
        harness.context().destination,
      );
      expect(harness.workletNode().port.start).toHaveBeenCalled();
    });

    it('keeps recording even if the processor module fails to load', async () => {
      const error = vi.spyOn(console, 'error').mockImplementation(() => {});
      const harness = setup();
      harness.addModule.mockRejectedValue(new Error('404'));

      await startRecording(harness);

      expect(error).toHaveBeenCalled();
      expect(harness.result.current.recordState).toBe('RECORDING');
    });
  });

  describe('capturing samples', () => {
    it('accepts a stereo block', async () => {
      const harness = setup();
      await startRecording(harness);

      act(() => {
        harness
          .workletNode()
          .emitSamples([[new Float32Array([1]), new Float32Array([2])]]);
      });

      // Nothing observable until the encoder runs; the assertion is that
      // pushing samples does not throw and the recording is still live.
      expect(harness.result.current.recordState).toBe('RECORDING');
    });

    it('duplicates the left channel when the right one is missing', async () => {
      const harness = setup();
      await startRecording(harness);

      act(() => {
        harness.workletNode().emitSamples([[new Float32Array([1])]]);
      });
      await click(harness, 'recordPause');

      // The encoder receives both channels, the right one mirroring the left.
      const [, right, left] = harness.worker().lastMessage();
      expect(right).toEqual(left);
    });

    it('duplicates the left channel when the right one is all undefined', async () => {
      const harness = setup();
      await startRecording(harness);

      act(() => {
        harness
          .workletNode()
          .emitSamples([[new Float32Array([1]), [undefined, undefined]]]);
      });
      await click(harness, 'recordPause');

      const [, right, left] = harness.worker().lastMessage();
      expect(right).toEqual(left);
    });
  });

  describe('pausing a recording', () => {
    it('suspends the context and asks for a wav preview', async () => {
      const harness = setup();
      await startRecording(harness);

      await click(harness, 'recordPause');

      expect(harness.context().suspend).toHaveBeenCalled();
      expect(harness.worker().lastMessage()[0]).toBe('wav');
      expect(harness.result.current.recordState).toBe('PAUSED');
    });

    it('marks the encoding as running until the worker answers', async () => {
      const harness = setup();
      await startRecording(harness);

      await click(harness, 'recordPause');

      expect(item(harness, 'encoding').visibility).toBe('show');
    });

    it('publishes the encoded audio as a blob URL', async () => {
      const harness = setup();

      await recordAndPause(harness);

      expect(harness.createObjectURL).toHaveBeenCalledWith(A_BLOB);
      expect(harness.onUpdateRecord).toHaveBeenCalledWith('blob:audio/wav');
      expect(item(harness, 'encoding').visibility).toBe('hide');
    });

    it('reports the sample count in frames, not in blocks', async () => {
      const harness = setup();
      await startRecording(harness);
      act(() => {
        harness.workletNode().emitSamples([[new Float32Array([1])]]);
        harness.workletNode().emitSamples([[new Float32Array([2])]]);
      });

      await click(harness, 'recordPause');

      // 2 blocks of 128 sample-frames each.
      expect(harness.worker().lastMessage()[3]).toBe(256);
    });
  });

  describe('resuming a recording', () => {
    it('resumes the context instead of opening a new one', async () => {
      const harness = setup();
      await recordAndPause(harness);
      const context = harness.context();

      await click(harness, 'record');

      expect(context.resume).toHaveBeenCalled();
      expect(harness.context()).toBe(context);
      expect(harness.result.current.recordState).toBe('RECORDING');
    });

    it('clears the previously published record', async () => {
      const harness = setup();
      await recordAndPause(harness);

      await click(harness, 'record');

      expect(harness.onUpdateRecord).toHaveBeenLastCalledWith(undefined);
    });
  });

  describe('playing back', () => {
    it('plays the encoded record', async () => {
      const harness = setup();
      await recordAndPause(harness);

      await click(harness, 'play');

      expect(harness.result.current.playState).toBe('PLAYING');
    });

    it('pauses the playback', async () => {
      const harness = setup();
      await recordAndPause(harness);
      await click(harness, 'play');

      await click(harness, 'playPause');

      expect(harness.result.current.playState).toBe('PAUSED');
    });

    it('stops and rewinds', async () => {
      const harness = setup();
      await recordAndPause(harness);
      await click(harness, 'play');

      await click(harness, 'stop');

      expect(harness.result.current.playState).toBe('IDLE');
    });

    it('goes back to paused when the record ends', async () => {
      const harness = setup();
      await recordAndPause(harness);
      await click(harness, 'play');

      await act(async () => {
        harness.result.current.handlePlayEnded();
      });

      expect(harness.result.current.playState).toBe('PAUSED');
    });
  });

  describe('resetting', () => {
    it('releases the microphone and the audio graph', async () => {
      const harness = setup();
      await recordAndPause(harness);
      const context = harness.context();
      const node = harness.workletNode();

      await click(harness, 'reset');

      harness.stream
        .getTracks()
        .forEach((track) => expect(track.stop).toHaveBeenCalled());
      expect(node.port.removeEventListener).toHaveBeenCalled();
      expect(node.port.close).toHaveBeenCalled();
      expect(node.disconnect).toHaveBeenCalled();
      expect(context.close).toHaveBeenCalled();
    });

    it('returns to the idle state and clears the record', async () => {
      const harness = setup();
      await recordAndPause(harness);

      await click(harness, 'reset');

      expect(harness.result.current.recordState).toBe('IDLE');
      expect(harness.result.current.playState).toBe('IDLE');
      expect(harness.onUpdateRecord).toHaveBeenLastCalledWith(undefined);
    });
  });

  describe('saving', () => {
    const name = (harness: Harness, value: string) => {
      const input = document.createElement('input');
      input.value = value;
      // The hook reads the name straight from the ref the component binds.
      (
        harness.result.current.audioNameRef as unknown as {
          current: HTMLInputElement;
        }
      ).current = input;
    };

    it('refuses to save without a name', async () => {
      const error = vi.spyOn(console, 'error').mockImplementation(() => {});
      const harness = setup();
      await recordAndPause(harness);

      await act(async () => {
        await harness.result.current.handleSave();
      });

      expect(error).toHaveBeenCalledWith('Audio name is required');
      expect(create).not.toHaveBeenCalled();
    });

    it('asks the encoder for an mp3', async () => {
      const harness = setup();
      await recordAndPause(harness);
      name(harness, 'my record');

      await act(async () => {
        harness.result.current.handleSave();
      });

      expect(harness.worker().lastMessage()[0]).toBe('mp3');
      expect(harness.result.current.recordState).toBe('SAVING');
    });

    it('uploads the encoded file with the requested visibility', async () => {
      const resource = { _id: 'audio-id' } as WorkspaceElement;
      create.mockResolvedValue(resource);
      const harness = setup({ visibility: 'public', application: 'blog' });
      await recordAndPause(harness);
      name(harness, 'my record');

      let saved: WorkspaceElement | undefined;
      await act(async () => {
        const pending = harness.result.current.handleSave();
        harness.worker().emit(new Blob(['mp3'], { type: 'audio/mp3' }));
        saved = await pending;
      });

      expect(create).toHaveBeenCalledWith(expect.any(File), {
        application: 'blog',
        visibility: 'public',
      });
      expect(create.mock.calls[0][0].name).toBe('my record');
      expect(harness.onSaveSuccess).toHaveBeenCalledWith(resource);
      expect(saved).toBe(resource);
      expect(harness.result.current.recordState).toBe('SAVED');
    });

    it('ignores a worker answer that is not a blob', async () => {
      const harness = setup();
      await recordAndPause(harness);
      name(harness, 'my record');

      await act(async () => {
        harness.result.current.handleSave();
        harness.worker().emit('progress');
      });

      expect(create).not.toHaveBeenCalled();
      expect(harness.result.current.recordState).toBe('SAVING');
    });
  });

  describe('maximum duration', () => {
    beforeEach(() => {
      vi.useFakeTimers({ shouldAdvanceTime: true });
    });
    afterEach(() => {
      vi.useRealTimers();
    });

    it('follows the elapsed time of the audio context', async () => {
      const harness = setup();
      await startRecording(harness);

      harness.context().currentTime = 12;
      await act(async () => {
        vi.advanceTimersByTime(100);
      });

      expect(harness.result.current.recordTime).toBe(12_000);
    });

    it('pauses the recording once the limit is reached', async () => {
      const harness = setup();
      await startRecording(harness);

      harness.context().currentTime = 180;
      await act(async () => {
        vi.advanceTimersByTime(100);
      });

      expect(harness.result.current.recordState).toBe('PAUSED');
      expect(harness.context().suspend).toHaveBeenCalled();
    });

    it('locks the record button once the limit is reached', async () => {
      const harness = setup();
      await startRecording(harness);

      harness.context().currentTime = 180;
      await act(async () => {
        vi.advanceTimersByTime(100);
      });

      expect(item(harness, 'record').props.disabled).toBe(true);
    });
  });

  describe('toolbar', () => {
    it('offers the record button and hides the pause button when idle', () => {
      const harness = setup();

      expect(item(harness, 'record').visibility).toBe('show');
      expect(item(harness, 'recordPause').visibility).toBe('hide');
      expect(item(harness, 'record').props['aria-label']).toBe('Start');
    });

    it('swaps the two while recording', async () => {
      const harness = setup();

      await startRecording(harness);

      expect(item(harness, 'record').visibility).toBe('hide');
      expect(item(harness, 'recordPause').visibility).toBe('show');
    });

    it('labels the record button as a resume once paused', async () => {
      const harness = setup();
      await recordAndPause(harness);

      expect(item(harness, 'record').props['aria-label']).toBe(
        'bbm.audio.record.resume',
      );
    });

    it('disables playback until something is recorded', () => {
      const harness = setup();

      expect(item(harness, 'play').props.disabled).toBe(true);
      expect(item(harness, 'stop').props.disabled).toBe(true);
      expect(item(harness, 'reset').props.disabled).toBe(true);
    });

    it('opens playback and reset once paused', async () => {
      const harness = setup();
      await recordAndPause(harness);

      expect(item(harness, 'play').props.disabled).toBe(false);
      expect(item(harness, 'reset').props.disabled).toBe(false);
    });

    it('hides the play button while the encoder runs', async () => {
      const harness = setup();
      await startRecording(harness);

      await click(harness, 'recordPause');

      expect(item(harness, 'play').visibility).toBe('hide');
    });

    it('shows the save action by default', () => {
      const harness = setup();

      expect(item(harness, 'save').visibility).toBe('show');
    });

    it('hides the save action when the parent handles it', () => {
      const harness = setup({ hideSaveAction: true });

      expect(item(harness, 'save').visibility).toBe('hide');
    });

    it('keeps the save action disabled while the record has no name', async () => {
      const harness = setup();
      await recordAndPause(harness);

      expect(item(harness, 'save').props.disabled).toBe(true);
    });
  });
});
