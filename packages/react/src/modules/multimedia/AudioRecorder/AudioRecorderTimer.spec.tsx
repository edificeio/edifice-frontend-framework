import { render } from '~/setup';

import AudioRecorderTimer, {
  AudioRecorderTimerProps,
} from './AudioRecorderTimer';

const MAX_DURATION = 180_000; // 3 minutes, the recorder default

function setup(props: Partial<AudioRecorderTimerProps> = {}) {
  return render(
    <AudioRecorderTimer
      recordState="IDLE"
      playState="IDLE"
      recordTime={0}
      audioTime={0}
      maxDuration={MAX_DURATION}
      {...props}
    />,
  );
}

const readout = () => document.querySelector('.audio-recorder-time');

describe('AudioRecorderTimer', () => {
  describe('while recording', () => {
    it('shows the elapsed time against the maximum duration', () => {
      setup({ recordState: 'RECORDING', recordTime: 62_000 });

      expect(readout()).toHaveTextContent('01:02 / 03:00');
    });

    it('stays at zero as long as nothing has been recorded', () => {
      setup({ recordState: 'IDLE', recordTime: 12_000 });

      // The elapsed time is deliberately ignored in the IDLE state.
      expect(readout()).toHaveTextContent('00:00 / 03:00');
    });

    it('marks the recording with a record dot', () => {
      const { container } = setup({ recordState: 'RECORDING' });

      expect(container.querySelector('.text-danger')).not.toBeNull();
    });

    it.each(['RECORDED', 'SAVING', 'SAVED'] as const)(
      'keeps showing the recorded length in the %s state',
      (recordState) => {
        setup({ recordState, recordTime: 5_000 });

        expect(readout()).toHaveTextContent('00:05 / 03:00');
      },
    );
  });

  describe('while playing', () => {
    it('shows the playback position against the recorded length', () => {
      setup({
        playState: 'PLAYING',
        // audioTime comes from the <audio> element, in seconds.
        audioTime: 3,
        recordTime: 62_000,
      });

      expect(readout()).toHaveTextContent('00:03 /01:02');
    });

    it('keeps the playback readout while paused', () => {
      setup({ playState: 'PAUSED', audioTime: 1, recordTime: 10_000 });

      expect(readout()).toHaveTextContent('00:01 /00:10');
    });

    it('swaps the record dot for a microphone', () => {
      const { container } = setup({ playState: 'PLAYING', recordTime: 1_000 });

      expect(container.querySelector('.text-danger')).toBeNull();
      expect(container.querySelector('svg')).not.toBeNull();
    });
  });
});
