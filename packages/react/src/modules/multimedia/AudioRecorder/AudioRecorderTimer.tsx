import { convertMsToMS } from '@edifice.io/utilities';
import { IconMic, IconPause, IconRecord } from '../../icons/components';
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
            <IconPause width={12} height={12} className="me-8 text-danger" />
          ) : (
            <IconRecord width={12} height={12} className="me-8 text-danger" />
          )}
          {convertMsToMS(recordState !== 'IDLE' ? recordTime! : 0) +
            ' / ' +
            convertMsToMS(maxDuration)}
        </div>
      )}
      {playState !== 'IDLE' && (
        <div className="d-flex align-items-center mx-auto">
          <IconMic width={12} height={12} className="me-8" />
          {convertMsToMS(audioTime * 1000)} /{convertMsToMS(recordTime!)}
        </div>
      )}
    </div>
  );
};

export default AudioRecorderTimer;
