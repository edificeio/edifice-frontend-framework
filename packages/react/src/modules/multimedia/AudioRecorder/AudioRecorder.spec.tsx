import { createRef } from 'react';

import { WorkspaceElement } from '@edifice.io/client';

import { act, fireEvent, render, screen, waitFor } from '~/setup';

import {
  installMediaHarness,
  installWebAudioHarness,
} from '../testing/mediaHarness';
import AudioRecorder, { AudioRecorderRef } from './AudioRecorder';

const { create } = vi.hoisted(() => ({ create: vi.fn() }));

vi.mock('../../../hooks', async (importOriginal) => ({
  ...(await importOriginal<typeof import('../../../hooks')>()),
  useWorkspaceFile: () => ({ create }),
}));

function setup({
  hideSaveAction = false,
  micFailure,
}: {
  hideSaveAction?: boolean;
  micFailure?: unknown;
} = {}) {
  const media = installMediaHarness();
  if (micFailure) media.getUserMedia.mockRejectedValue(micFailure);
  const audio = installWebAudioHarness();
  const onSaveSuccess = vi.fn();
  const onRecordUpdated = vi.fn();
  const onNameChange = vi.fn();
  const ref = createRef<AudioRecorderRef>();

  const view = render(
    <AudioRecorder
      ref={ref}
      onSaveSuccess={onSaveSuccess}
      onRecordUpdated={onRecordUpdated}
      onNameChange={onNameChange}
      hideSaveAction={hideSaveAction}
    />,
  );

  return {
    ...view,
    ...media,
    ...audio,
    onSaveSuccess,
    onRecordUpdated,
    onNameChange,
    ref,
  };
}

const nameInput = () =>
  screen.getByPlaceholderText('Name of your recording') as HTMLInputElement;
const audioElement = () =>
  document.querySelector('audio') as HTMLAudioElement & {
    currentTime: number;
  };
const micIcon = () => document.querySelector('.audio-recorder-icon');
const readout = () => document.querySelector('.audio-recorder-time');

const recordButton = () => screen.getByRole('button', { name: 'record' });
const recordPauseButton = () =>
  screen.getByRole('button', { name: 'recordPause' });
const playButton = () => screen.getByRole('button', { name: 'play' });
const resetButton = () => screen.getByRole('button', { name: 'reset' });
const saveButton = () => screen.queryByRole('button', { name: 'save' });

describe('AudioRecorder', () => {
  describe('naming the record', () => {
    it('prefills a name built from the current date', () => {
      setup();

      expect(nameInput().value).toMatch(
        /^\d{4}-\d{2}-\d{2} \d{2}h\d{2}\s+Record/,
      );
    });

    it('lets the user rename the record', async () => {
      const { user } = setup();

      await user.clear(nameInput());
      await user.type(nameInput(), 'interview');

      expect(nameInput().value).toBe('interview');
    });

    it('reports each name change to the parent', async () => {
      const { user, onNameChange } = setup();

      await user.clear(nameInput());
      expect(onNameChange).toHaveBeenLastCalledWith('');

      await user.type(nameInput(), 'a');
      expect(onNameChange).toHaveBeenLastCalledWith('a');
    });
  });

  describe('microphone access', () => {
    it('shows an empty screen instead of the recorder when refused', async () => {
      vi.spyOn(console, 'error').mockImplementation(() => {});
      setup({ micFailure: new Error('NotAllowedError') });

      expect(
        await screen.findByText('A problem occurred with your microphone.'),
      ).toBeInTheDocument();
      expect(
        document.querySelector('.audio-recorder-error-illustration'),
      ).not.toBeNull();
      expect(document.querySelector('.audio-recorder')).toBeNull();
    });

    it('keeps the recorder when the microphone is available', async () => {
      const { getUserMedia } = setup();

      await waitFor(() => expect(getUserMedia).toHaveBeenCalled());
      expect(document.querySelector('.audio-recorder')).not.toBeNull();
    });
  });

  describe('layout', () => {
    it('shows the microphone, the timer and the toolbar', () => {
      setup();

      expect(micIcon()).not.toBeNull();
      expect(readout()).toHaveTextContent('00:00 / 03:00');
      expect(recordButton()).toBeInTheDocument();
    });

    it('paints the microphone red while recording', async () => {
      const { user } = setup();

      await user.click(recordButton());

      await waitFor(() =>
        expect(micIcon()).toHaveClass('audio-recorder-icon--recording'),
      );
    });

    it('paints the microphone green while playing', async () => {
      const harness = setup();

      await harness.user.click(recordButton());
      await waitFor(() =>
        expect(micIcon()).toHaveClass('audio-recorder-icon--recording'),
      );
      await harness.user.click(recordPauseButton());
      await act(async () => {
        harness.worker().emit(new Blob(['wav'], { type: 'audio/wav' }));
      });
      await harness.user.click(playButton());

      expect(micIcon()).toHaveClass('audio-recorder-icon--playing');
    });

    it('hides the save action when the parent handles it', () => {
      setup({ hideSaveAction: true });

      expect(saveButton()).toBeNull();
    });
  });

  describe('the audio element', () => {
    it('follows the playback position', async () => {
      const harness = setup();
      await harness.user.click(recordButton());
      await harness.user.click(recordPauseButton());
      await act(async () => {
        harness.worker().emit(new Blob(['wav'], { type: 'audio/wav' }));
      });
      await harness.user.click(playButton());

      audioElement().currentTime = 5;
      fireEvent.timeUpdate(audioElement());

      expect(readout()).toHaveTextContent('00:05 /');
    });

    it('goes back to paused when the record reaches its end', async () => {
      const harness = setup();
      await harness.user.click(recordButton());
      await harness.user.click(recordPauseButton());
      await act(async () => {
        harness.worker().emit(new Blob(['wav'], { type: 'audio/wav' }));
      });
      await harness.user.click(playButton());

      fireEvent.ended(audioElement());

      // Back to a paused playback: the play button is offered again.
      expect(playButton()).toBeEnabled();
    });
  });

  describe('a full recording round', () => {
    it('publishes the record, then uploads it under the given name', async () => {
      const resource = { _id: 'audio-id' } as WorkspaceElement;
      create.mockResolvedValue(resource);
      const harness = setup();

      await harness.user.click(recordButton());
      await harness.user.click(recordPauseButton());
      await act(async () => {
        harness.worker().emit(new Blob(['wav'], { type: 'audio/wav' }));
      });

      expect(harness.onRecordUpdated).toHaveBeenCalledWith('blob:audio/wav');

      await harness.user.clear(nameInput());
      await harness.user.type(nameInput(), 'interview');
      await act(async () => {
        const pending = harness.ref.current?.save();
        harness.worker().emit(new Blob(['mp3'], { type: 'audio/mp3' }));
        await pending;
      });

      expect(create.mock.calls[0][0].name).toBe('interview');
      expect(harness.onSaveSuccess).toHaveBeenCalledWith(resource);
    });

    it('locks the name field once the record is saved', async () => {
      create.mockResolvedValue({ _id: 'audio-id' } as WorkspaceElement);
      const harness = setup();

      await harness.user.click(recordButton());
      await harness.user.click(recordPauseButton());
      await act(async () => {
        harness.worker().emit(new Blob(['wav'], { type: 'audio/wav' }));
      });
      await act(async () => {
        const pending = harness.ref.current?.save();
        harness.worker().emit(new Blob(['mp3'], { type: 'audio/mp3' }));
        await pending;
      });

      await waitFor(() => expect(nameInput()).toHaveAttribute('readonly'));
    });

    it('discards the record and releases the microphone', async () => {
      const harness = setup();

      await harness.user.click(recordButton());
      await harness.user.click(recordPauseButton());
      await act(async () => {
        harness.worker().emit(new Blob(['wav'], { type: 'audio/wav' }));
      });
      await harness.user.click(resetButton());

      harness.stream
        .getTracks()
        .forEach((track) => expect(track.stop).toHaveBeenCalled());
      expect(harness.onRecordUpdated).toHaveBeenLastCalledWith(undefined);
      expect(readout()).toHaveTextContent('00:00 / 03:00');
    });
  });
});
