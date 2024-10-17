import { Mic, Pause, Record } from '../../../../icons/dist';

import { convertMsToMS } from '../../utils';
import { PlayState, RecordState } from './useAudioRecorder';

export interface AudioRecorderTimerProps {
  recordState: RecordState;
  playState: PlayState;
  recordTime: number | undefined;
  audioTime: number;
  maxDuration: number;
}

const AudioRecorderTimer = ({
  recordState,
  playState,
  recordTime,
  audioTime,
  maxDuration,
}: AudioRecorderTimerProps) => {
  return (
    <div className="audio-recorder-time my-16 mx-auto">
      {playState === 'IDLE' && (
        <div className="d-flex align-items-center">
          {recordState === 'PAUSED' ? (
            <Pause width={12} height={12} className="me-8 text-danger" />
          ) : (
            <Record width={12} height={12} className="me-8 text-danger" />
          )}
          {convertMsToMS(recordState !== 'IDLE' ? recordTime! : 0) +
            ' / ' +
            convertMsToMS(maxDuration)}
        </div>
      )}
      {playState !== 'IDLE' && (
        <div className="d-flex align-items-center mx-auto">
          <Mic width={12} height={12} className="me-8" />
          {convertMsToMS(audioTime * 1000)} /{convertMsToMS(recordTime!)}
        </div>
      )}
    </div>
  );
};

export default AudioRecorderTimer;
